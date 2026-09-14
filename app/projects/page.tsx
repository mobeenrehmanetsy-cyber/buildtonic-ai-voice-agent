import type { Metadata } from "next";
import { PageIntro, ProjectEntry, EnquiryBand } from "../components/editorial";
import { projects } from "./data";
export const metadata: Metadata = {
  title: "Our work",
  description:
    "Explore Buildtonic’s residential and heritage projects across Hampshire, Surrey and London.",
};
export default function ProjectsPage() {
  return (
    <main id="main-content">
      <PageIntro
        eyebrow="The portfolio"
        title="Different buildings. The same care."
        description="A collection of residential renovation, new-build delivery and conservation work. Each project begins with the particular character of a place."
      />
      <div className="wrap portfolio-intro">
        <span>Hampshire · Surrey · London</span>
        <span>Six project stories</span>
      </div>
      <section
        className="wrap portfolio-grid portfolio-main"
        aria-label="Buildtonic projects"
      >
        {projects.map((project, index) => (
          <ProjectEntry
            key={project.slug}
            project={project}
            index={index % 2}
          />
        ))}
      </section>
      <EnquiryBand />
    </main>
  );
}
