import { createFileRoute } from "@tanstack/react-router";

type Body = {
  prompt: string;
  imageDataUrl?: string;
  stream?: boolean;
};

export const Route = createFileRoute("/api/generate-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { prompt, imageDataUrl, stream = true } = (await request.json()) as Body;

        if (!prompt || typeof prompt !== "string" || prompt.trim().length < 2) {
          return new Response(JSON.stringify({ error: "A prompt is required." }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) {
          return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        const content: Array<Record<string, unknown>> = [{ type: "text", text: prompt }];
        if (imageDataUrl?.startsWith("data:image/")) {
          content.push({ type: "image_url", image_url: { url: imageDataUrl } });
        }

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-pro-image",
            messages: [{ role: "user", content }],
            modalities: ["image", "text"],
            ...(stream ? { stream: true } : {}),
          }),
        });

        if (!upstream.ok || !upstream.body) {
          const text = await upstream.text().catch(() => "");
          return new Response(text || JSON.stringify({ error: "Image generation failed" }), {
            status: upstream.status,
            headers: { "Content-Type": "application/json" },
          });
        }

        if (!stream) {
          return new Response(upstream.body, {
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(upstream.body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
          },
        });
      },
    },
  },
});
