import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, EnquiryBand } from "../components/editorial";
import { Arrow } from "../ui";
export const metadata: Metadata = {
  title: "Health & safety",
  description:
    "Buildtonic’s approach to planned site safety, risk assessment and contractor responsibilities.",
};
export default function SafetyPage() {
  return (
    <main id="main-content">
      <PageIntro
        eyebrow="Responsible delivery"
        title="Safe working begins with good planning."
        description="Buildtonic’s published safety approach puts risk assessment, clear responsibilities and suitable working methods at the centre of site delivery."
      />
      <section className="wrap prose-page">
        <h2>Before work begins</h2>
        <p>
          Risks are assessed and working methods documented through risk
          assessments and method statements. CDM responsibilities are considered
          in the contractor role and, where appointed, the principal contractor
          role.
        </p>
        <h2>On site</h2>
        <p>
          The approach covers competent supervision and training, appropriate
          protective equipment, safe plant and material handling, welfare
          provision and controlled access. Emergency arrangements and incident
          reporting form part of site management.
        </p>
        <h2>For clients and professional teams</h2>
        <p>
          Discuss access, occupied areas and project-specific constraints early.
          The relevant arrangements need to be agreed around the actual works,
          building and people involved.
        </p>
        <p>
          This page summarises the company’s published approach. Contact the
          team for current policy documentation and the arrangements for your
          project.
        </p>
        <Link
          className="text-link"
          href="mailto:team@buildtonic.co.uk?subject=Health%20and%20safety%20documentation"
        >
          Request policy documentation <Arrow />
        </Link>
      </section>
      <EnquiryBand />
    </main>
  );
}
