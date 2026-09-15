import Link from "next/link";
import Image from "next/image";
import { Arrow } from "./ui";
import { ProjectEntry, Standards } from "./components/editorial";
import { projects } from "./projects/data";

export default function Home() {
  return (
    <main id="main-content" className="new-home">
      <section className="masthead wrap">
        <div className="masthead-kicker">
          <p className="eyebrow">Buildtonic / Main contractor</p>
          <span>Hampshire · Surrey · London</span>
        </div>
        <h1>
          Character.
          <br />
          <span>Built in.</span>
        </h1>
        <div className="masthead-aside">
          <p>
            Heritage buildings.
            <br />
            Contemporary homes.
            <br />
            Care in every detail.
          </p>
          <Link href="/projects" className="text-link">
            Discover our work <Arrow />
          </Link>
        </div>
      </section>
      <figure className="opening-image">
        <Image
          src="/images/projects/the-laurels-g6.jpg"
          alt="The Laurels: panelled kitchen cabinetry, brass fittings and a light-filled breakfast space"
          width={6000}
          height={4000}
          preload
          sizes="100vw"
        />
        <figcaption>
          <span>In detail / The Laurels, Hampshire</span>
          <Link href="/projects/the-laurels">
            Inside the project <Arrow />
          </Link>
        </figcaption>
      </figure>
      <section className="home-statement wrap">
        <p className="eyebrow">A building’s next chapter</p>
        <div>
          <h2>
            Keep what matters.
            <br />
            <em>Make room for more.</em>
          </h2>
          <p>
            Buildtonic is a heritage and residential main contractor. We repair
            historic fabric, rework existing homes and bring new buildings into
            being. Different work, connected by a careful understanding of the
            place and the people it is for.
          </p>
          <Link href="/about" className="text-link">
            Get to know Buildtonic <Arrow />
          </Link>
        </div>
      </section>
      <section className="work-edit wrap" id="projects">
        <div className="edit-heading">
          <p className="eyebrow">The work / Selected stories</p>
          <h2>
            Places.
            <br />
            <em>With purpose.</em>
          </h2>
          <Link href="/projects" className="text-link">
            All six projects <Arrow />
          </Link>
        </div>
        <div className="work-edit-grid">
          {[projects[0], projects[2], projects[5]].map((p, i) => (
            <ProjectEntry key={p.slug} project={p} index={i} />
          ))}
        </div>
      </section>
      <section className="craft-chapter">
        <div className="wrap craft-grid">
          <div className="craft-title">
            <p className="eyebrow">The fabric of a place</p>
            <h2>
              Old hands.
              <br />
              New thinking.
            </h2>
          </div>
          <div className="craft-copy">
            <p>
              Flint, lime and timber each ask something different of a builder.
              Understanding their character informs the repair, the material and
              the detail.
            </p>
            <p>
              That same attention carries through to structural alterations,
              contemporary interiors and the delivery of a new home.
            </p>
            <Link href="/heritage" className="text-link">
              Our heritage expertise <Arrow />
            </Link>
          </div>
          <figure>
            <Image
              src="/images/projects/the-old-thatch-cover.jpg"
              alt="Traditional flint panels and brickwork at The Old Thatch"
              width={2400}
              height={1800}
              sizes="(max-width: 700px) 90vw, 65vw"
            />
            <figcaption>The Old Thatch / Flint and lime</figcaption>
          </figure>
          <div className="craft-note">
            <span aria-hidden="true">↗</span>
            <p>
              Start with the building.
              <br />
              Understand its fabric.
              <br />
              Choose the right approach.
            </p>
            <Link href="/expertise/surveys" className="text-link">
              Surveys & reports <Arrow />
            </Link>
          </div>
        </div>
      </section>
      <section className="capability-index wrap">
        <div>
          <p className="eyebrow">Your project, our expertise</p>
          <h2>
            What’s
            <br />
            <em>taking shape?</em>
          </h2>
        </div>
        <div>
          {[
            [
              "01",
              "A new home",
              "From the ground up, with one principal contractor.",
              "/expertise/new-homes",
            ],
            [
              "02",
              "A home, reimagined",
              "Extensions, structural changes and considered renovation.",
              "/expertise/extensions-renovations",
            ],
            [
              "03",
              "A historic building",
              "Traditional repairs and care for listed and period properties.",
              "/heritage",
            ],
            [
              "04",
              "A clearer way forward",
              "Consent coordination, condition surveys and reports.",
              "/expertise#consent-surveys",
            ],
          ].map(([n, t, d, h]) => (
            <Link href={h} key={n}>
              <span>{n}</span>
              <div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
              <Arrow />
            </Link>
          ))}
        </div>
      </section>
      <section className="home-standards wrap">
        <div className="edit-heading">
          <p className="eyebrow">Professional foundations</p>
          <h2>
            Care you can
            <br />
            <em>build on.</em>
          </h2>
          <Link href="/health-and-safety" className="text-link">
            Standards & site safety <Arrow />
          </Link>
        </div>
        <Standards />
      </section>
      <section className="closing-chapter">
        <div className="wrap">
          <p className="eyebrow">Let’s begin with your ideas</p>
          <h2>A place in mind?</h2>
          <div>
            <p>
              Tell us about the building, the possibilities
              <br />
              and what you would like to happen next.
            </p>
            <Link className="button button-cream" href="/start-project">
              Shape your project brief <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
