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