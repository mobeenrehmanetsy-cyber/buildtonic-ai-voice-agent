import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "../components/editorial";
import { company } from "../content/company";
import { Arrow } from "../ui";
export const metadata: Metadata = {
  title: "Start a project",
  description:
    "Contact Buildtonic about a new home, extension, renovation, heritage project or survey across Hampshire, Surrey and London.",
};
export default function StartProjectPage() {
  return (
    <main id="main-content">
      <PageIntro
        eyebrow="Your next chapter"
        title="Tell us what you have in mind."
        description="A new home, a sensitive repair or the first outline of an idea. Begin with the building and what you would like to achieve."
      />
      <section className="wrap enquiry-layout">
        <div className="enquiry-primary">
          <p className="eyebrow">Make the first connection</p>
          <h2>
            A conversation.
            <br />
            <em>Not a commitment.</em>
          </h2>
          <p>
            Email the team with your project details, or call to talk them
            through. There is no online submission form here; your message is
            sent only when you send it through your email application.
          </p>
          <a
            className="button button-dark"
            href="mailto:team@buildtonic.co.uk?subject=Project%20enquiry"
          >
            Email your project brief <Arrow />
          </a>
          <a className="contact-number" href={company.telephoneHref}>
            {company.phone}
          </a>
          <a href={`mailto:${company.email}`}>{company.email}</a>
        </div>
        <aside className="enquiry-preparation">
          <p className="eyebrow">Useful to include</p>
          <ol>
            <li>
              <strong>The place</strong>
              <span>
                Property address or postcode and whether it is a period or
                listed building.
              </span>
            </li>
            <li>
              <strong>The idea</strong>
              <span>
                Type of work, priorities and any concerns about the building.
              </span>
            </li>
            <li>
              <strong>The stage</strong>
              <span>
                Drawings, appointed advisers, relevant correspondence and your
                hoped-for timing.
              </span>
            </li>
            <li>
              <strong>The conversation</strong>
              <span>
                Your name and how you would prefer the team to contact you.
              </span>
            </li>
          </ol>
          <Link href="/areas" className="text-link">
            Check our service area <Arrow />
          </Link>
        </aside>
      </section>
      <section id="telephone" className="soft-section">
        <div className="wrap split-copy">
          <div>
            <p className="eyebrow">Ways to talk</p>
            <h2>
              People first.
              <br />
              <em>More choice to come.</em>
            </h2>
          </div>
          <div>
            <h3>Call the Buildtonic team</h3>
            <p>
              The telephone link above opens your device’s calling application.
              It does not request an automated callback.
            </p>
            <h3>Browser voice & AI call requests</h3>
            <p>
              The conversational assistant is being prepared. Browser voice is
              not connected, and requests for an AI telephone call are not yet
              available. No microphone access or telephone number is collected
              in this preview.
            </p>
            <p>For help now, use email or call the team directly.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
