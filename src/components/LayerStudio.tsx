import { useRef, useState } from "react";
import { streamImage } from "@/lib/streamImage";

const PRESETS = [
  "Turn the outfit into full trap streetwear — puffer jacket, iced-out cuban chains, designer shades",
  "Give her long neon-green braids and oversized varsity jacket",
  "Add a red bandana, backwards fitted cap and gold rope chain",
  "Relight the scene as a night block party with neon signage",
];

export function LayerStudio() {
  const [prompt, setPrompt] = useState<string>(PRESETS[0] ?? "");
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isFinal, setIsFinal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function onFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSourceUrl(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function run() {
    if (busy || !prompt.trim()) return;
    setBusy(true);
    setError(null);
    setResult(null);
    setIsFinal(false);
    try {
      await streamImage(
        "/api/generate-image",
        { prompt, ...(sourceUrl ? { imageDataUrl: sourceUrl } : {}) },
        (dataUrl, final) => {
          setResult(dataUrl);
          if (final) setIsFinal(true);
        },
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="font-[family-name:var(--font-mono-ui)] text-[0.65rem] tracking-[0.25em] text-muted-foreground uppercase">
          Step 01 — Source layer
        </p>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="mt-3 flex aspect-4/3 w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-secondary/40 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          {sourceUrl ? (
            <img src={sourceUrl} alt="Uploaded source" className="h-full w-full object-cover" />
          ) : (
            "+ Upload media (optional)"
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />

        <p className="mt-6 font-[family-name:var(--font-mono-ui)] text-[0.65rem] tracking-[0.25em] text-muted-foreground uppercase">
          Step 02 — Layer prompt
        </p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          className="mt-3 w-full resize-none rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none focus:border-primary"
          placeholder="Type your prompt here..."
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPrompt(p)}
              className="rounded-full border border-border px-3 py-1.5 text-left text-[0.7rem] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {p.slice(0, 34)}…
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={run}
          disabled={busy}
          className="mt-5 w-full rounded-full bg-primary px-6 py-3.5 text-sm font-bold tracking-widest text-primary-foreground uppercase transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {busy ? "Rendering layer…" : "✦ Run layer edit"}
        </button>

        {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      </div>

      <div className="glow-frame relative flex min-h-[340px] items-center justify-center bg-card">
        <span className="label-chip absolute -top-4 left-5 z-10">Output</span>
        {result ? (
          <img
            src={result}
            alt="Generated layer edit"
            className={
              isFinal
                ? "h-full w-full object-cover blur-0 transition-[filter] duration-500"
                : "h-full w-full object-cover blur-2xl transition-[filter] duration-500"
            }
          />
        ) : (
          <p className="px-8 text-center font-[family-name:var(--font-mono-ui)] text-xs tracking-[0.25em] text-muted-foreground uppercase">
            {busy ? "Decomposing · editing · recomposing" : "Your edited frame lands here"}
          </p>
        )}
      </div>
    </div>
  );
}
