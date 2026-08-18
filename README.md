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
