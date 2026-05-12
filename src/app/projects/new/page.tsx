import { NewProjectForm } from "@/components/projects/new-project-form";

export default function NewProjectPage() {
  return (
    <div className="page">
      <header className="page-header">
        <span className="eyebrow">Projects</span>
        <h1>Start a new project.</h1>
        <p className="lead">
          Give it a name and a quick description. You can fill in the full build journal after.
        </p>
      </header>
      <div className="form-container">
        <NewProjectForm />
      </div>
    </div>
  );
}
