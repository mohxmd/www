const STORAGE_KEY = "theme-preference";
const DARK_THEME = "dark";
const LIGHT_THEME = "cool";

function getTheme() {
  return (
    localStorage.getItem(STORAGE_KEY) ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? DARK_THEME
      : LIGHT_THEME)
  );
}

function setTheme(theme) {
  localStorage.setItem(STORAGE_KEY, theme);
  document.documentElement.dataset.theme = theme;
}

function toggleTheme() {
  setTheme(getTheme() === DARK_THEME ? LIGHT_THEME : DARK_THEME);
}

function initThemeManager() {
  setTheme(getTheme());
  document
    .getElementById("toggle_theme")
    ?.addEventListener("click", toggleTheme);
}

initThemeManager();

document.addEventListener("astro:after-swap", initThemeManager);
