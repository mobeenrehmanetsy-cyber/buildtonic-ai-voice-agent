import type { Metadata } from "next";
import { PageIntro } from "../components/editorial";
export const metadata: Metadata = {
  title: "Privacy & this preview",
  description:
    "How this Buildtonic prototype handles browsing, contact links and the unconnected voice interface.",
};
export default function PrivacyPage() {
  return (
    <main id="main-content">
      <PageIntro
        eyebrow="Privacy & cookies"
        title="Clear about what this website does."
        description="This notice describes the current website prototype and its enquiry and voice interface."
      />
      <section className="wrap prose-page">
        <h2>Browsing the website</h2>
        <p>
          This application does not add analytics, advertising trackers or
          tracking cookies. Images and fonts are served with the site. Hosting
          infrastructure may process technical request information, such as IP
          addresses and server logs, to deliver the website.
        </p>
        <h2>Contacting the team</h2>
        <p>
          Email and telephone links open your own applications. This site does
          not receive or store the contents of an enquiry form. Information you
          choose to send by email is handled outside this prototype.
        </p>
        <h2>The conversational assistant</h2>
        <p>
          The interface is not connected to an AI service. It does not request
          microphone access, record audio, produce transcripts or place calls.
          Page context and a selected topic are held in browser memory while you
          use the interface; they are not sent to an AI provider.
        </p>
        <p>
          Browser language preferences may be read when you open the panel to
          prepare a future language choice. English remains the default. Closing
          or reloading the site does not create a stored conversation.
        </p>
        <h2>Questions or a future change</h2>
        <p>
          Contact{" "}
          <a href="mailto:team@buildtonic.co.uk">team@buildtonic.co.uk</a> with
          privacy questions. This notice must be reviewed before live voice,
          enquiry submission or telephone-call handling is introduced.
        </p>
      </section>
    </main>
  );
}
