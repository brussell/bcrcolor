// Map inputs to CSS vars
const mappings = {
  'input-primary': '--color-primary',
  'input-secondary': '--color-secondary',
  'input-accent': '--color-accent',
  'input-background': '--color-background',
  'input-surface': '--color-surface',
  'input-text': '--color-text'
};

// Update CSS var on input change
Object.entries(mappings).forEach(([inputId, varName]) => {
  const input = document.getElementById(inputId);
  input.addEventListener('input', () => {
    document.documentElement.style.setProperty(varName, input.value);
  });
});

// Export CSS to clipboard
document.getElementById('export-theme').addEventListener('click', () => {
  const cssLines = Object.values(mappings).map(varName => {
    const val = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return `${varName}: ${val};`;
  });
  const cssText = `:root {\n  ${cssLines.join('\n  ')}\n}`;
  navigator.clipboard.writeText(cssText).then(() => {
    alert('Theme CSS copied to clipboard!');
  });
});

// js/editor.js

// ... your existing color-picker mapping and export code ...

// Add a “Create Theme” button handler
document.getElementById('add-theme').addEventListener('click', () => {
  let name = prompt('Name your new theme (no spaces):');
  if (!name) return;
  name = name.trim().toLowerCase().replace(/\s+/g, '-');

  // gather current values
  const values = {};
  Object.entries(mappings).forEach(([inputId, varName]) => {
    values[varName] = getComputedStyle(document.documentElement)
      .getPropertyValue(varName).trim();
  });

  // create the theme and switch to it
  window.addTheme(name, values);
  setTheme(name);
});

document.getElementById('add-theme').addEventListener('click', () => {
  let name = prompt('Name your new theme (no spaces):');
  if (!name) return;
  name = name.trim().toLowerCase().replace(/\s+/g, '-');

  const values = {};
  Object.entries(mappings).forEach(([inputId, varName]) => {
    values[varName] = getComputedStyle(document.documentElement)
      .getPropertyValue(varName).trim();
  });

  window.addTheme(name, values);
  setTheme(name);
});

// Reset editor pickers and page back to the default (light) theme
document.getElementById('reset-theme').addEventListener('click', () => {
  // Define the default light-theme variable values
  const defaultTheme = {
    '--color-primary':    '#2a9d8f',
    '--color-secondary':  '#264653',
    '--color-accent':     '#e76f51',
    '--color-background': '#f1f1f1',
    '--color-surface':    '#ffffff',
    '--color-text':       '#1a1a1a'
  };

  // Reset each color picker and update the CSS variable
  Object.entries(mappings).forEach(([inputId, varName]) => {
    const input = document.getElementById(inputId);
    if (input && defaultTheme[varName]) {
      input.value = defaultTheme[varName];
      document.documentElement.style.setProperty(varName, defaultTheme[varName]);
    }
  });

  // Switch the theme class back to light
  setTheme('light');
});

function handleCreateTheme() {
  let name = prompt('Name your new theme (no spaces):');
  if (!name) return;
  name = name.trim().toLowerCase().replace(/\s+/g, '-');

  const values = {};
  Object.entries(mappings).forEach(([inputId, varName]) => {
    values[varName] = getComputedStyle(document.documentElement)
      .getPropertyValue(varName).trim();
  });

  window.addTheme(name, values);
  setTheme(name);
}

// ensure only one handler, after the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('add-theme');
  addBtn.onclick = handleCreateTheme;
});
document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('add-theme');
  // Remove any existing listener just in case
  addBtn.removeEventListener('click', handleCreateTheme);
  addBtn.addEventListener('click', handleCreateTheme);
});