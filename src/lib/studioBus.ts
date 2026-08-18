const EVENT = "aurora:use-prompt";

export function sendPromptToStudio(prompt: string) {
  window.dispatchEvent(new CustomEvent<string>(EVENT, { detail: prompt }));
  document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
}

export function onStudioPrompt(handler: (prompt: string) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<string>).detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
