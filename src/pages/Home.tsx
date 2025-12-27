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
          Modern maintenance management to track equipment, coordinate teams, 
          and eliminate operational blind spots—all in one platform.
        </p>
        <button className="cta-button">Get Started</button>
      </header>

      <section className="home-about">
        <h2>Why GearGuard?</h2>
        <p>
          Equipment downtime costs time and money. GearGuard centralizes asset data, 
          maintenance workflows, and technician accountability into a sleek, 
          easy-to-use operational system.
        </p>
      </section>

      <section className="home-features">
        <h2>Core Capabilities</h2>
        <div className="features-grid">
          {[
            { title: "Equipment Registry", desc: "Track machines, vehicles, and devices with ownership, location, warranty, and assigned maintenance teams." },
            { title: "Maintenance Workflow", desc: "Manage corrective and preventive maintenance with structured request lifecycles." },
            { title: "Kanban Board", desc: "Visualize work progress: New, In Progress, Repaired, and Scrap with drag-and-drop ease." },
            { title: "Calendar Scheduling", desc: "Plan preventive maintenance with clear date-based visibility for technicians." },
            { title: "Team-Based Assignment", desc: "Route requests to specialized teams and ensure only qualified technicians handle tasks." },
            { title: "Operational Insights", desc: "Analyze workload, bottlenecks, and asset reliability with structured metrics." }
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-footer-note">
        <p>
          Perfect for manufacturing, IT operations, logistics, and any organization where equipment uptime matters.
        </p>
      </section>
    </section>
  );
};

export default Home;
