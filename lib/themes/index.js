import { lightTheme } from './light';
import { darkTheme } from './dark';
import { africanTheme } from './african';

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  african: africanTheme
};

export const getTheme = (themeName) => {
  return themes[themeName] || themes.light;
};

export const getAllThemes = () => {
  return Object.values(themes);
};

export const applyTheme = (theme) => {
  const root = document.documentElement;
  
  // Apply CSS custom properties
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  
  Object.entries(theme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value);
  });
  
  Object.entries(theme.gradients).forEach(([key, value]) => {
    root.style.setProperty(`--gradient-${key}`, value);
  });
  
  // Update html and body classes for theme-specific styling
  const html = document.documentElement;
  const body = document.body;
  
  // Remove existing theme classes
  html.className = html.className.replace(/theme-\w+/g, '').trim();
  body.className = body.className.replace(/theme-\w+/g, '').trim();
  
  // Add new theme classes
  html.classList.add(`theme-${theme.name}`);
  body.classList.add(`theme-${theme.name}`);
  
  // Store theme preference
  if (typeof window !== 'undefined') {
    localStorage.setItem('hadithi-theme', theme.name);
  }
};

// Initialize theme on page load
export const initializeTheme = () => {
  if (typeof window === 'undefined') return;
  
  const savedTheme = localStorage.getItem('hadithi-theme') || 'light';
  const theme = getTheme(savedTheme);
  applyTheme(theme);
  
  return savedTheme;
};