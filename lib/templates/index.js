import { baobabTemplate } from './baobab';
import { savannaTemplate } from './savanna';
import { ubuntuTemplate } from './ubuntu';
export const designTemplates = {
  baobab: baobabTemplate,
  savanna: savannaTemplate,
  ubuntu: ubuntuTemplate
};

export const getTemplate = (templateName) => {
  return designTemplates[templateName] || designTemplates.baobab;
};

export const getAllTemplates = () => {
  return Object.values(designTemplates);
};

export const applyTemplate = (template) => {
  const root = document.documentElement;
  
  // Apply template-specific CSS custom properties
  Object.entries(template.layout).forEach(([key, value]) => {
    root.style.setProperty(`--template-${key}`, value);
  });
  
  Object.entries(template.components).forEach(([key, value]) => {
    root.style.setProperty(`--template-component-${key}`, value);
  });
  
  // Update body classes for template-specific styling
  const body = document.body;
  const html = document.documentElement;
  
  // Remove existing template classes
  body.className = body.className.replace(/template-\w+/g, '').trim();
  html.className = html.className.replace(/template-\w+/g, '').trim();
  
  // Add new template class
  body.classList.add(`template-${template.name}`);
  html.classList.add(`template-${template.name}`);
  
  // Store template preference
  if (typeof window !== 'undefined') {
    localStorage.setItem('hadithi-template', template.name);
  }
};

// Initialize template on page load
export const initializeTemplate = () => {
  if (typeof window === 'undefined') return;
  
  const savedTemplate = localStorage.getItem('hadithi-template') || 'baobab';
  const template = getTemplate(savedTemplate);
  applyTemplate(template);
  
  return savedTemplate;
};