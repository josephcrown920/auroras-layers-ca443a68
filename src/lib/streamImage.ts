type Frame = (dataUrl: string, isFinal: boolean) => void;

function toDataUrl(b64: string) {
  return b64.startsWith("data:") ? b64 : `data:image/png;base64,${b64}`;
}

function extractB64(payload: unknown): string | null {
  const p = payload as Record<string, any> | null;
  if (!p) return null;
  return (
    p.b64_json ??
    p.image?.b64_json ??
    p.data?.[0]?.b64_json ??
    p.partial_image_b64 ??
    p.choices?.[0]?.message?.images?.[0]?.image_url?.url ??
    null
  );
}

/**
 * POSTs a prompt (plus optional source image) to a streaming image route and
 * emits every partial frame, then the final image.
 */
export async function streamImage(
  endpoint: string,
  body: { prompt: string; imageDataUrl?: string },
  onFrame: Frame,
): Promise<void> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Image request failed (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let events = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() ?? "";

    for (const chunk of chunks) {
      for (const line of chunk.split("\n")) {
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (!data || data === "[DONE]") continue;
        try {
          const parsed = JSON.parse(data);
          const b64 = extractB64(parsed);
          if (!b64) continue;
          events++;
          const type: string = parsed.type ?? "";
          onFrame(toDataUrl(b64), type.includes("completed") || !type.includes("partial"));
        } catch {
          /* ignore keepalive / non-JSON lines */
        }
      }
    }
  }

  if (events > 0) return;

  // Zero-event stream: replay once without streaming.
  const fallback = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, stream: false }),
  });
  if (!fallback.ok) {
    throw new Error((await fallback.text().catch(() => "")) || "Image generation failed");
  }
  const json = await fallback.json();
  const b64 = extractB64(json);
  if (!b64) throw new Error("No image returned");
  onFrame(toDataUrl(b64), true);
}
