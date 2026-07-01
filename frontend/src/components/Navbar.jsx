import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiShield, FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import { useTheme } from "./ThemeContext";
import "./Navbar.css";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/detect", label: "Detect Spam" },
    { to: "/about", label: "About" },
  ];

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-icon"><FiShield /></span>
          <span className="brand-text">SpamGuard</span>
        </NavLink>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? <FiMoon /> : <FiSun />}
          </button>
          <button className="menu-toggle" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  );
}
