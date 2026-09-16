"use client";
export function OpenAssistant({ className = "text-link", children = "Talk to Buildtonic AI" }: { className?: string; children?: React.ReactNode }) {
  return <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("buildtonic:open-assistant"))}>{children}<span aria-hidden="true">↗</span></button>;
}
