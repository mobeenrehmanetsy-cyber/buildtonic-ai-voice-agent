"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import media from "./media.json";
export function ProjectGallery({
  title,
  slug,
  visual,
  items,
}: {
  title: string;
  slug: string;
  visual: boolean;
  items: { file: string; caption: string }[];
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const [active, setActive] = useState(0);
  const assets = items.map((i) => {
    const src = `/images/projects/${slug}-${i.file}`;
    return { ...i, src, ...media[src as keyof typeof media] };
  });
  const current = assets[active];
  function close() {
    dialog.current?.close();
    trigger.current?.focus();
  }
  return (
    <section
      className="story-gallery wrap"
      aria-label={`${title} ${visual ? "design visuals" : "gallery"}`}
    >
      <div className="gallery-heading">
        <p className="eyebrow">
          {visual ? "Design archive" : "In photographs"}
        </p>
        <span>Select an image to explore</span>
      </div>
      <div className="editorial-gallery">
        {assets.map((a, i) => (
          <figure
            key={a.src}
            className={a.width / a.height < 1 ? "portrait" : ""}
            style={{ maxWidth: Math.min(a.width, 1500) }}
          >
            <button
              onClick={(e) => {
                trigger.current = e.currentTarget;
                setActive(i);
                dialog.current?.showModal();
              }}
              aria-label={`Enlarge: ${a.caption}`}
            >
              <Image
                src={a.src}
                alt={`${title}: ${a.caption}`}
                width={a.width}
                height={a.height}
                sizes="(max-width: 700px) 90vw, 50vw"
              />
              <span aria-hidden="true">↗</span>
            </button>
            <figcaption>
              <span>{String(i + 1).padStart(2, "0")} /</span> {a.caption}
            </figcaption>
          </figure>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="gallery-dialog"
        aria-label={`${title} image viewer`}
        onCancel={close}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") setActive((active + 1) % assets.length);
          if (e.key === "ArrowLeft")
            setActive((active + assets.length - 1) % assets.length);
          if (e.key === "Tab") {
            const buttons = dialog.current!.querySelectorAll("button");
            const first = buttons[0],
              last = buttons[buttons.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }}
      >
        <button className="gallery-close" onClick={close} autoFocus>
          Close ×
        </button>
        <Image
          src={current.src}
          alt={`${title}: ${current.caption}`}
          width={current.width}
          height={current.height}
          sizes="90vw"
          style={{
            width: `min(100%, ${current.width}px, ${(72 * current.width) / current.height}svh)`,
            aspectRatio: `${current.width} / ${current.height}`,
          }}
        />
        <div className="gallery-controls">
          <button
            onClick={() =>
              setActive((active + assets.length - 1) % assets.length)
            }
            aria-label="Previous image"
          >
            ←
          </button>
          <p aria-live="polite">
            {active + 1} / {assets.length} · {current.caption}
          </p>
          <button
            onClick={() => setActive((active + 1) % assets.length)}
            aria-label="Next image"
          >
            →
          </button>
        </div>
      </dialog>
    </section>
  );
}
