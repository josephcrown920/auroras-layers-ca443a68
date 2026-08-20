# Aurora Performance Studio — Layers

Turn any flat image into editable layers. Upload a frame, describe the change in one
sentence, and only that layer re-renders. Built on TanStack Start + Lovable AI.

## What's inside

- **Landing page** (`src/routes/index.tsx`) — Aurora-branded marketing page: hero, layer
  decomposition walkthrough, outfit-swap and face-swap comparisons, live studio, CTA.
- **Layer Studio** (`src/components/LayerStudio.tsx`) — working UI: optional image upload,
  prompt box with trap/hip-hop presets, streaming output preview.
- **Image API** (`src/routes/api/generate-image.ts`) — server route that calls the Lovable AI
  Gateway (`google/gemini-3-pro-image`) and streams frames back as SSE.
- **Stream client** (`src/lib/streamImage.ts`) — SSE parser with a non-streaming fallback.

## How to use it

1. Open the site and scroll to **The Studio** section (or hit "Open Studio" in the hero).
2. **Upload media** (optional). Any photo works — a selfie, a press shot, a still.
   With no upload, the prompt generates a fresh frame instead of editing one.
3. **Write a layer prompt**, e.g. `Turn the outfit into full trap streetwear — puffer jacket,
   iced-out cuban chains, designer shades`. Tap a preset chip to autofill.
4. Press **Run layer edit**. A blurred partial frame appears first, then sharpens into the
   final render.
5. Right-click / long-press the output to save it.

### Prompt tips

- Name the layer first ("her jacket", "his chain", "the background"), then the change.
- Add `preserve exact facial likeness, hairstyle and body proportions` to keep identity.
- Stack edits by re-uploading the previous output as the new source.

## Running locally

```sh
npm install
npm run dev      # http://localhost:8080
```

## Configuration

`LOVABLE_API_KEY` is provisioned automatically by Lovable Cloud and read server-side only
inside the API route. Nothing else to set up.

Errors from the AI gateway (rate limits, credit exhaustion) surface directly under the
Run button so you always know why a render didn't land.

## New in this build

- **Aurora Director (AI agent)** — a cinematic brain (Gemini 3.7 Flash, streaming) that returns
  LOGLINE / SHOT / LIGHT / WARDROBE / PALETTE / PROMPT / NEXT for any idea. One click sends the
  generated PROMPT straight into the studio.
- **Engine picker** — Banana Pro (`google/gemini-3-pro-image`), Banana Flash
  (`google/gemini-3.1-flash-image`), GPT Image 2 (`openai/gpt-image-2`).
- **Identity lock** — every edit re-feeds the previous render as the source and appends a
  "same face, skin tone, pose, framing, no mirroring" instruction so characters stay consistent.
- **Layer stack** — each generation is a layer; click a thumbnail to revisit any state.
- **Projects** — name, save, reopen and delete shoots (stored in your browser).
- **Export** — download the active frame as PNG, all layers as PNGs, or the whole project as a ZIP
  (source + numbered layers + final composite + `recipe.txt`).

### How to use

1. Scroll to **Direct your shoot**.
2. Pitch a scene to the Director → press **Send prompt to studio**.
3. Upload a reference image (optional), pick an engine, keep **Lock identity** on.
4. **Run layer edit**, then **Stack another layer** for each change.
5. **Save project** and **Export ZIP**.

## Embedding Aurora Layers in auroraperformancestudio.com

The studio ships an embed-only route: `/embed`. It renders the full LayerStudio
with every brand token, gradient, engine and export intact — no landing page chrome.

### 1. Plain HTML (any stack: Webflow, WordPress, Next, Replit, Framer)

```html
<iframe
  id="aurora-layers"
  src="https://<your-published-url>/embed"
  style="width:100%;height:1400px;border:0;background:#0b0614;border-radius:24px"
  allow="clipboard-write; camera"
  loading="lazy"
  title="Aurora Layers Studio"
></iframe>
<script>
  window.addEventListener("message", (e) => {
    if (e.data?.source === "aurora-layers" && e.data.type === "height") {
      document.getElementById("aurora-layers").style.height = e.data.height + "px";
    }
  });
</script>
```

### 2. React component

```tsx
export function AuroraLayersEmbed({ src = "https://<your-published-url>/embed" }) {
  const ref = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data?.source === "aurora-layers" && e.data.type === "height" && ref.current) {
        ref.current.style.height = `${e.data.height}px`;
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);
  return (
    <iframe
      ref={ref}
      src={src}
      title="Aurora Layers Studio"
      className="w-full rounded-3xl border-0 bg-[#0b0614]"
      style={{ height: 1400 }}
      allow="clipboard-write; camera"
    />
  );
}
```

### Notes
- Appearance and settings are preserved because the studio runs on its own deployment;
  the host site's CSS never touches it.
- Projects are saved per-origin (cloud + localStorage), so the embed keeps its own history.
- Use a subdomain such as `layers.auroraperformancestudio.com` (custom domain in Publish
  settings) if you want the embed to share the main site's domain.
