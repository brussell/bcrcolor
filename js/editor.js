// js/editor.js

// Map color picker inputs to CSS variable names
const mappings = {
  'input-primary':    '--color-primary',
  'input-secondary':  '--color-secondary',
  'input-accent':     '--color-accent',
  'input-background': '--color-background',
  'input-surface':    '--color-surface',
  'input-text':       '--color-text'
};

// Live update CSS variables on color picker change
Object.entries(mappings).forEach(([inputId, varName]) => {
  const input = document.getElementById(inputId);
  if (input) {
    input.addEventListener('input', () => {
      document.documentElement.style.setProperty(varName, input.value);
    });
  }
});

// Copy current theme CSS to clipboard
const exportBtn = document.getElementById('export-theme');
if (exportBtn) {
  exportBtn.addEventListener('click', () => {
    const cssLines = Object.values(mappings).map(varName => {
      const val = getComputedStyle(document.documentElement)
        .getPropertyValue(varName).trim();
      return `${varName}: ${val};`;
    });
    const cssText = `:root {\n  ${cssLines.join('\n  ')}\n}`;
    navigator.clipboard.writeText(cssText).then(() => {
      alert('Theme CSS copied to clipboard!');
    });
  });
}

// Reset to default theme values
const resetBtn = document.getElementById('reset-theme');
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    const defaultTheme = {
      '--color-primary':    '#2a9d8f',
      '--color-secondary':  '#264653',
      '--color-accent':     '#e76f51',
      '--color-background': '#f1f1f1',
      '--color-surface':    '#ffffff',
      '--color-text':       '#1a1a1a'
    };
    Object.entries(mappings).forEach(([inputId, varName]) => {
      const input = document.getElementById(inputId);
      if (input && defaultTheme[varName]) {
        input.value = defaultTheme[varName];
        document.documentElement.style.setProperty(varName, defaultTheme[varName]);
      }
    });
    setTheme('light');
  });
}

// Handle creating a new theme via inline input
function handleCreateTheme() {
  const input = document.getElementById('theme-name-input');
  if (!input) return;
  let name = input.value.trim().toLowerCase().replace(/\s+/g, '-');
  if (!name) {
    input.focus();
    return;
  }

  // Gather current CSS variable values
  const values = {};
  Object.entries(mappings).forEach(([inputId, varName]) => {
    values[varName] = getComputedStyle(document.documentElement)
      .getPropertyValue(varName).trim();
  });

  // Create and apply the new theme
  window.addTheme(name, values);
  setTheme(name);

  // Clear the name field
  input.value = '';
}

// Wire up the create-theme button on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('add-theme');
  if (addBtn) {
    addBtn.onclick = handleCreateTheme;
  }
});
