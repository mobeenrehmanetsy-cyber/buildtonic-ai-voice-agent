import type { Metadata } from "next";
import { PageIntro } from "../components/editorial";
export const metadata: Metadata = {
  title: "Privacy & this preview",
  description:
    "How this Buildtonic prototype handles browsing, project briefs, AI text chat and optional browser voice.",
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
          The project brief holds your answers only in the current page’s
          browser memory. It does not send them to a server or save them in
          browser storage. Leaving or refreshing the page clears your answers.
          You can review the brief, download a text file to your device or open
          an email draft. You must send that email yourself; this website cannot
          confirm delivery. Email and telephone links open your own
          applications. Information you choose to send by email is handled
          outside this prototype.
        </p>
        <h2>Project videos and external media</h2>
        <p>
          Optional project media links open YouTube or Instagram in a new tab.
          No embedded player or social tracking script loads on this site. The
          external platform’s own privacy terms apply when you follow its link.
        </p>
        <h2>The AI assistant</h2>
        <p>
          When configured, text questions, recent conversation, project notes,
          your selected language and minimal page context are sent to OpenAI to
          generate replies. Page context identifies the local page and selected
          topic; it does not include your browsing history or browser language
          list. The assistant is AI and can make mistakes. Buildtonic’s team
          must confirm project-specific advice. Nothing is submitted to the team
          automatically.
        </p>
        <p>
          Microphone permission is requested only when you choose “Talk to
          Buildtonic”. While voice is active, microphone audio is transmitted to
          OpenAI and its generated audio is played in your browser. Voice
          transcripts appear in the conversation. Ending voice, closing the
          assistant or leaving the page stops the microphone and connection.
          Opening the panel or sending text does not activate your microphone.
        </p>
        <p>
          Messages, project notes and language choice are held in this site’s
          browser memory across local page navigation. Clear chat removes the
          conversation and notes from that memory; refreshing clears the
          session. No conversation database, local-storage transcript or
          application audio recording is created. A draft can be explicitly
          imported into the project brief, reviewed and shared by you.
        </p>
        <p>
          OpenAI processes the data needed to provide the service. Text requests
          disable Responses storage, which does not eliminate provider
          abuse-monitoring or other applicable retention. See{" "}
          <a
            href="https://developers.openai.com/api/docs/guides/your-data"
            target="_blank"
            rel="noreferrer"
          >
            OpenAI’s API data information (opens in a new tab)
          </a>
          . Avoid sharing unnecessary sensitive information. The assistant does
          not place telephone calls.
        </p>
        <h2>Questions or a future change</h2>
        <p>
          Contact{" "}
          <a href="mailto:team@buildtonic.co.uk">team@buildtonic.co.uk</a> with
          privacy questions. This notice must be reviewed before public AI
          deployment, enquiry submission or telephone-call handling is
          introduced.
        </p>
      </section>
    </main>
  );
}
