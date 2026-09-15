import Image from "next/image";
import media from "../projects/media.json";

export function ProjectImage({
  src,
  alt,
  preload = false,
  className = "",
}: {
  src: string;
  alt: string;
  preload?: boolean;
  className?: string;
}) {
  const asset = media[src as keyof typeof media];
  return (
    <Image
      src={src}
      alt={alt}
      width={asset.width}
      height={asset.height}
      preload={preload}
      sizes={`(max-width: 700px) 90vw, (max-width: 1100px) 85vw, ${Math.min(asset.width, 1500)}px`}
      className={className}
    />
  );
}
