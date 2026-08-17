import { createFileRoute } from "@tanstack/react-router";
import heroCone from "@/assets/hero-cone.jpg";
import layerArmor from "@/assets/layer-armor.jpg";
import layerJoker from "@/assets/layer-joker.jpg";
import layerShiba from "@/assets/layer-shiba.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Layers — Generate Once. Edit Forever." },
      {
        name: "description",
        content:
          "Turn any flat image into 20+ editable layers. Swap an outfit, a face, a whole subject — the rest of the frame never re-renders.",
      },
      { property: "og:title", content: "Layers — Generate Once. Edit Forever." },
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
  {
    n: "01",
    strong: "Drop any flat image in",
    rest: "— even one you didn't make.",
  },
  {
    n: "02",
    strong: "Open Layer Decomposition.",
    rest: "Pick 2K, Fast.",
  },
  {
    n: "03",
    strong: "Separate.",
    rest: "Background + up to 20 layers back.",
  },
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
    <main className="dotfield min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroCone}
            alt="Two people facing each other holding soft-serve cones against a teal tiled wall"
            width={1200}
            height={1504}
            className="h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/20 to-background" />
        </div>

        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-between px-5 py-8">
          <div className="flex items-center justify-between">
            <span className="label-outline">Layers</span>
            <span className="font-[family-name:var(--font-mono-ui)] text-xs tracking-[0.25em] text-muted-foreground">
              01 / 05
            </span>
          </div>

          <div className="py-16">
            <h1 className="headline text-shadow-hard text-[clamp(2.9rem,11vw,7.5rem)] text-primary">
              Generate once
              <span className="block text-foreground">Edit forever</span>
            </h1>
            <p className="mt-6 max-w-xl font-[family-name:var(--font-mono-ui)] text-xs tracking-[0.28em] text-primary uppercase">
              Share it before it goes
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#decompose"
                className="rounded-full bg-primary px-7 py-3 text-sm font-bold tracking-wide text-primary-foreground uppercase transition-transform hover:scale-[1.03]"
              >
                Upload media
              </a>
              <a
                href="#edit"
                className="rounded-full border border-border px-7 py-3 text-sm font-bold tracking-wide uppercase transition-colors hover:border-primary hover:text-primary"
              >
                See it work
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {[heroCone, layerShiba, layerArmor, layerJoker, heroCone].map((src, i) => (
              <figure
                key={i}
                className="glow-frame relative aspect-3/4 bg-card"
                style={{ opacity: i === 2 ? 1 : 0.75 }}
              >
                <img
                  src={src}
                  alt={`Layer variant ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <figcaption className="absolute bottom-1 left-2 font-[family-name:var(--font-mono-ui)] text-[0.6rem] text-primary">
                  0{i + 1}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* DECOMPOSE */}
      <section id="decompose" className="mx-auto max-w-6xl px-5 py-24">
        <p className="font-[family-name:var(--font-mono-ui)] text-xs tracking-[0.3em] text-muted-foreground uppercase">
          Step one — Decompose
        </p>
        <h2 className="headline mt-4 text-[clamp(2.3rem,8vw,5.5rem)] text-primary">
          One upload.
          <span className="block text-foreground">20+ elements.</span>
        </h2>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="glow-frame relative bg-card p-3">
            <span className="label-chip absolute -top-4 left-6">The edit panel</span>
            <img
              src={heroCone}
              alt="Source photo loaded on the editing canvas"
              loading="lazy"
              className="aspect-4/5 w-full rounded-xl object-cover"
            />
            <div className="mt-3 flex items-center gap-3 rounded-full bg-secondary px-4 py-2 font-[family-name:var(--font-mono-ui)] text-[0.65rem] text-muted-foreground">
              <span>select</span>
              <span>move</span>
              <span>crop</span>
              <span className="ml-auto text-primary">100%</span>
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
                      <span className="font-[family-name:var(--font-mono-ui)] text-[0.6rem] text-primary uppercase">
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
                <div className="flex h-full w-1/2 items-center rounded-full bg-muted px-4 text-sm font-bold">
                  8
                </div>
              </div>
            </div>
          </div>
        </div>

        <ol className="mt-12 space-y-4">
          {steps.map((s) => (
            <li key={s.n} className="flex gap-4 text-lg sm:text-xl">
              <span className="font-[family-name:var(--font-mono-ui)] text-sm text-primary">
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
          <p className="font-[family-name:var(--font-mono-ui)] text-xs tracking-[0.3em] text-muted-foreground uppercase">
            The layer edit
          </p>
          <h2 className="headline mt-4 text-[clamp(2.3rem,8vw,5.5rem)] text-primary">
            Armor him.
            <span className="block text-foreground">Nothing else moves.</span>
          </h2>

          <div className="mt-12 grid items-center gap-6 md:grid-cols-2">
            <div className="glow-frame relative bg-card">
              <span className="label-chip absolute -top-4 left-5 z-10">Select him + type</span>
              <img
                src={heroCone}
                alt="Original frame with the subject selected"
                loading="lazy"
                className="aspect-4/5 w-full object-cover"
              />
              <div className="absolute right-4 bottom-4 left-4 flex items-center gap-3 rounded-full bg-background/85 px-4 py-3 text-sm backdrop-blur">
                <span className="text-primary">+</span>
                <span className="truncate text-muted-foreground">
                  change outfit into medieval warrior
                </span>
                <span className="ml-auto grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">
                  ✦
                </span>
              </div>
            </div>

            <div className="glow-frame relative bg-card">
              <span className="label-chip absolute -top-4 right-5 z-10">Full armor</span>
              <img
                src={layerArmor}
                alt="Same frame with the subject wearing full medieval armor"
                loading="lazy"
                width={912}
                height={1104}
                className="aspect-4/5 w-full object-cover"
              />
            </div>
          </div>

          <ul className="mt-10 space-y-3 text-lg">
            <li>
              <span className="mr-3 text-primary">→</span>One sentence:{" "}
              <strong>"outfit into medieval warrior."</strong>
            </li>
            <li>
              <span className="mr-3 text-primary">→</span>His pose holds. Her side of the frame{" "}
              <strong>never re-renders.</strong>
            </li>
          </ul>
        </div>
      </section>

      {/* FACE SWAP */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <p className="font-[family-name:var(--font-mono-ui)] text-xs tracking-[0.3em] text-muted-foreground uppercase">
          One more — her layer this time
        </p>
        <h2 className="headline mt-4 text-[clamp(2.3rem,8vw,5.5rem)] text-primary">
          New face.
          <span className="block text-foreground">Same frame.</span>
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="glow-frame relative bg-card">
            <span className="label-chip absolute -top-4 left-5 z-10">"Turn girl into a joker"</span>
            <img
              src={heroCone}
              alt="Original frame before the face layer is edited"
              loading="lazy"
              className="aspect-4/5 w-full object-cover"
            />
          </div>
          <div className="glow-frame relative bg-card">
            <span className="label-chip absolute -top-4 right-5 z-10">Swapped</span>
            <img
              src={layerJoker}
              alt="Same frame with joker face paint applied to one layer"
              loading="lazy"
              width={912}
              height={1104}
              className="aspect-4/5 w-full object-cover"
            />
          </div>
        </div>

        <p className="mt-10 max-w-3xl text-lg text-muted-foreground">
          Face paint lands, <strong className="text-foreground">sun and shadows stay honest.</strong>{" "}
          The cone, the wall, the armor — untouched. Stack as many swaps as you want on one frame.
        </p>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-5 py-24 text-center">
          <h2 className="headline text-[clamp(2.5rem,9vw,6rem)] text-foreground">
            Turn flat images
            <span className="block text-primary">into editable layers.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            Separate, edit, and rebuild any image. Every element, now yours to edit.
          </p>
          <a
            href="#decompose"
            className="mt-8 inline-block rounded-full bg-primary px-10 py-4 text-sm font-bold tracking-widest text-primary-foreground uppercase transition-transform hover:scale-[1.03]"
          >
            + Upload media
          </a>
          <p className="mt-16 font-[family-name:var(--font-mono-ui)] text-[0.65rem] tracking-[0.3em] text-muted-foreground uppercase">
            Layers — generate once, edit forever
          </p>
        </div>
      </section>
    </main>
  );
}
