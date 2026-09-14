import Link from "next/link";
import { Arrow } from "./ui";
export default function NotFound() {
  return (
    <main id="main-content" className="wrap not-found">
      <p className="eyebrow">404 / A missing page</p>
      <h1>
        Let’s find
        <br />
        <em>your way back.</em>
      </h1>
      <p>
        This page is not part of the current website. Explore the work or tell
        us about your project.
      </p>
      <Link href="/projects" className="button button-dark">
        Explore our work <Arrow />
      </Link>
      <Link href="/start-project" className="text-link">
        Start a project <Arrow />
      </Link>
    </main>
  );
}
