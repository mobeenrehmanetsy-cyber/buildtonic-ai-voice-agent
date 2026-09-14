import Link from "next/link";
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
    <footer className="footer">
      <div className="wrap">
        <div className="footer-main">
          <div>
            <Link href="/" className="wordmark">
              BUILDTONIC<span>.</span>
            </Link>
            <p>
              Heritage & residential construction.
              <br />A considered approach to building.
            </p>
            <Link href="/start-project" className="text-link light-link">
              Start a project <Arrow />
            </Link>
          </div>
          <div>
            <span className="eyebrow">Explore</span>
            <Link href="/projects">Our work</Link>
            <Link href="/expertise">Our expertise</Link>
            <Link href="/heritage">Heritage & conservation</Link>
            <Link href="/about">About Buildtonic</Link>
            <Link href="/areas">Areas we cover</Link>
          </div>
          <div>
            <span className="eyebrow">Useful information</span>
            <Link href="/faq">Frequently asked questions</Link>
            <Link href="/guides">Planning your project</Link>
            <Link href="/about#values">Our values</Link>
            <Link href="/health-and-safety">Health & safety</Link>
            <Link href="/careers">Careers</Link>
          </div>
          <div>
            <span className="eyebrow">Get in touch</span>
            <a href={`mailto:${company.email}`}>{company.email}</a>
            <a href={company.telephoneHref}>{company.phone}</a>
            <p>Hampshire, Surrey & London</p>
          </div>
        </div>
        <div className="footer-standards">
          <span>JCT contracts</span>
          <span>CDM compliant</span>
          <span>CIS registered</span>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {company.name}. Registered in England &
            Wales. Company No. {company.number}.<br />
            Registered office: {company.address}.
          </p>
          <Link href="/privacy">Privacy & cookies</Link>
          <a href="#main-content">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
