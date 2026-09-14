import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, EnquiryBand } from "../components/editorial";
import { Arrow } from "../ui";
export const metadata: Metadata = {
  title: "Planning your project",
  description:
    "Useful starting points for preparing a building brief, understanding heritage materials and arranging a survey.",
};
const guides = [
  {
    id: "brief",
    title: "Start with the building and the brief",
    text: "Gather existing plans, photographs, your location and a short description of what you want to change. Note the rooms or areas involved and which decisions are already made. An early brief can be useful even before all the drawings are ready.",
    href: "/start-project",
    label: "Prepare your enquiry",
  },
  {
    id: "materials",
    title: "Understand the materials before changing them",
    text: "Traditional walls can depend on moisture moving through compatible materials and finishes. Before choosing a new plaster, render or floor, establish how the existing building works and why previous repairs may have failed.",
    href: "/heritage",
    label: "Explore traditional materials",
  },
  {
    id: "consent",
    title: "Give consent coordination room in the process",
    text: "For a listed property, collect any listing information and previous advice. Discuss proposed internal and external changes with your appointed advisers and local authority before committing to work. Requirements and decisions are specific to each project.",
    href: "/expertise/consent",
    label: "Understand our coordination role",
  },
  {
    id: "survey",
    title: "Give a survey a clear purpose",
    text: "Are you buying a property, planning maintenance or investigating a particular concern? Explain what you need the report to resolve, the access available and any observations or previous reports. This helps establish an appropriate survey scope.",
    href: "/expertise/surveys",
    label: "Explore surveys & reports",
  },
];
export default function GuidesPage() {
  return (
    <main id="main-content">
      <PageIntro
        eyebrow="Planning your project"
        title="A more informed beginning."
        description="Short, practical starting points for homeowners and professional teams. Building-specific assessment and advice remain essential."
      />
      <section className="wrap guide-list">
        {guides.map((g, i) => (
          <article key={g.id} id={g.id}>
            <span className="eyebrow">0{i + 1} / Project notes</span>
            <h2>{g.title}</h2>
            <p>{g.text}</p>
            <Link href={g.href} className="text-link">
              {g.label}
              <Arrow />
            </Link>
          </article>
        ))}
      </section>
      <EnquiryBand />
    </main>
  );
}
