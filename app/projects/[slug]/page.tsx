import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "../data";
import { stories } from "../stories";
import { Arrow } from "../../ui";
import { ProjectImage } from "../../components/project-image";
import { ProjectGallery } from "../gallery";
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
    openGraph: { images: p ? [{ url: p.image, alt: p.alt }] : [] },
  };
}
export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  const p = projects[index];
  if (!p) notFound();
  const story = stories[slug];
  const prev = projects[(index + projects.length - 1) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const compact =
    slug === "elm-park-gardens" ||
    slug === "guildford-quaker-meeting-house" ||
    p.visual;
  return (
    <main
      id="main-content"
      className={`project-story ${compact ? "story-compact" : ""}`}
    >
      <header className="story-header wrap">
        <Link className="text-link" href="/projects">
          ← The project collection
        </Link>
        <div className="story-title">
          <p className="eyebrow">
            Project / {String(index + 1).padStart(2, "0")}
          </p>
          <h1>{p.title}</h1>
        </div>
        <dl className="story-facts">
          <div>
            <dt>Location</dt>
            <dd>{p.place}</dd>
          </div>
          <div>
            <dt>Discipline</dt>
            <dd>{p.category}</dd>
          </div>
          {p.year && (
            <div>
              <dt>Published project year</dt>
              <dd>{p.year}</dd>
            </div>
          )}
        </dl>
      </header>
      <div className="story-opening wrap">
        <figure className="story-hero">
          <ProjectImage src={p.image} alt={p.alt} preload />
          {p.visual && (
            <figcaption className="visual-notice">
              Design visual · not completed-build photography
            </figcaption>
          )}
        </figure>
        <div className="story-intro">
          <p className="eyebrow">The brief</p>
          <h2>{p.short}</h2>
          <p>{p.description}</p>
        </div>
      </div>
      <section className="story-detail wrap">
        <div>
          <p className="eyebrow">The approach</p>
          <h2>{story.heading}</h2>
        </div>
        <div>
          <p>{story.detail}</p>
          {story.note && !story.quote && (
            <p className="story-note">{story.note}</p>
          )}
          <ul className="scope-list">
            {p.scope.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <Link href={p.expertise ?? "/expertise"} className="text-link">
            Explore this expertise <Arrow />
          </Link>
        </div>
      </section>
      {story.quote && (
        <figure className="story-quote wrap">
          <blockquote>“{story.quote}”</blockquote>
          <figcaption>{story.note}</figcaption>
        </figure>
      )}
      <ProjectGallery
        title={p.title}
        slug={slug}
        visual={!!p.visual}
        items={story.gallery}
      />
      {story.media && (
        <section className="story-media wrap">
          <div>
            <p className="eyebrow">From the project</p>
            <h2>Watch & explore.</h2>
            <p>
              Original media linked from Buildtonic’s project archive. These
              open in a new tab on the named platform, which may require
              sign-in.
            </p>
          </div>
          <div>
            {story.media.map((m) => (
              <a key={m.href} href={m.href} target="_blank" rel="noreferrer">
                {m.title}
                <Arrow />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </div>
        </section>
      )}
      <section className="story-enquiry wrap">
        <p className="eyebrow">Inspired by {p.title}?</p>
        <h2>
          Your place.
          <br />
          <em>Your possibilities.</em>
        </h2>
        <Link
          href={`/start-project?project=${p.slug}`}
          className="button button-dark"
        >
          Discuss a similar project <Arrow />
        </Link>
      </section>
      <nav className="story-navigation wrap" aria-label="More projects">
        <Link href={`/projects/${prev.slug}`}>
          <small>← Previous project</small>
          <span>{prev.title}</span>
        </Link>
        <Link href={`/projects/${next.slug}`}>
          <small>Next project →</small>
          <span>{next.title}</span>
        </Link>
      </nav>
    </main>
  );
}
