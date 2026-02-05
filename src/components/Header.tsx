import { useEffect, useState } from "react";

export default function Header() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

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
      <h1>Where in the world?</h1>
      <button id="toggle-theme" onClick={toggleTheme}>
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>
    </header>
  );
}
