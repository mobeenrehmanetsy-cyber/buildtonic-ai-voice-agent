import Image from "next/image";
import Link from "next/link";
import { Arrow } from "./ui";
import { projects } from "./projects/data";

const services = [
  [
    "Heritage & conservation",
    "Sensitive repairs to listed and period buildings, with traditional materials and respect for the original fabric.",
    "/heritage/",
  ],
  [
    "New homes",
    "Residential construction from the ground up, bringing structure, detail and finishing together under one contractor.",
    "/expertise/new-homes",
  ],
  [
    "Extensions & renovations",
    "Thoughtful additions and renewed interiors that make room for the way you want to live.",
    "/expertise/extensions-renovations",
  ],
  [
    "Consent & surveys",
    "Listed Building Consent coordination, condition reports and surveys to help establish the right next step.",
    "/expertise#consent-surveys",
  ],
];

export default function Home() {
  return (
    <>
      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <Image
            src="/images/rose-cottage.webp"
            alt="Rose Cottage in Hampshire, with its restored white exterior and garden"
            fill
            preload
            sizes="100vw"
            className="hero-image"
          />
          <div className="hero-shade" />
          <div className="hero-content wrap">
            <p className="eyebrow light">
              <span /> Heritage & residential construction
            </p>
            <h1 id="hero-title">
              A respect for the past.
              <br /> A vision for <em>what’s next.</em>
            </h1>
            <div className="hero-bottom">
              <div>
                <p>
                  Considered construction. Lasting character.
                  <br />
                  Across Hampshire, Surrey & London.
                </p>
                <a className="button button-cream" href="#projects">
                  Explore our work <Arrow />
                </a>
              </div>
              <Link href="/projects/rose-cottage" className="hero-caption">
                <span className="eyebrow">In focus / 01</span>
                <span>
                  Rose Cottage, Hampshire <Arrow />
                </span>
              </Link>
            </div>
          </div>
          <div className="hero-foot wrap">
            <span>Built with care. Made to last.</span>
            <a href="#about">
              Discover Buildtonic <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>
        <section id="about" className="intro wrap section-space">
          <p className="eyebrow section-label">
            <span /> The Buildtonic approach
          </p>
          <div>
            <h2>
              Buildings with character.
              <br />
              <em>People who care.</em>
            </h2>
            <div className="intro-copy">
              <p>
                A home is more than its plans. It is the materials, the
                decisions and the care that go into making it.
              </p>
              <p>
                We are a main contractor specialising in heritage and
                residential construction. From restoring a period property to
                creating a new family home, we bring traditional craft and
                considered project delivery together.
              </p>
            </div>
            <Link className="text-link" href="/about">
              Meet Buildtonic <Arrow />
            </Link>
          </div>
        </section>
        <section id="projects" className="projects-section section-space">
          <div className="wrap">
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  <span /> Selected work
                </p>
                <h2>
                  Every building.
                  <br />
                  <em>Its own story.</em>
                </h2>
              </div>
              <p>
                From a Hampshire cottage to a Surrey landmark.
                <br />A closer look at the work we do.
              </p>
            </div>
            <div className="project-grid">
              {projects.slice(0, 2).map((project, index) => (
                <Link
                  className={`project project-${index + 1}`}
                  href={`/projects/${project.slug}`}
                  key={project.slug}
                >
                  <div className="project-image">
                    <Image
                      src={project.image}
                      alt={project.alt}
                      fill
                      sizes="(max-width: 700px) 90vw, 55vw"
                    />
                    <span className="project-open" aria-hidden="true">
                      <Arrow />
                    </span>
                  </div>
                  <div className="project-meta">
                    <span>{project.category}</span>
                    <span>{project.location}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.short}</p>
                  <span className="text-link">
                    View the project <Arrow />
                  </span>
                </Link>
              ))}
            </div>
            <div className="project-index">
              <span className="eyebrow">Also in the collection</span>
              <Link href="/projects">
                View all work <span>Heritage · Renovation · New homes</span>
                <Arrow />
              </Link>
            </div>
          </div>
        </section>
        <section id="heritage" className="heritage-section">
          <div className="heritage-photo">
            <Image
              src="/images/old-thatch-detail.webp"
              alt="The thatched roof, flint and brick facade of The Old Thatch, Hampshire"
              fill
              sizes="(max-width: 800px) 100vw, 50vw"
            />
            <span className="photo-note">The Old Thatch / Hampshire</span>
          </div>
          <div className="heritage-content">
            <p className="eyebrow light">
              <span /> A specialist understanding
            </p>
            <h2>
              Some things
              <br />
              deserve to be
              <br />
              <em>preserved.</em>
            </h2>
            <p>
              The texture of flint. The character of old timber. The quiet
              beauty of a building that has stood for generations.
            </p>
            <p>
              We approach heritage work by understanding what is already there.
              Compatible lime mortars, breathable finishes and careful repairs
              help protect the fabric that makes a place itself.
            </p>
            <div className="heritage-tags">
              <span>Lime & limecrete</span>
              <span>Historic timber & masonry</span>
              <span>Listed building repairs</span>
            </div>
            <Link className="text-link light-link" href="/heritage">
              Explore heritage <Arrow />
            </Link>
          </div>
        </section>
        <section id="services" className="services-section wrap section-space">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <span /> Our expertise
              </p>
              <h2>
                From first ideas
                <br />
                to <em>the final detail.</em>
              </h2>
            </div>
            <p>
              One considered approach.
              <br />
              Expertise shaped around your building.
            </p>
          </div>
          <div className="service-list">
            {services.map(([title, description, url], index) => (
              <details className="service" key={title} open={index === 0}>
                <summary>
                  <span className="service-number">0{index + 1}</span>
                  <h3>{title}</h3>
                  <span className="service-toggle" aria-hidden="true" />
                </summary>
                <div className="service-description">
                  <p>{description}</p>
                  <Link className="text-link" href={url}>
                    Explore this expertise <Arrow />
                  </Link>
                </div>
              </details>
            ))}
          </div>
        </section>
        <section id="approach" className="approach-section section-space">
          <div className="wrap">
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  <span /> From conversation to completion
                </p>
                <h2>
                  Good work starts
                  <br />
                  with <em>understanding.</em>
                </h2>
              </div>
              <Link href="/start-project" className="text-link">
                Let’s talk about your project <Arrow />
              </Link>
            </div>
            <div className="steps">
              {[
                [
                  "01",
                  "Listen & understand",
                  "We begin with your plans and the building itself, identifying the brief, its constraints and the possibilities.",
                ],
                [
                  "02",
                  "Plan & prepare",
                  "Surveys, specifications and consent coordination establish a clear basis for the programme and the work ahead.",
                ],
                [
                  "03",
                  "Build & deliver",
                  "Site management and specialist trades bring the details together, from the first works through to handover.",
                ],
              ].map(([number, title, copy]) => (
                <div key={number}>
                  <span className="step-number">{number}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section
          className="credentials wrap"
          aria-labelledby="credentials-title"
        >
          <div>
            <p className="eyebrow" id="credentials-title">
              Memberships & accreditations
            </p>
            <p>Craft, backed by accountability.</p>
          </div>
          <a
            href="https://builders.org.uk/members/buildtonic-ltd/"
            target="_blank"
            rel="noreferrer"
          >
            <strong>NFB</strong>
            <span>
              Heritage Approved Contractor
              <span className="sr-only"> (opens in a new tab)</span>
            </span>
          </a>
          <a
            href="https://www.fmb.org.uk/builder/buildtonic-ltd.html"
            target="_blank"
            rel="noreferrer"
          >
            <strong>FMB</strong>
            <span>
              Federation of Master Builders · Member
              <span className="sr-only"> (opens in a new tab)</span>
            </span>
          </a>
          <div className="credential">
            <strong className="constructionline">Constructionline</strong>
            <span>Silver</span>
          </div>
        </section>
        <section id="contact" className="contact-section section-space">
          <div className="wrap contact-grid">
            <div>
              <p className="eyebrow">
                <span /> Your next chapter
              </p>
              <h2>
                Something
                <br />
                <em>in mind?</em>
              </h2>
            </div>
            <div className="contact-copy">
              <p>
                A new home, a sensitive restoration, or the beginnings of an
                idea. Tell us about your building and what you would like to do.
              </p>
              <Link className="button button-dark" href="/start-project">
                Start a project <Arrow />
              </Link>
              <div className="contact-direct">
                <a href="mailto:team@buildtonic.co.uk">team@buildtonic.co.uk</a>
                <a href="tel:+442081292694">020 8129 2694</a>
              </div>
              <span className="contact-area">Hampshire · Surrey · London</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
