// js/palette.js

// 1) Core and built-in themes:
window.themeClassMap = {
  light: 'theme-light',
  dark:  'theme-dark',
  warm:  'theme-warm',
  cool:  'theme-cool',
  muted: 'theme-muted'
};

// Will hold only the user-created themes
window.customThemes = {};

window.currentTheme = 'light';
window.buttonRefs    = {};

// ---- Remove/apply theme logic stays the same ----
function setTheme(name) {
  Object.values(window.themeClassMap).forEach(c => c && document.body.classList.remove(c));
  const cls = window.themeClassMap[name];
  if (cls) document.body.classList.add(cls);
  document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  localStorage.setItem('bcr-theme', name);
  window.currentTheme = name;
  // highlight active
  Object.keys(window.buttonRefs).forEach(t => {
    window.buttonRefs[t].style.outline = (t === name) ? '2px solid #fff' : 'none';
  });
}

// ---- Create all buttons based on themeClassMap ----
function createThemeButtons() {
  const target = document.getElementById('theme-buttons');
  if (!target) return console.warn('theme-buttons container not found');
  const container = document.createElement('div');
  container.style.display  = 'flex';
  container.style.gap      = '0.5rem';
  container.style.flexWrap = 'wrap';

  Object.keys(window.themeClassMap).forEach(themeName => {
    const btn = document.createElement('button');
    btn.textContent = themeName.charAt(0).toUpperCase() + themeName.slice(1);
    btn.onclick = () => setTheme(themeName);
    Object.assign(btn.style, {
      padding: '0.5rem 1rem', border: 'none',
      borderRadius: '4px', cursor: 'pointer',
      background: '#444', color: '#fff'
    });
    window.buttonRefs[themeName] = btn;
    container.appendChild(btn);
  });

  target.appendChild(container);
}

// ---- Initialize theme on load ----
function initTheme() {
  const saved = localStorage.getItem('bcr-theme');
  const toApply = (saved && window.themeClassMap[saved]) ? saved : 'light';
  setTheme(toApply);
}

// ---- Persist customThemes to localStorage ----
function saveCustomThemes() {
  localStorage.setItem('bcr-custom-themes', JSON.stringify(window.customThemes));
}

// ---- On load, read stored custom themes and register them ----
function loadCustomThemes() {
  const data = localStorage.getItem('bcr-custom-themes');
  if (!data) return;
  try {
    const themes = JSON.parse(data);
    let styleTag = document.getElementById('dynamic-themes');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'dynamic-themes';
      document.head.appendChild(styleTag);
    }
    Object.entries(themes).forEach(([name, values]) => {
      const className = `theme-${name}`;
      // inject CSS rule
      const rules = Object.entries(values)
        .map(([k,v]) => `  ${k}: ${v};`).join('\n');
      styleTag.sheet.insertRule(`.${className} {\n${rules}\n}`, styleTag.sheet.cssRules.length);
      // register in maps
      window.themeClassMap[name]   = className;
      window.customThemes[name]    = values;
    });
  } catch(err) {
    console.error('Failed to load custom themes', err);
  }
}

/**
 * Call this to create a new theme at runtime:
 *  - injects CSS
 *  - registers in maps
 *  - persists to localStorage
 *  - appends a button
 */
function addTheme(name, values) {
  const className = `theme-${name}`;
  // inject CSS
  let styleTag = document.getElementById('dynamic-themes');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'dynamic-themes';
    document.head.appendChild(styleTag);
  }
  const rules = Object.entries(values)
    .map(([k,v]) => `  ${k}: ${v};`).join('\n');
  styleTag.sheet.insertRule(`.${className} {\n${rules}\n}`, styleTag.sheet.cssRules.length);

  // register
  window.themeClassMap[name]    = className;
  window.customThemes[name]     = values;
  saveCustomThemes();

  // append button
  const target = document.getElementById('theme-buttons');
  const btn = document.createElement('button');
  btn.textContent = name.charAt(0).toUpperCase() + name.slice(1);
  btn.onclick = () => setTheme(name);
  Object.assign(btn.style, {
    padding: '0.5rem 1rem', border: 'none',
    borderRadius: '4px', cursor: 'pointer',
    background: '#444', color: '#fff'
  });
  window.buttonRefs[name] = btn;
  target.appendChild(btn);
}

// expose
window.addTheme = addTheme;

// on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  loadCustomThemes();
  createThemeButtons();
  initTheme();
});
