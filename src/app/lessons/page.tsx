export default function LessonsPage() {
  return (
    <div className="page">
      <header className="page-header">
        <span className="eyebrow">Lessons / Reference Library</span>
        <h1>Reusable lessons will become their own library.</h1>
        <p className="lead">For the first release, project journals carry the working notes while Lessons is prepared for mistakes, references, safety notes, and troubleshooting patterns.</p>
      </header>
      <section className="panel journal-section">
        <h2>Library shape</h2>
        <div className="journal-grid">
          <div className="field-block">
            <h3>Lesson types</h3>
            <p>Notes, mistakes, references, safety reminders, and troubleshooting writeups are represented in the schema.</p>
          </div>
          <div className="field-block">
            <h3>Reference links</h3>
            <p>External tutorials, datasheets, calculators, and articles can attach to projects or lessons without mixing concerns.</p>
          </div>
          <div className="field-block">
            <h3>Tags</h3>
            <p>Project tags are normalized now, and lesson tags are ready for quick filtering as the library grows.</p>
          </div>
          <div className="field-block">
            <h3>Tutorial notes</h3>
            <p>The app stores written guidance for future tutorials, while media upload and playback stay outside this product scope.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
