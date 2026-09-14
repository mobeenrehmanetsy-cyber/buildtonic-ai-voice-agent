import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { expertise } from "../../content/expertise";
import {
  EnquiryBand,
  PageIntro,
  RelatedWork,
} from "../../components/editorial";
import { Arrow } from "../../ui";
export function generateStaticParams() {
  return expertise.map(({ slug }) => ({ slug }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: PageProps<"/expertise/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = expertise.find((e) => e.slug === slug);
  return { title: item?.eyebrow, description: item?.intro };
}
export default async function ExpertisePage({
  params,
}: PageProps<"/expertise/[slug]">) {
  const { slug } = await params;
  const item = expertise.find((e) => e.slug === slug);
  if (!item) notFound();
  return (
    <main id="main-content">
      <div className="wrap breadcrumb">
        <Link href="/expertise">Expertise</Link>
        <span aria-hidden="true">/</span>
        <span>{item.eyebrow}</span>
      </div>
      <PageIntro
        eyebrow={item.eyebrow}
        title={item.title}
        description={item.intro}
      />
      <figure className="wrap editorial-image">
        <div>
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            preload
            sizes="(min-width: 1800px) 1500px, 90vw"
          />
        </div>
        <figcaption>{item.imageCaption}</figcaption>
      </figure>
      <section className="wrap detail-layout section-space">
        <aside>
          <p className="eyebrow">Explore the scope</p>
          <nav aria-label="On this page">
            {item.sections.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                {s.title}
              </a>
            ))}
          </nav>
          <Link className="text-link" href="/areas">
            Where we work <Arrow />
          </Link>
        </aside>
        <div>
          {item.sections.map((s) => (
            <section id={s.id} className="content-section" key={s.id}>
              <h2>{s.title}</h2>
              <p>{s.text}</p>
            </section>
          ))}
          <div className="preparation">
            <p className="eyebrow">For the first conversation</p>
            <h3>Useful information to bring</h3>
            <ul>
              {item.preparation.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <Link href="/start-project" className="text-link">
              Discuss your project <Arrow />
            </Link>
          </div>
        </div>
      </section>
      <RelatedWork slugs={item.projectSlugs.slice(0, 2)} />
      <EnquiryBand />
    </main>
  );
}
