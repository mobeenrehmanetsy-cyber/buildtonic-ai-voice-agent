import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "../data";
import { Arrow } from "../../ui";
import { EnquiryBand } from "../../components/editorial";
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  return {
    title: p?.title,
    description: p?.description,
    openGraph: {
      title: p?.title,
      description: p?.description,
      images: p ? [{ url: p.image, alt: p.alt }] : [],
    },
  };
}
export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  const p = projects[index];
  if (!p) notFound();
  const next = projects[(index + 1) % projects.length];
  return (
    <main id="main-content" className="case-study">
      <div className="wrap case-heading">
        <Link href="/projects" className="text-link">
          ← All work
        </Link>
        <p className="eyebrow">
          {p.category} / {p.place}
          {p.year && ` / ${p.year}`}
        </p>
        <h1>{p.title}</h1>
        <p className="case-lead">{p.description}</p>
        {p.visual && (
          <p className="visual-notice">
            Images on this page are design visuals. They do not show the
            completed building.
          </p>
        )}
      </div>
      <div className="case-hero">
        <Image src={p.image} alt={p.alt} fill preload sizes="100vw" />
        {p.visual && <span className="image-kind">Design visual</span>}
      </div>
      <section className="wrap case-body section-space">
        <div>
          <p className="eyebrow">
            <span />
            The work
          </p>
          <h2>
            A considered
            <br />
            <em>approach.</em>
          </h2>
        </div>
        <div>
          <p>{p.work}</p>
          <ul>
            {p.scope.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <Link href={p.expertise ?? "/expertise"} className="text-link">
            Explore the relevant expertise <Arrow />
          </Link>
        </div>
      </section>
      <figure className="case-detail wrap">
        <div>
          <Image
            src={p.detail}
            alt={p.detailAlt}
            fill
            sizes="(min-width: 1800px) 1400px, 90vw"
          />
        </div>
        <figcaption>
          {p.title} · {p.location}
          {p.visual && " · Design visual, not completed-build photography"}
        </figcaption>
      </figure>
      <nav aria-label="More projects" className="wrap next-project">
        <div>
          <p className="eyebrow">Continue exploring</p>
          <Link href={`/projects/${next.slug}`}>
            <span>{next.title}</span>
            <Arrow />
          </Link>
        </div>
        <Link className="text-link" href="/projects">
          View all work <Arrow />
        </Link>
      </nav>
      <EnquiryBand title="A project of your own?" />
    </main>
  );
}
