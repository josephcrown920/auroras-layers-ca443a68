import { useEffect, useRef, useState } from "react";
import { streamImage } from "@/lib/streamImage";
import { onStudioPrompt } from "@/lib/studioBus";
import {
  deleteProject,
  downloadDataUrl,
  exportProjectZip,
  loadProjects,
  saveProject,
  type LayerProject,
} from "@/lib/projects";

const PRESETS = [
  "Turn the outfit into full trap streetwear — puffer jacket, iced-out cuban chains, designer shades",
  "Give her long neon-green braids and oversized varsity jacket",
  "Add a red bandana, backwards fitted cap and gold rope chain",
  "Relight the scene as a night block party with neon signage",
];

const MODELS = [
  { id: "google/gemini-3-pro-image", label: "Banana Pro", note: "Best likeness" },
  { id: "google/gemini-3.1-flash-image", label: "Banana Flash", note: "Fastest" },
  { id: "openai/gpt-image-2", label: "GPT Image 2", note: "Graphic / text" },
];

const IDENTITY_LOCK =
  "Keep the same person: identical face, skin tone, hair, body, pose, camera angle and framing. Do not mirror or flip the image. Change only what is described.";

type Layer = { id: string; prompt: string; dataUrl: string };

export function LayerStudio() {
  const [prompt, setPrompt] = useState<string>(PRESETS[0] ?? "");
  const [model, setModel] = useState<string>(MODELS[0]!.id);
  const [lockIdentity, setLockIdentity] = useState(true);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [isFinal, setIsFinal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<LayerProject[]>([]);
  const [projectId, setProjectId] = useState<string>(() => crypto.randomUUID());
  const [name, setName] = useState("Untitled shoot");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => setProjects(loadProjects()), []);
  useEffect(() => onStudioPrompt((p) => setPrompt(p)), []);

  const result = layers.find((l) => l.id === active)?.dataUrl ?? null;

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
    setIsFinal(false);
    const id = crypto.randomUUID();
    // chain edits: the latest layer becomes the source so identity carries forward
    const base = result ?? sourceUrl;
    try {
      await streamImage(
        "/api/generate-image",
        {
          prompt: lockIdentity && base ? `${prompt.trim()}. ${IDENTITY_LOCK}` : prompt.trim(),
          model,
          ...(base ? { imageDataUrl: base } : {}),
        },
        (dataUrl, final) => {
          setLayers((prev) => {
            const without = prev.filter((l) => l.id !== id);
            return [...without, { id, prompt: prompt.trim(), dataUrl }];
          });
          setActive(id);
          if (final) setIsFinal(true);
        },
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  function currentProject(): LayerProject {
    return {
      id: projectId,
      name: name.trim() || "Untitled shoot",
      prompt,
      model,
      createdAt: Date.now(),
      ...(sourceUrl ? { sourceUrl } : {}),
      layers,
    };
  }

  function onSave() {
    if (layers.length === 0) return;
    setProjects(saveProject(currentProject()));
  }

  function openProject(p: LayerProject) {
    setProjectId(p.id);
    setName(p.name);
    setPrompt(p.prompt);
    setModel(p.model);
    setSourceUrl(p.sourceUrl ?? null);
    setLayers(p.layers);
    setActive(p.layers[p.layers.length - 1]?.id ?? null);
    setIsFinal(true);
  }

  function newProject() {
    setProjectId(crypto.randomUUID());
    setName("Untitled shoot");
    setLayers([]);
    setActive(null);
    setSourceUrl(null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm font-bold outline-none hover:border-border focus:border-primary"
            aria-label="Project name"
          />
          <button
            type="button"
            onClick={newProject}
            className="rounded-full border border-border px-3 py-1 text-[0.65rem] tracking-wider uppercase transition-colors hover:border-primary hover:text-primary"
          >
            New
          </button>
        </div>

        <p className="mt-4 font-[family-name:var(--font-mono-ui)] text-[0.65rem] tracking-[0.25em] text-muted-foreground uppercase">
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
          Step 02 — Engine
        </p>
        <div className="mt-3 grid grid-cols-3 gap-1 rounded-full bg-secondary p-1 text-center text-xs">
          {MODELS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setModel(m.id)}
              title={m.note}
              className={
                model === m.id
                  ? "btn-aurora rounded-full py-2 font-bold"
                  : "rounded-full py-2 text-muted-foreground transition-colors hover:text-foreground"
              }
            >
              {m.label}
            </button>
          ))}
        </div>

        <label className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={lockIdentity}
            onChange={(e) => setLockIdentity(e.target.checked)}
            className="accent-primary"
          />
          Lock identity, pose & framing (recommended)
        </label>

        <p className="mt-6 font-[family-name:var(--font-mono-ui)] text-[0.65rem] tracking-[0.25em] text-muted-foreground uppercase">
          Step 03 — Layer prompt
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
          className="btn-aurora mt-5 w-full rounded-full px-6 py-3.5 text-sm font-bold tracking-widest uppercase transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {busy ? "Rendering layer…" : layers.length ? "✦ Stack another layer" : "✦ Run layer edit"}
        </button>

        {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

        {projects.length > 0 ? (
          <div className="mt-6 border-t border-border pt-4">
            <p className="font-[family-name:var(--font-mono-ui)] text-[0.65rem] tracking-[0.25em] text-muted-foreground uppercase">
              Saved projects
            </p>
            <ul className="mt-3 space-y-1">
              {projects.map((p) => (
                <li key={p.id} className="flex items-center gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => openProject(p)}
                    className="flex-1 truncate rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-secondary"
                  >
                    {p.name}{" "}
                    <span className="text-muted-foreground">· {p.layers.length} layers</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => void exportProjectZip(p)}
                    className="text-[0.65rem] tracking-wider text-accent uppercase"
                  >
                    zip
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjects(deleteProject(p.id))}
                    className="text-[0.65rem] tracking-wider text-muted-foreground uppercase hover:text-destructive"
                  >
                    del
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-4">
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

        {layers.length > 0 ? (
          <>
            <div className="flex gap-2 overflow-x-auto">
              {layers.map((l, i) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setActive(l.id)}
                  className={
                    l.id === active
                      ? "size-16 shrink-0 overflow-hidden rounded-lg border-2 border-primary"
                      : "size-16 shrink-0 overflow-hidden rounded-lg border border-border opacity-70"
                  }
                  title={`Layer ${i + 1}: ${l.prompt}`}
                >
                  <img src={l.dataUrl} alt={`Layer ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onSave}
                className="rounded-full border border-primary px-4 py-2 text-[0.7rem] font-bold tracking-wider text-primary uppercase transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Save project
              </button>
              <button
                type="button"
                onClick={() => result && downloadDataUrl(result, "aurora-layer.png")}
                className="rounded-full border border-border px-4 py-2 text-[0.7rem] font-bold tracking-wider uppercase transition-colors hover:border-primary hover:text-primary"
              >
                Download PNG
              </button>
              <button
                type="button"
                onClick={() =>
                  layers.forEach((l, i) => downloadDataUrl(l.dataUrl, `aurora-layer-${i + 1}.png`))
                }
                className="rounded-full border border-border px-4 py-2 text-[0.7rem] font-bold tracking-wider uppercase transition-colors hover:border-primary hover:text-primary"
              >
                All layers
              </button>
              <button
                type="button"
                onClick={() => void exportProjectZip(currentProject())}
                className="btn-aurora rounded-full px-4 py-2 text-[0.7rem] font-bold tracking-wider uppercase"
              >
                Export ZIP
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
