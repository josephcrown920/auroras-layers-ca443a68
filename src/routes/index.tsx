import { createFileRoute } from "@tanstack/react-router";
import { LayerStudio } from "@/components/LayerStudio";
import { DirectorAgent } from "@/components/DirectorAgent";
import heroStreet from "@/assets/hero-street.jpg";
import layerChains from "@/assets/layer-chains.jpg";
import layerBraids from "@/assets/layer-braids.jpg";
import layerBandana from "@/assets/layer-bandana.jpg";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aurora Layers — Generate Once. Edit Forever." },
      {
        name: "description",
        content:
          "Aurora Performance Studio turns any flat image into 20+ editable layers. Swap an outfit, a face, a whole subject — the rest of the frame never re-renders.",
      },
      { property: "og:title", content: "Aurora Layers — Generate Once. Edit Forever." },
      {
        property: "og:description",
        content:
          "One upload, 20+ elements. Select a layer, type a sentence, and everything else stays exactly where it was.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const steps = [
  { n: "01", strong: "Drop any flat image in", rest: "— even one you didn't make." },
  { n: "02", strong: "Open Layer Decomposition.", rest: "Pick 2K, Fast." },
  { n: "03", strong: "Separate.", rest: "Background + up to 20 layers back." },
];

const panelItems = [
  ["Layer Decomposition", "New"],
  ["Edit text", "New"],
  ["Upscale", ""],
  ["Remove background", ""],
  ["Enhancer", ""],
  ["Relight", ""],
  ["Angles", ""],
];

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroStreet}
            alt="Two artists in puffer vests and gold chains against a lit street wall"
            className="h-full w-full object-cover opacity-55"
          />
          <div className="gradient-surface absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
        </div>

        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-between px-5 py-8">
          <header className="flex items-center justify-between">
            <span className="headline text-2xl">Aurora</span>
            <a
              href="#studio"
              className="btn-aurora rounded-full px-5 py-2.5 text-sm font-bold tracking-wide"
            >
              + Open Studio
            </a>
          </header>

          <div className="py-16">
            <p className="font-[family-name:var(--font-mono-ui)] text-[0.68rem] tracking-[0.3em] text-accent uppercase">
              ● By artists, for artists
            </p>
            <h1 className="headline text-shadow-hard mt-5 text-[clamp(2.9rem,10vw,7rem)]">
              Generate once.
              <span className="gradient-text block">Edit forever.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Aurora Performance Studio reads your frame, splits it into layers, and re-renders
              only the one you name. Style, motion, likeness — intact.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#studio"
                className="btn-aurora rounded-full px-8 py-3.5 text-sm font-bold tracking-wide uppercase transition-transform hover:scale-[1.03]"
              >
                + Open Studio
              </a>
              <a
                href="#edit"
                className="rounded-full border border-border px-8 py-3.5 text-sm font-bold tracking-wide uppercase transition-colors hover:border-primary hover:text-primary"
              >
                See it work
              </a>
            </div>
            <p className="mt-4 font-[family-name:var(--font-mono-ui)] text-[0.62rem] tracking-[0.3em] text-muted-foreground uppercase">
              Free to start · no card needed
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {[heroStreet, layerBraids, layerChains, layerBandana, heroStreet].map((src, i) => (
              <figure
                key={i}
                className="glow-frame relative aspect-3/4 bg-card"
                style={{ opacity: i === 2 ? 1 : 0.7 }}
              >
                <img
                  src={src}
                  alt={`Layer variant ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <figcaption className="absolute bottom-1 left-2 font-[family-name:var(--font-mono-ui)] text-[0.6rem] text-accent">
                  0{i + 1}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* STUDIO */}
      <section id="studio" className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <p className="font-[family-name:var(--font-mono-ui)] text-xs tracking-[0.3em] text-accent uppercase">
            Live — the studio
          </p>
          <h2 className="headline mt-4 text-[clamp(2.3rem,7vw,4.5rem)]">
            Direct your <span className="gradient-text">shoot.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Drop a reference → write direction → generate. That's it.
          </p>
          <div className="mt-10">
            <LayerStudio />
          </div>
        </div>
      </section>

      {/* DECOMPOSE */}
      <section id="decompose" className="dotfield mx-auto max-w-6xl px-5 py-24">
        <p className="font-[family-name:var(--font-mono-ui)] text-xs tracking-[0.3em] text-accent uppercase">
          Step one — Decompose
        </p>
        <h2 className="headline mt-4 text-[clamp(2.3rem,7vw,4.5rem)]">
          One upload.
          <span className="gradient-text block">20+ elements.</span>
        </h2>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="glow-frame relative bg-card p-3">
            <span className="label-chip absolute -top-4 left-6">The edit panel</span>
            <img
              src={heroStreet}
              alt="Source photo loaded on the editing canvas"
              loading="lazy"
              className="aspect-4/5 w-full rounded-xl object-cover"
            />
            <div className="mt-3 flex items-center gap-3 rounded-full bg-secondary px-4 py-2 font-[family-name:var(--font-mono-ui)] text-[0.65rem] text-muted-foreground">
              <span>select</span>
              <span>move</span>
              <span>crop</span>
              <span className="ml-auto text-accent">100%</span>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="font-[family-name:var(--font-mono-ui)] text-[0.65rem] tracking-[0.25em] text-muted-foreground uppercase">
                Edit image
              </p>
              <ul className="mt-4 space-y-1">
                {panelItems.map(([label, tag]) => (
                  <li
                    key={label}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-secondary"
                  >
                    <span>{label}</span>
                    {tag ? (
                      <span className="font-[family-name:var(--font-mono-ui)] text-[0.6rem] text-accent uppercase">
                        {tag}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">›</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glow-frame relative bg-card p-5">
              <span className="label-chip absolute -top-4 right-5">2K · Fast</span>
              <p className="font-[family-name:var(--font-mono-ui)] text-[0.65rem] tracking-[0.25em] text-muted-foreground uppercase">
                Resolution
              </p>
              <div className="mt-2 grid grid-cols-3 gap-1 rounded-full bg-secondary p-1 text-center text-sm">
                <span className="rounded-full py-2 text-muted-foreground">1K</span>
                <span className="rounded-full py-2 text-muted-foreground">1.5K</span>
                <span className="rounded-full bg-muted py-2 font-bold">2K</span>
              </div>
              <p className="mt-5 font-[family-name:var(--font-mono-ui)] text-[0.65rem] tracking-[0.25em] text-muted-foreground uppercase">
                Mode
              </p>
              <div className="mt-2 grid grid-cols-2 gap-1 rounded-full bg-secondary p-1 text-center text-sm">
                <span className="rounded-full py-2 text-muted-foreground">Standard</span>
                <span className="rounded-full bg-muted py-2 font-bold">Fast</span>
              </div>
              <p className="mt-5 font-[family-name:var(--font-mono-ui)] text-[0.65rem] tracking-[0.25em] text-muted-foreground uppercase">
                Layers
              </p>
              <div className="mt-2 h-9 overflow-hidden rounded-full bg-secondary">
                <div className="btn-aurora flex h-full w-1/2 items-center rounded-full px-4 text-sm font-bold">
                  8
                </div>
              </div>
            </div>
          </div>
        </div>

        <ol className="mt-12 space-y-4">
          {steps.map((s) => (
            <li key={s.n} className="flex gap-4 text-lg sm:text-xl">
              <span className="font-[family-name:var(--font-mono-ui)] text-sm text-accent">
                {s.n}
              </span>
              <p>
                <strong className="font-extrabold">{s.strong}</strong>{" "}
                <span className="text-muted-foreground">{s.rest}</span>
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* LAYER EDIT */}
      <section id="edit" className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <p className="font-[family-name:var(--font-mono-ui)] text-xs tracking-[0.3em] text-accent uppercase">
            The layer edit
          </p>
          <h2 className="headline mt-4 text-[clamp(2.3rem,7vw,4.5rem)]">
            Ice him out.
            <span className="gradient-text block">Nothing else moves.</span>
          </h2>

          <div className="mt-12 grid items-center gap-6 md:grid-cols-2">
            <div className="glow-frame relative bg-card">
              <span className="label-chip absolute -top-4 left-5 z-10">Select him + type</span>
              <img
                src={heroStreet}
                alt="Original frame with the subject selected"
                loading="lazy"
                className="aspect-4/5 w-full object-cover"
              />
              <div className="absolute right-4 bottom-4 left-4 flex items-center gap-3 rounded-full bg-background/85 px-4 py-3 text-sm backdrop-blur">
                <span className="text-accent">+</span>
                <span className="truncate text-muted-foreground">
                  iced-out cuban links and diamond grillz
                </span>
                <span className="btn-aurora ml-auto grid size-7 place-items-center rounded-full">
                  ✦
                </span>
              </div>
            </div>

            <div className="glow-frame relative bg-card">
              <span className="label-chip absolute -top-4 right-5 z-10">Chained up</span>
              <img
                src={layerChains}
                alt="Same frame with the subject wearing iced-out cuban links"
                loading="lazy"
                className="aspect-4/5 w-full object-cover"
              />
            </div>
          </div>

          <ul className="mt-10 space-y-3 text-lg">
            <li>
              <span className="mr-3 text-accent">→</span>One sentence:{" "}
              <strong>"iced-out cuban links and diamond grillz."</strong>
            </li>
            <li>
              <span className="mr-3 text-accent">→</span>His pose holds. Her side of the frame{" "}
              <strong>never re-renders.</strong>
            </li>
          </ul>
        </div>
      </section>

      {/* FACE SWAP */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <p className="font-[family-name:var(--font-mono-ui)] text-xs tracking-[0.3em] text-accent uppercase">
          One more — her layer this time
        </p>
        <h2 className="headline mt-4 text-[clamp(2.3rem,7vw,4.5rem)]">
          New look.
          <span className="gradient-text block">Same frame.</span>
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="glow-frame relative bg-card">
            <span className="label-chip absolute -top-4 left-5 z-10">
              "Neon braids + varsity jacket"
            </span>
            <img
              src={heroStreet}
              alt="Original frame before the layer is edited"
              loading="lazy"
              className="aspect-4/5 w-full object-cover"
            />
          </div>
          <div className="glow-frame relative bg-card">
            <span className="label-chip absolute -top-4 right-5 z-10">Swapped</span>
            <img
              src={layerBraids}
              alt="Same frame with neon-green braids and an oversized varsity jacket"
              loading="lazy"
              className="aspect-4/5 w-full object-cover"
            />
          </div>
        </div>

        <p className="mt-10 max-w-3xl text-lg text-muted-foreground">
          The fit lands, <strong className="text-foreground">light and shadow stay honest.</strong>{" "}
          The wall, the chains, the pose — untouched. Stack as many swaps as you want on one frame.
        </p>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="gradient-surface mx-auto max-w-4xl px-5 py-24 text-center">
          <h2 className="headline text-[clamp(2.5rem,8vw,5rem)]">
            Turn flat images
            <span className="gradient-text block">into editable layers.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            Separate, edit, and rebuild any image. Every element, now yours to edit.
          </p>
          <a
            href="#studio"
            className="btn-aurora mt-8 inline-block rounded-full px-10 py-4 text-sm font-bold tracking-widest uppercase transition-transform hover:scale-[1.03]"
          >
            + Open Studio
          </a>
          <p className="mt-16 font-[family-name:var(--font-mono-ui)] text-[0.65rem] tracking-[0.3em] text-muted-foreground uppercase">
            Aurora Performance Studio — generate once, edit forever
          </p>
        </div>
      </section>
    </main>
  );
}
