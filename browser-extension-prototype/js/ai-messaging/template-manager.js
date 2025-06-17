// template-manager.js
// Handles template CRUD, selection, and fallback logic

class TemplateManager {
  constructor() {
    this.templates = {};
    // ...load templates from storage or defaults...
  }

  getTemplate(name) {
    return this.templates[name] || '';
  }

  setTemplate(name, content) {
    this.templates[name] = content;
  }

  selectTemplate(analysis) {
    // Example selection logic based on analysis (mirrors old selectOptimalTemplate)
    if (analysis.technicalLevel === 'high' && analysis.quality === 'High') {
      return this.getTemplate('technical');
    }
    if (analysis.problemAreas && analysis.problemAreas.length > 0) {
      return this.getTemplate('problem_solver');
    }
    if (analysis.engagementStyle === 'detailed') {
      return this.getTemplate('community');
    }
    if (analysis.engagementStyle === 'brief') {
      return this.getTemplate('brief');
    }
    return this.getTemplate('community');
  }

  getAllTemplates() {
    return this.templates;
  }
}

// Export for use in ai-messaging.js
window.TemplateManager = TemplateManager;
