import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "Electronics Project Hub",
  description: "Document electronics projects, parts, lessons, references, and build notes.",
};

const navItems = [
  { href: "/", label: "Dashboard", primary: true },
  { href: "/projects", label: "Projects", primary: true },
  { href: "/inventory", label: "Inventory", primary: false },
  { href: "/lessons", label: "Lessons", primary: false },
] as const;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <aside className="sidebar" aria-label="Primary navigation">
            <Link className="brand" href="/">
              <span className="brand-mark">EH</span>
              <strong className="brand-title">Electronics Project Hub</strong>
              <span className="brand-subtitle">Projects first, with room for parts, lessons, and references.</span>
            </Link>
            <nav className="nav-list">
              {navItems.map((item) => (
                <Link className={`nav-link ${item.primary ? "primary" : ""}`} href={item.href} key={item.href}>
                  {item.label}
                  <span className="nav-dot" />
                </Link>
              ))}
            </nav>
          </aside>
          <main className="main">
            <header className="topbar">
              <Link className="brand-title" href="/">Electronics Project Hub</Link>
              <nav aria-label="Mobile navigation">
                {navItems.map((item) => (
                  <Link className="pill" href={item.href} key={item.href}>{item.label}</Link>
                ))}
              </nav>
            </header>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
