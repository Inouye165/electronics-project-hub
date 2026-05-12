"use client";

import { useActionState } from "react";

import { updateProjectAction, type EditProjectFormState } from "@/app/projects/[slug]/edit/actions";
import { difficultyLabels, statusLabels } from "@/lib/format";
import { projectDifficulties, projectStatuses } from "@/lib/validation/project-schemas";

export interface ProjectJournalFormProps {
  project: {
    id: string;
    slug: string;
    title: string;
    shortDescription: string;
    status: (typeof projectStatuses)[number];
    difficulty: (typeof projectDifficulties)[number];
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
  };
}

const initialState: EditProjectFormState = {};

const PLACEHOLDER = "—";

function isPlaceholder(value: string) {
  return value.trim() === PLACEHOLDER;
}

function fieldValue(value: string) {
  return isPlaceholder(value) ? "" : value;
}

export function ProjectJournalForm({ project }: ProjectJournalFormProps) {
  const [state, action, pending] = useActionState(updateProjectAction, initialState);

  return (
    <form action={action} className="new-project-form">
      {/* Hidden fields for server action */}
      <input type="hidden" name="id" value={project.id} />
      <input type="hidden" name="originalSlug" value={project.slug} />

      {state.message ? (
        <div className="error-state" role="alert">
          <p>{state.message}</p>
        </div>
      ) : null}

      {/* ── Basic info ─────────────────────────────────────── */}
      <section className="panel journal-section">
        <h2>Basic info</h2>
        <div className="stack">
          <div className="form-field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={project.title}
            />
            {state.errors?.title ? <span className="field-error">{state.errors.title}</span> : null}
          </div>

          <div className="form-field">
            <label htmlFor="slug">
              Slug <span className="muted">(URL identifier — lowercase, hyphens only)</span>
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              defaultValue={project.slug}
            />
            {state.errors?.slug ? <span className="field-error">{state.errors.slug}</span> : null}
          </div>

          <div className="form-field">
            <label htmlFor="shortDescription">Short description</label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              rows={3}
              required
              defaultValue={project.shortDescription}
            />
            {state.errors?.shortDescription ? (
              <span className="field-error">{state.errors.shortDescription}</span>
            ) : null}
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={project.status}>
                {projectStatuses.map((s) => (
                  <option key={s} value={s}>
                    {statusLabels[s]}
                  </option>
                ))}
              </select>
              {state.errors?.status ? (
                <span className="field-error">{state.errors.status}</span>
              ) : null}
            </div>

            <div className="form-field">
              <label htmlFor="difficulty">Difficulty</label>
              <select id="difficulty" name="difficulty" defaultValue={project.difficulty}>
                {projectDifficulties.map((d) => (
                  <option key={d} value={d}>
                    {difficultyLabels[d]}
                  </option>
                ))}
              </select>
              {state.errors?.difficulty ? (
                <span className="field-error">{state.errors.difficulty}</span>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* ── Purpose ────────────────────────────────────────── */}
      <section className="panel journal-section">
        <h2>Purpose</h2>
        <div className="stack">
          <JournalTextarea
            id="projectGoal"
            label="Project goal"
            hint="What were you trying to build or achieve?"
            defaultValue={fieldValue(project.projectGoal)}
            error={state.errors?.projectGoal}
          />
          <JournalTextarea
            id="whyBuilt"
            label="Why I built it"
            hint="What motivated you to start this project?"
            defaultValue={fieldValue(project.whyBuilt)}
            error={state.errors?.whyBuilt}
          />
          <JournalTextarea
            id="problemSolved"
            label="Problem it solves"
            hint="What problem or need does this address?"
            defaultValue={fieldValue(project.problemSolved)}
            error={state.errors?.problemSolved}
          />
          <JournalTextarea
            id="nextSteps"
            label="Next steps"
            hint="What would you do next, or what needs finishing?"
            defaultValue={fieldValue(project.nextSteps)}
            error={state.errors?.nextSteps}
          />
        </div>
      </section>

      {/* ── Story ──────────────────────────────────────────── */}
      <section className="panel journal-section">
        <h2>The story</h2>
        <JournalTextarea
          id="projectStory"
          label="Project story"
          hint="Walk through the build from start to finish in your own words."
          defaultValue={fieldValue(project.projectStory)}
          error={state.errors?.projectStory}
          rows={10}
        />
      </section>

      {/* ── Parts ──────────────────────────────────────────── */}
      <section className="panel journal-section">
        <h2>Parts summary</h2>
        <JournalTextarea
          id="partsSummary"
          label="Parts and materials"
          hint="List the main components, modules, and materials used."
          defaultValue={fieldValue(project.partsSummary)}
          error={state.errors?.partsSummary}
          rows={5}
        />
      </section>

      {/* ── Lessons ────────────────────────────────────────── */}
      <section className="panel journal-section">
        <h2>Lessons and fixes</h2>
        <div className="stack">
          <JournalTextarea
            id="lessonsLearned"
            label="Lessons learned"
            hint="What did you learn from building this?"
            defaultValue={fieldValue(project.lessonsLearned)}
            error={state.errors?.lessonsLearned}
          />
          <JournalTextarea
            id="mistakesProblems"
            label="Mistakes / problems"
            hint="What went wrong along the way?"
            defaultValue={fieldValue(project.mistakesProblems)}
            error={state.errors?.mistakesProblems}
          />
          <JournalTextarea
            id="fixesSolutions"
            label="Fixes / solutions"
            hint="How did you solve the problems you ran into?"
            defaultValue={fieldValue(project.fixesSolutions)}
            error={state.errors?.fixesSolutions}
          />
          <JournalTextarea
            id="safetyNotes"
            label="Safety notes"
            hint="Any electrical or physical safety considerations?"
            defaultValue={fieldValue(project.safetyNotes)}
            error={state.errors?.safetyNotes}
          />
        </div>
      </section>

      {/* ── Future notes ───────────────────────────────────── */}
      <section className="panel journal-section">
        <h2>Future tutorial notes</h2>
        <JournalTextarea
          id="futureTutorialNotes"
          label="Tutorial notes"
          hint="Notes for if you ever write a tutorial or guide about this project."
          defaultValue={fieldValue(project.futureTutorialNotes)}
          error={state.errors?.futureTutorialNotes}
          rows={6}
        />
      </section>

      <div className="button-row">
        <button type="submit" className="button primary" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </button>
        <a href={`/projects/${project.slug}`} className="button secondary">
          Cancel
        </a>
      </div>
    </form>
  );
}

interface JournalTextareaProps {
  id: string;
  label: string;
  hint: string;
  defaultValue: string;
  error?: string;
  rows?: number;
}

function JournalTextarea({ id, label, hint, defaultValue, error, rows = 5 }: JournalTextareaProps) {
  return (
    <div className="form-field">
      <label htmlFor={id}>
        {label} <span className="muted">{hint}</span>
      </label>
      <textarea id={id} name={id} rows={rows} required defaultValue={defaultValue} />
      {error ? <span className="field-error">{error}</span> : null}
    </div>
  );
}
