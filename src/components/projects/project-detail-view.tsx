import type { ProjectDifficulty, ProjectStatus } from "@prisma/client";

import { difficultyLabels, formatShortDate, statusLabels } from "@/lib/format";

export interface ProjectDetailViewProps {
  project: {
    title: string;
    shortDescription: string;
    status: ProjectStatus;
    difficulty: ProjectDifficulty;
    createdAt: Date;
    updatedAt: Date;
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
    steps: Array<{
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
    }>;
    parts: Array<{ id: string; name: string; quantity: number; role: string }>;
    files: unknown[];
    images: unknown[];
  };
}

export function ProjectDetailView({ project }: ProjectDetailViewProps) {
  return (
    <div className="page">
      <header className="page-header">
        <span className="eyebrow">Project journal</span>
        <h1>{project.title}</h1>
        <p className="lead">{project.shortDescription}</p>
        <div className="meta-row">
          <span className={`pill status-${project.status}`}>{statusLabels[project.status]}</span>
          <span className="pill">{difficultyLabels[project.difficulty]}</span>
          <span className="pill">Updated {formatShortDate(project.updatedAt)}</span>
        </div>
      </header>

      <div className="detail-layout">
        <main className="stack">
          <JournalSection title="The Story" body={project.projectStory} />
          <section className="panel journal-section" aria-labelledby="project-purpose-title">
            <h2 id="project-purpose-title">Purpose</h2>
            <div className="journal-grid">
              <FieldBlock title="Project goal" body={project.projectGoal} />
              <FieldBlock title="Why I built it" body={project.whyBuilt} />
              <FieldBlock title="Problem it solves" body={project.problemSolved} />
              <FieldBlock title="Next steps" body={project.nextSteps} />
            </div>
          </section>
          <section className="panel journal-section" aria-labelledby="project-steps-title">
            <h2 id="project-steps-title">Build steps</h2>
            {project.steps.length ? (
              <div className="timeline">
                {project.steps.map((step) => <StepCard key={step.id} step={step} />)}
              </div>
            ) : (
              <p className="muted">No steps have been documented yet.</p>
            )}
          </section>
          <section className="panel journal-section" aria-labelledby="lessons-title">
            <h2 id="lessons-title">Lessons and fixes</h2>
            <div className="journal-grid">
              <FieldBlock title="Lessons learned" body={project.lessonsLearned} />
              <FieldBlock title="Mistakes / problems" body={project.mistakesProblems} />
              <FieldBlock title="Fixes / solutions" body={project.fixesSolutions} />
              <FieldBlock title="Safety notes" body={project.safetyNotes} />
            </div>
          </section>
          <JournalSection title="Future tutorial notes" body={project.futureTutorialNotes} />
        </main>

        <aside className="side-panel">
          <section className="panel journal-section">
            <h2>Parts summary</h2>
            <p>{project.partsSummary}</p>
            {project.parts.length ? (
              <ul className="compact-list">
                {project.parts.map((part) => (
                  <li key={part.id}>
                    <span>{part.name}</span>
                    <strong>{part.quantity}x</strong>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
          <section className="panel journal-section">
            <h2>Attachments and images</h2>
            <p>Image and file metadata are modeled for project photos, step photos, schematics, PDFs, datasheets, and references.</p>
            <ul className="compact-list">
              <li><span>Stored files</span><strong>{project.files.length}</strong></li>
              <li><span>Image variants</span><strong>{project.images.length}</strong></li>
            </ul>
          </section>
          <section className="panel journal-section">
            <h2>Record dates</h2>
            <ul className="compact-list">
              <li><span>Created</span><strong>{formatShortDate(project.createdAt)}</strong></li>
              <li><span>Updated</span><strong>{formatShortDate(project.updatedAt)}</strong></li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

function JournalSection({ title, body }: { title: string; body: string }) {
  return (
    <section className="panel journal-section">
      <h2>{title}</h2>
      <p>{body}</p>
    </section>
  );
}

function FieldBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="field-block">
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

function StepCard({ step }: { step: ProjectDetailViewProps["project"]["steps"][number] }) {
  return (
    <article className="step-card">
      <div className="step-number">{step.stepNumber}</div>
      <div>
        <h3>{step.title}</h3>
        <p>{step.simpleExplanation}</p>
        <div className="journal-grid">
          <FieldBlock title="Parts / tools" body={step.partsToolsNeeded} />
          <FieldBlock title="What I did" body={step.whatIDid} />
          <FieldBlock title="What went wrong" body={step.whatWentWrong || "Nothing documented yet."} />
          <FieldBlock title="How I fixed it" body={step.howIFixedIt || "No fix documented yet."} />
          <FieldBlock title="Grandkid-friendly explanation" body={step.grandkidFriendlyExplanation} />
          <FieldBlock title="Tutorial notes" body={step.futureTutorialNotes || "Add filming notes when the step is stable."} />
          <FieldBlock title="Safety notes" body={step.safetyNotes || "No special safety note recorded."} />
        </div>
      </div>
    </article>
  );
}
