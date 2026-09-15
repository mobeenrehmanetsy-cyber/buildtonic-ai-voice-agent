import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { heritageSpecialisms } from "../content/expertise";
import { PageIntro, RelatedWork, EnquiryBand } from "../components/editorial";
import { Arrow } from "../ui";
export const metadata: Metadata = {
  title: "Heritage & conservation",
  description:
    "Traditional materials, lime, limecrete, timber and masonry repairs for period and listed buildings.",
};
export default function HeritagePage() {
  return (
    <main id="main-content">
      <PageIntro
        eyebrow="Heritage & conservation"
        title="Keep the character. Care for the fabric."
        description="Old buildings carry the marks of the people and materials that made them. Our work begins by understanding that history, then choosing repairs that respect it."
      />
      <div className="heritage-banner">
        <Image
          src="/images/projects/the-old-thatch-facade.jpg"
          alt="Flint, brick and thatch at The Old Thatch in Hampshire"
          fill
          preload
          sizes="100vw"
        />
        <span className="photo-note">The Old Thatch / Hampshire</span>
      </div>
      <section className="wrap detail-layout section-space">
        <aside>
          <p className="eyebrow">Specialist knowledge</p>
          <h2>
            Materials
            <br />
            that <em>belong.</em>
          </h2>
          <Link href="/about#standards" className="text-link">
            Our credentials <Arrow />
          </Link>
        </aside>
        <div>
          <p className="body-lead">
            Traditional walls and floors often manage moisture differently from
            modern construction. The compatibility of a repair matters as much
            as its appearance.
          </p>
          <p className="body-copy">
            Buildtonic works with breathable materials and conservation
            detailing, retaining original fabric where a sound repair is
            possible. The right specification depends on the building, its
            condition and any consent requirements.
          </p>
          <div className="heritage-disclosures">
            {heritageSpecialisms.map((s, i) => (
              <details key={s.id} id={s.id} open={i === 0}>
                <summary>
                  {s.title}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{s.text}</p>
                {s.id === "consent" && (
                  <Link href="/expertise/consent" className="text-link">
                    Consent coordination <Arrow />
                  </Link>
                )}
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="soft-section">
        <div className="wrap split-copy">
          <div>
            <p className="eyebrow">Before you begin</p>
            <h2>
              A building first.
              <br />
              <em>A method second.</em>
            </h2>
          </div>
          <div>
            <p>
              Share what you know about the property: its age, materials, past
              repairs and the changes you are considering. Where there is damp
              or movement, an assessment can help establish the next step.
            </p>
            <p>
              For a listed property, check requirements with the local planning
              authority and your appointed advisers. No consent outcome or
              structural conclusion can be established through this website.
            </p>
            <Link href="/expertise/surveys" className="text-link">
              Surveys & building concerns <Arrow />
            </Link>
          </div>
        </div>
      </section>
      <RelatedWork
        slugs={["guildford-quaker-meeting-house", "the-old-thatch"]}
      />
      <EnquiryBand title="Tell us about your period property." />
    </main>
  );
}
