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
          Your project draft stays in browser memory during local navigation;
          refreshing clears it. Choosing Submit enquiry sends the reviewed
          details and contact preferences to this website’s server. The server
          validates them and returns a receipt only after storage succeeds.
          Local development receipts explicitly identify local storage and do
          not mean the team received your enquiry. Production submission is
          unavailable until persistent storage is connected. You can download a
          copy and contact the team directly if submission is unavailable. Email
          and telephone links open your own applications.
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
          session. Website chat does not create a conversation database,
          local-storage transcript or application audio recording. You can
          explicitly import assistant notes into your project enquiry or send
          your draft to the assistant; review conflicting answers before
          submission.
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
        <h2>Optional telephone AI</h2>
        <p>
          Telephone AI is being prepared and is not connected yet. An outbound
          AI call requires a separate, explicit choice in the enquiry form.
          Declining does not prevent normal submission. Consent is recorded with
          a server timestamp and the telephone number you supplied; the AI
          cannot grant that consent. A preference is not a scheduled call.
          Contact the team to withdraw your preference before a call is
          arranged.
        </p>
        <p>
          When telephone AI is enabled, Telnyx will handle the call and the
          configured AI provider will process the conversation. The assistant
          identifies itself as AI and asks permission before retaining new
          project notes. Relevant notes, call status and any generated summary
          may be stored for enquiry review. This application does not request
          call recordings or retain raw audio by default. Provider processing
          and retention settings must be reviewed before live use.
        </p>
        <h2>Questions or a future change</h2>
        <p>
          Contact{" "}
          <a href="mailto:team@buildtonic.co.uk">team@buildtonic.co.uk</a> with
          privacy questions or requests about submitted information. Production
          storage, retention periods, access arrangements and telephone-provider
          settings must be confirmed before live enquiry and telephone handling.
        </p>
      </section>
    </main>
  );
}
