import type { Metadata } from "next";
import { PageIntro } from "../components/editorial";
import { Arrow } from "../ui";
export const metadata: Metadata = {
  title: "Careers",
  description:
    "Introduce yourself to Buildtonic for skilled trade, management or potential apprenticeship opportunities.",
};
export default function CareersPage() {
  return (
    <main id="main-content">
      <PageIntro
        eyebrow="Work with us"
        title="Care about the work you put your name to?"
        description="Buildtonic welcomes introductions from skilled tradespeople, managers and people interested in potential apprenticeships."
      />
      <section className="wrap prose-page">
        <h2>Introduce yourself</h2>
        <p>
          Send a CV and a short covering note outlining your skills, location
          and the kind of work you are interested in. This is an invitation to
          make contact, rather than a listing of confirmed vacancies.
        </p>
        <a
          className="button button-dark"
          href="mailto:team@buildtonic.co.uk?subject=Working%20with%20Buildtonic"
        >
          Email your CV <Arrow />
        </a>
        <p className="muted-note">
          Your email application opens when you choose this link. You can review
          your message and add attachments before sending.
        </p>
      </section>
    </main>
  );
}
