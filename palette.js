// Map theme names to CSS class names
const themeClassMap = {
  light: 'theme-light',
  dark: 'theme-dark',
  warm: 'theme-warm',
  cool: 'theme-cool',
  muted: 'theme-muted'
};

// Track the current theme
let currentTheme = 'light';

// Set a new theme by name
function setTheme(name) {
  // Remove all known theme classes from <body>
  Object.values(themeClassMap).forEach(cls => {
    if (cls) document.body.classList.remove(cls);
  });

  // Add the new theme class (if defined)
  const newClass = themeClassMap[name];
  if (newClass) {
    document.body.classList.add(newClass);
  }

  currentTheme = name;
}

// Create a floating theme switcher UI
function createThemeButtons() {
  const container = document.createElement('div');
  container.id = 'theme-buttons';
  container.style.position = 'fixed';
  container.style.top = '1rem';
  container.style.left = '1rem';
  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.gap = '0.5rem';
  container.style.zIndex = '1000';

  Object.keys(themeClassMap).forEach(themeName => {
    const btn = document.createElement('button');
    btn.textContent = themeName.charAt(0).toUpperCase() + themeName.slice(1);
    btn.onclick = () => setTheme(themeName);
    btn.style.padding = '0.5rem 1rem';
    btn.style.border = 'none';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
    btn.style.background = '#444';
    btn.style.color = '#fff';
    container.appendChild(btn);
  });

  document.body.appendChild(container);
}

// Run on page load
createThemeButtons();
