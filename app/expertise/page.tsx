import Link from "next/link";
import type { Metadata } from "next";
import { PageIntro, EnquiryBand } from "../components/editorial";
import { Arrow } from "../ui";
export const metadata: Metadata = {
  title: "Our expertise",
  description:
    "New homes, extensions, renovation, heritage repairs, Listed Building Consent coordination and surveys.",
};
const items = [
  [
    "Heritage & conservation",
    "Traditional lime, breathable floors, timber, masonry and structural repairs for period and listed buildings.",
    "/heritage",
  ],
  [
    "New homes",
    "Individual residential builds, replacement dwellings and annexes, from groundworks through to handover.",
    "/expertise/new-homes",
  ],
  [
    "Extensions & renovations",
    "Additional space, internal alterations, full refurbishment and the finishing details that bring a home together.",
    "/expertise/extensions-renovations",
  ],
  [
    "Listed Building Consent coordination",
    "Application information, method statements and coordination with your professional team and conservation officers.",
    "/expertise/consent",
  ],
  [
    "Surveys & building concerns",
    "Condition and pre-purchase assessments, defect and damp investigation, and drone inspections.",
    "/expertise/surveys",
  ],
];
export default function ExpertisePage() {
  return (
    <main id="main-content">
      <PageIntro
        eyebrow="Our expertise"
        title="The right approach to your building."
        description="From a first assessment to a finished home. Find the experience and practical support that fit your project, its materials and its ambitions."
      />
      <section className="wrap expertise-index" aria-label="Explore expertise">
        {items.map(([title, text, href], i) => (
          <Link
            className="expertise-row"
            href={href}
            key={href}
            id={i === 3 ? "consent-surveys" : undefined}
          >
            <span className="eyebrow">0{i + 1}</span>
            <div>
              <h2>{title}</h2>
              <p>{text}</p>
            </div>
            <Arrow />
          </Link>
        ))}
      </section>
      <div className="wrap editorial-note">
        <p>
          Working with an architect or consultant? We welcome a clear brief,
          drawings and an early conversation about delivery.
        </p>
        <Link href="/start-project" className="text-link">
          Share your brief <Arrow />
        </Link>
      </div>
      <EnquiryBand />
    </main>
  );
}
