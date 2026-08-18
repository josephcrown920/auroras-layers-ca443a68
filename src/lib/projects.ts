export type LayerProject = {
  id: string;
  name: string;
  prompt: string;
  model: string;
  createdAt: number;
  sourceUrl?: string;
  layers: { id: string; prompt: string; dataUrl: string }[];
};

const KEY = "aurora.projects.v1";

function safeParse(raw: string | null): LayerProject[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? (v as LayerProject[]) : [];
  } catch {
    return [];
  }
}

export function loadProjects(): LayerProject[] {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(KEY)).sort((a, b) => b.createdAt - a.createdAt);
}

export function saveProject(project: LayerProject): LayerProject[] {
  const all = loadProjects().filter((p) => p.id !== project.id);
  const next = [project, ...all].slice(0, 12); // keep storage sane
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // quota: drop the oldest and retry once
    const trimmed = next.slice(0, 4);
    window.localStorage.setItem(KEY, JSON.stringify(trimmed));
    return trimmed;
  }
  return next;
}

export function deleteProject(id: string): LayerProject[] {
  const next = loadProjects().filter((p) => p.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

function dataUrlToBase64(dataUrl: string) {
  return dataUrl.split(",")[1] ?? "";
}

export async function exportProjectZip(project: LayerProject) {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  const slug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) || "project";

  if (project.sourceUrl) {
    zip.file(`${slug}/00-source.png`, dataUrlToBase64(project.sourceUrl), { base64: true });
  }
  project.layers.forEach((layer, i) => {
    zip.file(`${slug}/${String(i + 1).padStart(2, "0")}-layer.png`, dataUrlToBase64(layer.dataUrl), {
      base64: true,
    });
  });
  const last = project.layers[project.layers.length - 1];
  if (last) {
    zip.file(`${slug}/final-composite.png`, dataUrlToBase64(last.dataUrl), { base64: true });
  }
  zip.file(
    `${slug}/recipe.txt`,
    [
      `Aurora Performance Studio — ${project.name}`,
      `Model: ${project.model}`,
      `Created: ${new Date(project.createdAt).toISOString()}`,
      "",
      ...project.layers.map((l, i) => `${i + 1}. ${l.prompt}`),
    ].join("\n"),
  );

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  downloadDataUrl(url, `${slug}.zip`);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
