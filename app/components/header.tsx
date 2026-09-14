"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
const navigation = [
  ["Our work", "/projects"],
  ["Expertise", "/expertise"],
  ["Heritage", "/heritage"],
  ["About", "/about"],
  ["Areas", "/areas"],
];
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner wrap">
          <Link
            href="/"
            aria-label="Buildtonic home"
            className="wordmark"
            onClick={() => setOpen(false)}
          >
            BUILDTONIC<span>.</span>
          </Link>
          <button
            ref={button}
            className="menu-button"
            aria-expanded={open}
            aria-controls="primary-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? "Close" : "Menu"}
            <span aria-hidden="true">{open ? "×" : "+"}</span>
          </button>
          <nav
            id="primary-navigation"
            aria-label="Main navigation"
            className={open ? "navigation is-open" : "navigation"}
          >
            {navigation.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                aria-current={
                  pathname === href || pathname.startsWith(href + "/")
                    ? "page"
                    : undefined
                }
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/start-project"
              className="header-cta"
              onClick={() => setOpen(false)}
            >
              Start a project <span aria-hidden="true">↗</span>
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
