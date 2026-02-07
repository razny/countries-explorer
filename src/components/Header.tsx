import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const location = useLocation();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header>
      <div className="header-content">
        <h1>Where in the world?</h1>
        <nav className="header-nav">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Browse
          </Link>
          <Link
            to="/compare"
            className={location.pathname === "/compare" ? "active" : ""}>
            Compare
          </Link>
        </nav>
      </div>
      <button id="toggle-theme" onClick={toggleTheme}>
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>
    </header>
  );
}
