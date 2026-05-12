export default function InventoryPage() {
  return (
    <div className="page">
      <header className="page-header">
        <span className="eyebrow">Inventory</span>
        <h1>Parts tracking is planned into the database now.</h1>
        <p className="lead">The MVP keeps Inventory secondary while the schema is ready for quantities, locations, datasheets, part images, and project usage.</p>
      </header>
      <section className="panel journal-section">
        <h2>Future-ready inventory structure</h2>
        <div className="journal-grid">
          <div className="field-block">
            <h3>Part records</h3>
            <p>Name, category, manufacturer, part number, quantity, storage location, status, and notes are modeled.</p>
          </div>
          <div className="field-block">
            <h3>Project usage</h3>
            <p>Projects can link to parts through ProjectPart so build records can later show what was consumed.</p>
          </div>
          <div className="field-block">
            <h3>Files and images</h3>
            <p>Datasheets and part images are planned through the same storage and metadata boundary as project files.</p>
          </div>
          <div className="field-block">
            <h3>Reorder workflow</h3>
            <p>Status values already account for available, reserved, used, needs reorder, and retired parts.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
