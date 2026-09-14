import Image from "next/image";
import Link from "next/link";
import { Arrow } from "../ui";
import { projects, type Project } from "../projects/data";

export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="page-intro wrap">
      <p className="eyebrow">
        <span />
        {eyebrow}
      </p>
      <h1>{title}</h1>
      <p className="page-lead">{description}</p>
    </header>
  );
}
export function ProjectEntry({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`project project-${index + 1}`}
    >
      <div className="project-image">
        <Image
          src={project.image}
          alt={project.alt}
          fill
          sizes="(max-width: 700px) 90vw, (min-width: 1800px) 750px, 50vw"
        />
        {project.visual && <span className="image-kind">Design visual</span>}
        <span className="project-open" aria-hidden="true">
          <Arrow />
        </span>
      </div>
      <div className="project-meta">
        <span>{project.category}</span>
        <span>{project.location}</span>
      </div>
      <h3>{project.title}</h3>
      <p>{project.short}</p>
      <span className="text-link">
        View project <Arrow />
      </span>
    </Link>
  );
}
export function RelatedWork({ slugs }: { slugs: string[] }) {
  const selected = slugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is Project => !!p);
  return (
    <section className="related-work wrap section-space">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            <span />
            Related experience
          </p>
          <h2>
            See it <em>in the work.</em>
          </h2>
        </div>
        <Link href="/projects" className="text-link">
          View all work <Arrow />
        </Link>
      </div>
      <div
        className={`portfolio-grid ${selected.length === 1 ? "single-project" : ""}`}
      >
        {selected.map((project) => (
          <ProjectEntry key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
export function EnquiryBand({
  title = "Let’s talk about your building.",
}: {
  title?: string;
}) {
  return (
    <section className="enquiry-band">
      <div className="wrap">
        <div>
          <p className="eyebrow">Hampshire · Surrey · London</p>
          <h2>{title}</h2>
        </div>
        <Link href="/start-project" className="button button-dark">
          Start a project <Arrow />
        </Link>
      </div>
    </section>
  );
}
export function Standards() {
  return (
    <div className="standards-grid">
      <a
        href="https://builders.org.uk/members/buildtonic-ltd/"
        target="_blank"
        rel="noreferrer"
      >
        <strong>NFB</strong>
        <span>Heritage Approved Contractor</span>
        <small>
          View member profile ↗
          <span className="sr-only"> (opens in a new tab)</span>
        </small>
      </a>
      <a
        href="https://www.fmb.org.uk/builder/buildtonic-ltd.html"
        target="_blank"
        rel="noreferrer"
      >
        <strong>FMB</strong>
        <span>Federation of Master Builders · Member</span>
        <small>
          View member profile ↗
          <span className="sr-only"> (opens in a new tab)</span>
        </small>
      </a>
      <div>
        <strong>Constructionline</strong>
        <span>Silver accreditation</span>
      </div>
    </div>
  );
}
