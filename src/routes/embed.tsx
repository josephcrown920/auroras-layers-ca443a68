import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { LayerStudio } from "@/components/LayerStudio";

export const Route = createFileRoute("/embed")({
  component: EmbedPage,
  head: () => ({
    meta: [
      { title: "Aurora Layers Studio — Embedded Editor" },
      {
        name: "description",
        content:
          "Embeddable Aurora Layers studio: upload a frame, name a layer, re-render only that element while the rest of the frame stays locked.",
      },
      { property: "og:title", content: "Aurora Layers Studio — Embedded Editor" },
      {
        property: "og:description",
        content:
          "Drop the Aurora Layers editor into any site. Same brand, same engines, same exports.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function EmbedPage() {
  // Report height to the host page so the iframe can auto-size.
  useEffect(() => {
    const post = () => {
      window.parent?.postMessage(
        { source: "aurora-layers", type: "height", height: document.body.scrollHeight },
        "*",
      );
    };
    post();
    const ro = new ResizeObserver(post);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <LayerStudio />
      </div>
    </main>
  );
}
