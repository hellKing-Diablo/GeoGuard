import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "./Navbar.css";

const Navbar = (): JSX.Element => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-gear">Gear</span>
        <span className="brand-guard">Guard</span>
      </div>

      <div className="navbar-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/equipment">Equipment</NavLink>
        <NavLink to="/maintenance">Maintenance</NavLink>
        <NavLink to="/calendar">Calendar</NavLink>
        <NavLink to="/reports">Reports</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </div>

      <ThemeToggle />
    </nav>
  );
};

export default Navbar;
