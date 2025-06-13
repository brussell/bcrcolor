const themeClassMap = {
  light: 'theme-light',
  dark: 'theme-dark',
  warm: 'theme-warm',
  cool: 'theme-cool',
  muted: 'theme-muted'
};

let currentTheme = 'light';
const buttonRefs = {}; // Store references to each button for styling

function setTheme(name) {
  // Remove all theme classes
  Object.values(themeClassMap).forEach(cls => {
    if (cls) document.body.classList.remove(cls);
  });

  // Apply new class
  const newClass = themeClassMap[name];
  if (newClass) {
    document.body.classList.add(newClass);
  }

  // Animate transition
  document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';

  // Save to localStorage
  localStorage.setItem('bcr-theme', name);
  currentTheme = name;

  // Highlight active button
  Object.keys(buttonRefs).forEach(theme => {
    buttonRefs[theme].style.outline = theme === name ? '2px solid #fff' : 'none';
  });
}

function createThemeButtons() {
  const target = document.getElementById('theme-buttons');
  if (!target) {
    console.warn('theme-buttons container not found');
    return;
  }

  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.gap = '0.5rem';

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

    buttonRefs[themeName] = btn;
    container.appendChild(btn);
  });

  // ✅ Insert the theme button group into the right HTML div
  target.appendChild(container);
}

function initTheme() {
  const savedTheme = localStorage.getItem('bcr-theme');
  const themeToApply = savedTheme && themeClassMap[savedTheme] ? savedTheme : 'light';
  setTheme(themeToApply);
}

// ✅ Run after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  createThemeButtons();
  initTheme();
});
