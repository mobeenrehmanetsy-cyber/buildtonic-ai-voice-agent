import type { Metadata } from "next";
import Link from "next/link";
import { regions } from "../content/company";
import { PageIntro, EnquiryBand } from "../components/editorial";
import { Arrow } from "../ui";
export const metadata: Metadata = {
  title: "Areas we cover",
  description:
    "Buildtonic works across Hampshire, Surrey and London from its base in Farnham.",
};
export default function AreasPage() {
  return (
    <main id="main-content">
      <PageIntro
        eyebrow="Where we work"
        title="Rooted in Farnham. Working across the region."
        description="Heritage and residential construction across Hampshire, Surrey and London, including the towns and surrounding communities below."
      />
      <section className="wrap region-list">
        {regions.map((region, i) => (
          <div key={region.name}>
            <span className="eyebrow">0{i + 1}</span>
            <h2>{region.name}</h2>
            <ul>
              {region.towns.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <Link className="text-link" href={`/projects/${region.project}`}>
              See a {region.name} project <Arrow />
            </Link>
          </div>
        ))}
      </section>
      <div className="wrap editorial-note">
        <p>
          Have a project nearby? Include your postcode and the type of work in
          your enquiry so we can discuss your location and requirements.
        </p>
        <Link href="/start-project" className="text-link">
          Tell us where your project is <Arrow />
        </Link>
      </div>
      <EnquiryBand />
    </main>
  );
}
