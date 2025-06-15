// js/palette.js

// Exposed theme map
window.themeClassMap = {
  light: 'theme-light',
  dark:  'theme-dark',
  warm:  'theme-warm',
  cool:  'theme-cool',
  muted: 'theme-muted'
};

window.currentTheme = 'light';
window.buttonRefs    = {}; // store button elements by theme name

function setTheme(name) {
  // remove all theme classes
  Object.values(window.themeClassMap).forEach(cls => {
    if (cls) document.body.classList.remove(cls);
  });

  // apply the new one
  const newClass = window.themeClassMap[name];
  if (newClass) document.body.classList.add(newClass);

  // smooth transition
  document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';

  // persist
  localStorage.setItem('bcr-theme', name);
  window.currentTheme = name;

  // highlight active button
  Object.keys(window.buttonRefs).forEach(theme => {
    window.buttonRefs[theme].style.outline =
      theme === name ? '2px solid #fff' : 'none';
  });
}

function createThemeButtons() {
  const target = document.getElementById('theme-buttons');
  if (!target) {
    console.warn('theme-buttons container not found');
    return;
  }

  const container = document.createElement('div');
  container.style.display    = 'flex';
  container.style.flexWrap   = 'wrap';
  container.style.gap        = '0.5rem';

  Object.keys(window.themeClassMap).forEach(themeName => {
    const btn = document.createElement('button');
    btn.textContent = themeName.charAt(0).toUpperCase() + themeName.slice(1);
    btn.onclick     = () => setTheme(themeName);

    Object.assign(btn.style, {
      padding:      '0.5rem 1rem',
      border:       'none',
      borderRadius: '4px',
      cursor:       'pointer',
      background:   '#444',
      color:        '#fff'
    });

    window.buttonRefs[themeName] = btn;
    container.appendChild(btn);
  });

  target.appendChild(container);
}

function initTheme() {
  const saved = localStorage.getItem('bcr-theme');
  const toApply = saved && window.themeClassMap[saved] ? saved : 'light';
  setTheme(toApply);
}

/**
 * Dynamically add a new theme at runtime.
 * name:   slug (e.g. "mytheme")
 * values: object of CSS var → hex, e.g. { '--color-primary': '#123456', … }
 */
function addTheme(name, values) {
  const className = `theme-${name}`;

  // inject or find <style id="dynamic-themes">
  let styleTag = document.getElementById('dynamic-themes');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'dynamic-themes';
    document.head.appendChild(styleTag);
  }

  // build and insert the CSS rule
  const rules = Object.entries(values)
    .map(([varName, val]) => `  ${varName}: ${val};`)
    .join('\n');
  styleTag.sheet.insertRule(
    `.${className} {\n${rules}\n}`,
    styleTag.sheet.cssRules.length
  );

  // register and create its button
  window.themeClassMap[name] = className;
  const target = document.getElementById('theme-buttons');
  const btn = document.createElement('button');
  btn.textContent = name.charAt(0).toUpperCase() + name.slice(1);
  btn.onclick     = () => setTheme(name);

  Object.assign(btn.style, {
    padding:      '0.5rem 1rem',
    border:       'none',
    borderRadius: '4px',
    cursor:       'pointer',
    background:   '#444',
    color:        '#fff'
  });

  window.buttonRefs[name] = btn;
  target.appendChild(btn);
}

// expose globally
window.addTheme = addTheme;

// init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  createThemeButtons();
  initTheme();
});
