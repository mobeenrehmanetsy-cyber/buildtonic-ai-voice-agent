import type { Metadata } from "next";
import Link from "next/link";
import { faqs } from "../content/company";
import { PageIntro, EnquiryBand } from "../components/editorial";
import { Arrow } from "../ui";
export const metadata: Metadata = {
  title: "Frequently asked questions",
  description:
    "Answers to common questions about Buildtonic’s services, coverage, contracts and starting a project.",
};
export default function FaqPage() {
  return (
    <main id="main-content">
      <PageIntro
        eyebrow="A little clarity"
        title="Good questions. Useful answers."
        description="A starting point for working with Buildtonic. For advice about your own building, the next step is a conversation about its particular needs."
      />
      <section
        className="wrap faq-list"
        aria-label="Frequently asked questions"
      >
        {faqs.map((f) => (
          <details key={f.question}>
            <summary>
              {f.question}
              <span aria-hidden="true">+</span>
            </summary>
            <div>
              <p>{f.answer}</p>
              <Link href={f.href} className="text-link">
                {f.label}
                <Arrow />
              </Link>
            </div>
          </details>
        ))}
      </section>
      <EnquiryBand title="Have a question of your own?" />
    </main>
  );
}
