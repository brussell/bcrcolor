// Define available themes and their matching CSS classes
const themes = ['light', 'dark'];
let currentThemeIndex = 0;

// Map themes to body class names
const themeClassMap = {
  light: '',
  dark: 'theme-dark'
};

// Create a button to toggle themes
const toggleBtn = document.createElement('button');
toggleBtn.textContent = 'Toggle Theme';
toggleBtn.style.position = 'fixed';
toggleBtn.style.top = '1rem';
toggleBtn.style.right = '1rem';
toggleBtn.style.padding = '0.5rem 1rem';
toggleBtn.style.zIndex = '1000';
toggleBtn.style.background = '#444';
toggleBtn.style.color = '#fff';
toggleBtn.style.border = 'none';
toggleBtn.style.borderRadius = '4px';
toggleBtn.style.cursor = 'pointer';

document.body.appendChild(toggleBtn);

// Function to switch themes
function toggleTheme() {
  const current = themes[currentThemeIndex];
  const nextIndex = (currentThemeIndex + 1) % themes.length;
  const next = themes[nextIndex];

  // Remove current class
  if (themeClassMap[current]) {
    document.body.classList.remove(themeClassMap[current]);
  }

  // Add next class
  if (themeClassMap[next]) {
    document.body.classList.add(themeClassMap[next]);
  }

  currentThemeIndex = nextIndex;
}

toggleBtn.addEventListener('click', toggleTheme);
