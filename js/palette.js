// js/palette.js

// 1) Built-in themes
window.themeClassMap = {
  light: 'theme-light',
  dark:  'theme-dark',
  warm:  'theme-warm',
  cool:  'theme-cool',
  muted: 'theme-muted'
};

// 2) Storage for user-created themes
window.customThemes = {}; 

window.currentTheme = 'light';
window.buttonRefs    = {}; // { themeName: <button> }


// Persist customThemes object to localStorage
function saveCustomThemes() {
  localStorage.setItem('bcr-custom-themes', JSON.stringify(window.customThemes));
}

// Load persisted custom themes (if any) on startup
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
      // Inject CSS rule
      const className = `theme-${name}`;
      const rules = Object.entries(values)
        .map(([k,v]) => `  ${k}: ${v};`)
        .join('\n');
      styleTag.sheet.insertRule(`.${className} {\n${rules}\n}`, styleTag.sheet.cssRules.length);

      // Register maps
      window.themeClassMap[name] = className;
      window.customThemes[name]  = values;
    });
  } catch(err) {
    console.error('Failed to load custom themes', err);
  }
}


// 3) Switch theme
function setTheme(name) {
  // remove all
  Object.values(window.themeClassMap).forEach(c => c && document.body.classList.remove(c));

  // add selected
  const cls = window.themeClassMap[name];
  if (cls) document.body.classList.add(cls);

  // smooth transition
  document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';

  // persist choice
  localStorage.setItem('bcr-theme', name);
  window.currentTheme = name;

  // highlight active button
  Object.keys(window.buttonRefs).forEach(t => {
    window.buttonRefs[t].style.outline = (t === name) ? '2px solid #fff' : 'none';
  });
}


// 4) Delete a custom theme
function deleteTheme(name) {
  if (!window.customThemes[name]) return;
  if (!confirm(`Delete theme "${name}"? This cannot be undone.`)) return;

  // 4a) remove its CSS rule
  const className = window.themeClassMap[name];
  const styleTag = document.getElementById('dynamic-themes');
  if (styleTag) {
    const rules = styleTag.sheet.cssRules;
    for (let i = 0; i < rules.length; i++) {
      if (rules[i].selectorText === `.${className}`) {
        styleTag.sheet.deleteRule(i);
        break;
      }
    }
  }

  // 4b) remove from maps
  delete window.themeClassMap[name];
  delete window.customThemes[name];
  saveCustomThemes();

  // 4c) remove the button wrapper
  const wrapper = window.buttonRefs[name].parentNode;
  wrapper.remove();
  delete window.buttonRefs[name];

  // 4d) if it was active, reset to light
  if (window.currentTheme === name) {
    setTheme('light');
  }
}


// 5) Build the theme-switcher buttons (including delete where appropriate)
function createThemeButtons() {
  const target = document.getElementById('theme-buttons');
  if (!target) return console.warn('theme-buttons container not found');

  const container = document.createElement('div');
  container.style.display  = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.gap      = '0.5rem';

  Object.keys(window.themeClassMap).forEach(themeName => {
    // wrapper to hold both the button and (maybe) the delete “×”
    const wrapper = document.createElement('div');
    wrapper.className = 'theme-btn-wrapper';

    // the switch button
    const btn = document.createElement('button');
    btn.textContent = themeName.charAt(0).toUpperCase() + themeName.slice(1);
    btn.onclick     = () => setTheme(themeName);
    Object.assign(btn.style, {
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      background: '#444',
      color: '#fff'
    });
    window.buttonRefs[themeName] = btn;
    wrapper.appendChild(btn);

    // only add delete control for user-created themes
    if (window.customThemes[themeName]) {
      const del = document.createElement('button');
      del.className = 'delete-btn';
      del.textContent = '×';
      del.onclick = (e) => { 
        e.stopPropagation();
        deleteTheme(themeName);
      };
      wrapper.appendChild(del);
    }

    container.appendChild(wrapper);
  });

  target.appendChild(container);
}


// 6) Create and persist a new theme at runtime
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
    .map(([k,v]) => `  ${k}: ${v};`)
    .join('\n');
  styleTag.sheet.insertRule(`.${className} {\n${rules}\n}`, styleTag.sheet.cssRules.length);

  // register and persist
  window.themeClassMap[name] = className;
  window.customThemes[name]  = values;
  saveCustomThemes();

  // append its button (with delete)
  createThemeButtons();     // you can also append just the new one, but this is simplest
  setTheme(name);
}

window.addTheme = addTheme;


// 7) Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadCustomThemes();
  createThemeButtons();
  const saved = localStorage.getItem('bcr-theme');
  setTheme(saved && window.themeClassMap[saved] ? saved : 'light');
});

function createThemeButtons() {
  const target = document.getElementById('theme-buttons');
  if (!target) {
    console.warn('theme-buttons container not found');
    return;
  }

  // 1) Remove any old buttons
  target.innerHTML = '';

  // 2) For each theme, build its wrapper
  Object.keys(window.themeClassMap).forEach(themeName => {
    // wrapper div
    const wrapper = document.createElement('div');
    wrapper.className = 'theme-btn-wrapper';

    // the main switch button
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
    wrapper.appendChild(btn);

    // delete “×” only for custom themes
    if (window.customThemes[themeName]) {
      const del = document.createElement('button');
      del.className   = 'delete-btn';
      del.textContent = '×';
      del.onclick = e => {
        e.stopPropagation();
        deleteTheme(themeName);
      };
      wrapper.appendChild(del);
    }

    // 3) Add this wrapper into the page
    target.appendChild(wrapper);
  });
}
