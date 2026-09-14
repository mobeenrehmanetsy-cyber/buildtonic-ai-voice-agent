import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, Standards, EnquiryBand } from "../components/editorial";
import { company, team, values } from "../content/company";
import { Arrow } from "../ui";
export const metadata: Metadata = {
  title: "About Buildtonic",
  description:
    "Meet the people, principles and standards behind Buildtonic’s heritage and residential construction work.",
};
export default function AboutPage() {
  return (
    <main id="main-content">
      <PageIntro
        eyebrow="About Buildtonic"
        title="Craft and accountability. Built together."
        description="Founded in 2021, Buildtonic brings traditional trades and heritage knowledge together with the structure of a modern main contractor."
      />
      <section className="wrap split-copy section-space compact-top">
        <h2>
          A hands-on team.
          <br />
          <em>A shared standard.</em>
        </h2>
        <div>
          <p>
            Our work spans new residential buildings, period homes and listed
            properties across Hampshire, Surrey and London. Delivery, commercial
            and finance roles are supported by a network of specialist trades.
          </p>
          <p>
            Good work depends on more than a finished surface. Clear
            information, appropriate materials and thoughtful site management
            matter at every stage.
          </p>
          <Link href="/projects" className="text-link">
            Explore the work <Arrow />
          </Link>
        </div>
      </section>
      <section id="values" className="soft-section">
        <div className="wrap">
          <p className="eyebrow">What guides us</p>
          <div className="values-grid">
            {values.map(([title, text]) => (
              <div key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="wrap section-space" id="team">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The people behind the work</p>
            <h2>
              Meet <em>the team.</em>
            </h2>
          </div>
          <Link href="/careers" className="text-link">
            Working with Buildtonic <Arrow />
          </Link>
        </div>
        <div className="team-list">
          {team.map(([name, role]) => (
            <div key={name}>
              <h3>{name}</h3>
              <p>{role}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="standards" className="soft-section">
        <div className="wrap">
          <p className="eyebrow">Memberships & accreditations</p>
          <h2>
            Care, with <em>accountability.</em>
          </h2>
          <Standards />
          <div className="values-grid">
            <div>
              <h3>JCT contracts</h3>
              <p>
                A formal basis for scope, payment terms and responsibilities.
              </p>
            </div>
            <div>
              <h3>CDM site management</h3>
              <p>
                Health and safety considered from planning through delivery.
              </p>
            </div>
            <div>
              <h3>CIS registration</h3>
              <p>
                Subcontractor arrangements managed within the Construction
                Industry Scheme.
              </p>
            </div>
          </div>
          <Link href="/health-and-safety" className="text-link">
            Our approach to site safety <Arrow />
          </Link>
        </div>
      </section>
      <section className="wrap company-record section-space">
        <h2>The company</h2>
        <dl>
          <div>
            <dt>Registered name</dt>
            <dd>{company.name}</dd>
          </div>
          <div>
            <dt>Company number</dt>
            <dd>{company.number}</dd>
          </div>
          <div>
            <dt>Registered in</dt>
            <dd>England & Wales</dd>
          </div>
          <div>
            <dt>Registered office</dt>
            <dd>{company.address}</dd>
          </div>
        </dl>
      </section>
      <EnquiryBand />
    </main>
  );
}
