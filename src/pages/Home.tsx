import "./Home.css";

const Home = (): JSX.Element => {
  return (
    <section className="home">
      <header className="home-hero">
        <h1 className="home-title">
          <span className="brand-gear">Gear</span>
          <span className="brand-guard">Guard</span>
        </h1>
        <p className="home-subtitle">
          A modern maintenance management platform built to track equipment,
          coordinate teams, and eliminate operational blind spots.
        </p>
      </header>

      <section className="home-about">
        <h2>Why GearGuard?</h2>
        <p>
          Equipment downtime is expensive. GearGuard centralizes asset data,
          maintenance workflows, and technician accountability into a single
          operational system designed for clarity and speed.
        </p>
      </section>

      <section className="home-features">
        <h2>Core Capabilities</h2>

        <div className="features-grid">
          <div className="feature-card">
            <h3>Equipment Registry</h3>
            <p>
              Track machines, vehicles, and devices with ownership, location,
              warranty, and assigned maintenance teams.
            </p>
          </div>

          <div className="feature-card">
            <h3>Maintenance Workflow</h3>
            <p>
              Manage corrective and preventive maintenance using structured
              request lifecycles and clear status transitions.
            </p>
          </div>

          <div className="feature-card">
            <h3>Kanban Board</h3>
            <p>
              Visualize work in progress with drag-and-drop stages: New,
              In Progress, Repaired, and Scrap.
            </p>
          </div>

          <div className="feature-card">
            <h3>Calendar Scheduling</h3>
            <p>
              Plan preventive maintenance with date-based visibility so
              technicians know exactly what’s coming.
            </p>
          </div>

          <div className="feature-card">
            <h3>Team-Based Assignment</h3>
            <p>
              Route requests to specialized teams and ensure only qualified
              technicians handle each task.
            </p>
          </div>

          <div className="feature-card">
            <h3>Operational Insights</h3>
            <p>
              Analyze workload, bottlenecks, and asset reliability through
              structured reports and metrics.
            </p>
          </div>
        </div>
      </section>

      <section className="home-footer-note">
        <p>
          Designed for manufacturing, IT operations, logistics, and any
          organization where equipment uptime matters.
        </p>
      </section>
    </section>
  );
};

export default Home;
