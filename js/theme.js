const button = document.getElementById("toggle-theme");

// check local storage for existing theme
let currentThemeSetting = localStorage.getItem("theme") || "light";

// apply initial theme
if (currentThemeSetting === "dark") {
  document.body.classList.add("dark");
  button.innerText = "Light Mode";
} else {
  document.body.classList.remove("dark");
  button.innerText = "Dark Mode";
}

button.addEventListener("click", () => {
  if (currentThemeSetting === "dark") {
    currentThemeSetting = "light";
    document.body.classList.remove("dark");
    button.innerText = "Dark Mode";
  } else {
    currentThemeSetting = "dark";
    document.body.classList.add("dark");
    button.innerText = "Light Mode";
  }

  // save to local storage
  localStorage.setItem("theme", currentThemeSetting);
});
