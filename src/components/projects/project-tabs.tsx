"use client";

import { useState } from "react";

const PLACEHOLDER = "—";

function Body({ text }: { text: string }) {
  if (!text || text.trim() === PLACEHOLDER) {
    return <p className="muted">Not yet filled in — use Edit project to add this.</p>;
  }
  return <p style={{ whiteSpace: "pre-wrap" }}>{text}</p>;
}

function FieldBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="field-block">
      <h3>{title}</h3>
      <Body text={text} />
    </div>
  );
}

interface StepItem {
  id: string;
  stepNumber: number;
  title: string;
  simpleExplanation: string;
  partsToolsNeeded: string;
  whatIDid: string;
  whatWentWrong: string;
  howIFixedIt: string;
  grandkidFriendlyExplanation: string;
  futureTutorialNotes: string;
  safetyNotes: string;
}

function StepCard({ step }: { step: StepItem }) {
  return (
    <div className="step-card">
      <div className="step-number">{step.stepNumber}</div>
      <div>
        <h3>{step.title}</h3>
        <p>{step.simpleExplanation}</p>
        {step.partsToolsNeeded && step.partsToolsNeeded !== PLACEHOLDER ? (
          <p>
            <strong>Parts / tools:</strong> {step.partsToolsNeeded}
          </p>
        ) : null}
        {step.whatIDid && step.whatIDid !== PLACEHOLDER ? (
          <p>
            <strong>What I did:</strong> {step.whatIDid}
          </p>
        ) : null}
        {step.whatWentWrong ? (
          <p>
            <strong>What went wrong:</strong> {step.whatWentWrong}
          </p>
        ) : null}
        {step.howIFixedIt ? (
          <p>
            <strong>How I fixed it:</strong> {step.howIFixedIt}
          </p>
        ) : null}
        {step.grandkidFriendlyExplanation && step.grandkidFriendlyExplanation !== PLACEHOLDER ? (
          <p className="muted">{step.grandkidFriendlyExplanation}</p>
        ) : null}
      </div>
    </div>
  );
}

type TabId = "overview" | "parts" | "build-log" | "images" | "lessons";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "parts", label: "Parts" },
  { id: "build-log", label: "Build Log" },
  { id: "images", label: "Images & Files" },
  { id: "lessons", label: "Lessons Learned" },
];

export interface ProjectTabsProps {
  project: {
    slug: string;
    projectGoal: string;
    whyBuilt: string;
    problemSolved: string;
    projectStory: string;
    partsSummary: string;
    lessonsLearned: string;
    mistakesProblems: string;
    fixesSolutions: string;
    safetyNotes: string;
    futureTutorialNotes: string;
    nextSteps: string;
    steps: StepItem[];
    parts: Array<{ id: string; name: string; quantity: number; role: string }>;
    files: unknown[];
    images: unknown[];
  };
  createdAt: string;
  updatedAt: string;
}

export function ProjectTabs({ project, createdAt, updatedAt }: ProjectTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="project-tabs">
      <nav className="tab-nav" aria-label="Project sections">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab-btn${activeTab === tab.id ? " active" : ""}`}
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ── Overview ─────────────────────────────────────────── */}
      <div className={`tab-panel${activeTab === "overview" ? " tab-panel--active" : ""}`}>
        <div className="stack">
          <section className="panel journal-section">
            <h2>The story</h2>
            <Body text={project.projectStory} />
          </section>
          <section className="panel journal-section">
            <h2>Purpose</h2>
            <div className="journal-grid">
              <FieldBlock title="Project goal" text={project.projectGoal} />
              <FieldBlock title="Why I built it" text={project.whyBuilt} />
              <FieldBlock title="Problem it solves" text={project.problemSolved} />
              <FieldBlock title="Next steps" text={project.nextSteps} />
            </div>
          </section>
          <section className="panel journal-section">
            <h2>Record dates</h2>
            <ul className="compact-list">
              <li>
                <span>Created</span>
                <strong>{createdAt}</strong>
              </li>
              <li>
                <span>Updated</span>
                <strong>{updatedAt}</strong>
              </li>
            </ul>
          </section>
        </div>
      </div>

      {/* ── Parts ────────────────────────────────────────────── */}
      <div className={`tab-panel${activeTab === "parts" ? " tab-panel--active" : ""}`}>
        <div className="stack">
          <section className="panel journal-section">
            <h2>Parts summary</h2>
            <Body text={project.partsSummary} />
          </section>
          {project.parts.length > 0 ? (
            <section className="panel journal-section">
              <h2>Parts list</h2>
              <ul className="compact-list">
                {project.parts.map((part) => (
                  <li key={part.id}>
                    <span>
                      <strong>{part.quantity}×</strong> {part.name}
                    </span>
                    <span className="muted">{part.role}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <div className="empty-state">
              <p>
                No parts have been added yet. Use{" "}
                <a href={`/projects/${project.slug}/edit`}>Edit project</a> to fill in the parts
                summary.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Build Log ────────────────────────────────────────── */}
      <div className={`tab-panel${activeTab === "build-log" ? " tab-panel--active" : ""}`}>
        <section className="panel journal-section">
          <h2>Build steps</h2>
          {project.steps.length > 0 ? (
            <div className="timeline">
              {project.steps.map((step) => (
                <StepCard key={step.id} step={step} />
              ))}
            </div>
          ) : (
            <p className="muted">No steps have been documented yet.</p>
          )}
        </section>
      </div>

      {/* ── Images & Files ───────────────────────────────────── */}
      <div className={`tab-panel${activeTab === "images" ? " tab-panel--active" : ""}`}>
        <section className="panel journal-section">
          <h2>Attachments and images</h2>
          <p>
            Project photos, wiring diagrams, schematics, PDFs, and datasheets are supported.
          </p>
          <ul className="compact-list">
            <li>
              <span>Stored files</span>
              <strong>{project.files.length}</strong>
            </li>
            <li>
              <span>Image variants</span>
              <strong>{project.images.length}</strong>
            </li>
          </ul>
        </section>
      </div>

      {/* ── Lessons Learned ──────────────────────────────────── */}
      <div className={`tab-panel${activeTab === "lessons" ? " tab-panel--active" : ""}`}>
        <div className="stack">
          <section className="panel journal-section">
            <h2>Lessons and fixes</h2>
            <div className="journal-grid">
              <FieldBlock title="Lessons learned" text={project.lessonsLearned} />
              <FieldBlock title="Mistakes / problems" text={project.mistakesProblems} />
              <FieldBlock title="Fixes / solutions" text={project.fixesSolutions} />
              <FieldBlock title="Safety notes" text={project.safetyNotes} />
            </div>
          </section>
          <section className="panel journal-section">
            <h2>Future tutorial notes</h2>
            <Body text={project.futureTutorialNotes} />
          </section>
        </div>
      </div>
    </div>
  );
}
