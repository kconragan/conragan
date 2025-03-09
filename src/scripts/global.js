if (process.env.NODE_ENV === 'development') {
  console.log('deleting local storage for dev server');
  localStorage.clear();
}

document.addEventListener('DOMContentLoaded', () => {
  const themeSwitcher = document.getElementById('theme-controller'); // parent container
  const themeToggle = document.getElementById('theme-toggle'); // toggle button
  const themeOptions = themeSwitcher.querySelector('.theme-options');
  const lightRadio = document.getElementById('theme-light');
  const darkRadio = document.getElementById('theme-dark');
  const autoRadio = document.getElementById('theme-system');

  function setTheme(theme) {
    if (theme === 'auto') {
      delete document.documentElement.dataset.colorScheme;
      autoRadio.checked = true;
    } else {
      document.documentElement.dataset.colorScheme = theme;
      localStorage.setItem('theme', theme);
      if (theme === 'dark') {
        darkRadio.checked = true;
      } else {
        lightRadio.checked = true;
      }
    }
    themeToggle.classList.remove('light', 'dark');
    themeToggle.classList.add(theme);
    themeToggle.setAttribute('aria-pressed', theme === 'dark');
  }

  // Toggle theme on button click
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.dataset.colorScheme || 'auto';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  // Get the user's preferred color scheme
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  // Check the user's preference and set the initial theme accordingly
  if (prefersDarkScheme.matches) {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  // Initial theme setup from localStorage (overrides system preference)
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  }
});
