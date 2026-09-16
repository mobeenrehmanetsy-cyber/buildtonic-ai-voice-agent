import Link from "next/link";
import { OpenAssistant } from "./components/open-assistant";
import { company } from "./content/company";
export function Arrow() {
  return (
    <svg
      className="arrow"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <path d="M4 12h15M13 5l7 7-7 7" />
    </svg>
  );
}
export function Footer() {
  return (
    <footer className="editorial-footer">
      <div className="wrap">
        <section
          className="footer-invitation"
          aria-labelledby="footer-invitation-title"
        >
          <p className="eyebrow">Have a project in mind?</p>
          <h2 id="footer-invitation-title">
            Tell us what
            <br />
            you’re <em>planning.</em>
          </h2>
          <div className="footer-invitation-aside">
            <p>
              New beginnings. Thoughtful alterations. A future for the buildings
              we value.
            </p>
            <p>
              Residential, heritage and listed-building projects across
              Hampshire, Surrey and London.
            </p>
            <div>
              <Link href="/start-project" className="button button-cream">
                Start a project <Arrow />
              </Link>
              <OpenAssistant className="footer-ai-link" />
            </div>
          </div>
        </section>
        <div className="footer-directory">
          <div className="footer-identity">
            <Link href="/" className="wordmark">
              BUILDTONIC<span>.</span>
            </Link>
            <p>Heritage &amp; residential construction</p>
            <p>Hampshire · Surrey · London</p>
            <p className="footer-statement">
              A considered approach to building.
              <br />
              Care in the detail. Respect for what’s there.
            </p>
          </div>
          <nav aria-label="Footer expertise">
            <h3>Expertise</h3>
            <Link href="/expertise/new-homes">New homes</Link>
            <Link href="/expertise/extensions-renovations">
              Extensions &amp; renovations
            </Link>
            <Link href="/heritage">Heritage &amp; listed buildings</Link>
            <Link href="/expertise/surveys">Surveys &amp; reports</Link>
            <Link href="/expertise/consent">Listed Building Consent</Link>
          </nav>
          <nav aria-label="Footer explore">
            <h3>Explore</h3>
            <Link href="/projects">Projects</Link>
            <Link href="/about">About</Link>
            <Link href="/areas">Areas we cover</Link>
            <Link href="/guides">Guides</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/careers">Careers</Link>
          </nav>
          <div className="footer-contact">
            <h3>A direct conversation</h3>
            <a href={"mailto:" + company.email}>{company.email}</a>
            <a href={company.telephoneHref}>{company.phone}</a>
            <p>Farnham, Surrey</p>
            <Link href="/start-project">
              Start a project <Arrow />
            </Link>
          </div>
        </div>
        <section
          className="footer-credentials"
          aria-label="Published credentials and working standards"
        >
          <p className="eyebrow">Professional standards</p>
          <div>
            <Link href="/about#standards">NFB Heritage Approved</Link>
            <Link href="/about#standards">FMB Member</Link>
            <Link href="/about#standards">Constructionline Silver</Link>
          </div>
          <p>
            JCT contracts <span>·</span> CDM site management <span>·</span> CIS
            registered
          </p>
        </section>
        <div className="footer-legal">
          <p>
            © {new Date().getFullYear()} {company.name}
          </p>
          <Link href="/privacy">Privacy</Link>
          <Link href="/health-and-safety">Health &amp; Safety</Link>
          <a href="#company-information">Company information</a>
          <a href="#main-content">Back to top ↑</a>
        </div>
        <p className="footer-registration" id="company-information">
          Registered in England &amp; Wales · Company No. {company.number}
          <br />
          Registered office: {company.address}.
        </p>
      </div>
    </footer>
  );
}
