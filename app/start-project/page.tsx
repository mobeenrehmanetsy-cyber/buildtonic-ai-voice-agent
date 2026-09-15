import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectEnquiry } from "./project-enquiry";
import { company } from "../content/company";
export const metadata: Metadata = {
  title: "Start a project",
  description:
    "Shape a project brief for Buildtonic: your building, your ideas and the next conversation.",
};
export default function StartProjectPage() {
  return (
    <main id="main-content" className="brief-page">
      <header className="wrap brief-heading">
        <p className="eyebrow">A place to begin</p>
        <h1>
          Every project
          <br />
          starts with <em>an idea.</em>
        </h1>
        <p>
          Let’s put yours into words. Share what you know; there is room for the
          things you are still working out.
        </p>
      </header>
      <Suspense
        fallback={<p className="wrap">Preparing your project brief…</p>}
      >
        <ProjectEnquiry />
      </Suspense>
      <section className="wrap brief-alternatives" id="telephone">
        <div>
          <p className="eyebrow">Prefer a conversation?</p>
          <h2>Talk to the team.</h2>
        </div>
        <div>
          <a href={`mailto:${company.email}`}>{company.email}</a>
          <a href={company.telephoneHref}>{company.phone}</a>
          <p>
            Email and telephone open your own applications. Browser voice is
            available through the AI assistant when configured. Automated
            telephone calls are not available.
          </p>
        </div>
      </section>
    </main>
  );
}
