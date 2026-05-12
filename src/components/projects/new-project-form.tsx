"use client";

import { useActionState } from "react";

import { createProjectAction, type NewProjectFormState } from "@/app/projects/new/actions";
import { projectStatuses, projectDifficulties } from "@/lib/validation/project-schemas";
import { statusLabels, difficultyLabels } from "@/lib/format";

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const initialState: NewProjectFormState = {};

export function NewProjectForm() {
  const [state, action, pending] = useActionState(createProjectAction, initialState);

  return (
    <form action={action} className="new-project-form">
      {state.message ? (
        <div className="error-state" role="alert">
          <p>{state.message}</p>
        </div>
      ) : null}

      <div className="form-field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="e.g. Bench Power Supply"
          onChange={(e) => {
            const slugInput = document.getElementById("slug") as HTMLInputElement | null;
            if (slugInput && !slugInput.dataset.edited) {
              slugInput.value = toSlug(e.target.value);
            }
          }}
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
          placeholder="e.g. bench-power-supply"
          onInput={(e) => {
            (e.target as HTMLInputElement).dataset.edited = "1";
          }}
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
          placeholder="One or two sentences about what this project is and why you built it."
        />
        {state.errors?.shortDescription ? (
          <span className="field-error">{state.errors.shortDescription}</span>
        ) : null}
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue="idea">
            {projectStatuses.map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
          {state.errors?.status ? <span className="field-error">{state.errors.status}</span> : null}
        </div>

        <div className="form-field">
          <label htmlFor="difficulty">Difficulty</label>
          <select id="difficulty" name="difficulty" defaultValue="beginner">
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

      <div className="button-row">
        <button type="submit" className="button primary" disabled={pending}>
          {pending ? "Creating…" : "Create project"}
        </button>
        <a href="/projects" className="button secondary">
          Cancel
        </a>
      </div>
    </form>
  );
}
