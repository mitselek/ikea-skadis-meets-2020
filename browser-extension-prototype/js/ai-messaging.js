// 🤖 AI-POWERED MESSAGE COMPOSITION MODULE
// Generates personalized promotional messages based on prospect data

// Refactored: Use MessagePersonalizer for analysis and personalization
class AIMessagingManager {
  constructor() {
    // Initialize Real AI Assistant with error handling
    try {
      this.realAI = window.RealAIAssistant ? new window.RealAIAssistant() : null;
      if (this.realAI) {
        console.log('✅ Real AI Assistant initialized in AIMessagingManager');
      } else {
        console.log('⚠️ RealAIAssistant not available - using template system only');
      }
    } catch (error) {
      console.error('❌ Error initializing Real AI Assistant:', error);
      this.realAI = null;
    }
    
    // 🎯 SYSTEM PROMPT CONFIGURATION
    this.systemPrompt = {
      enabled: true,
      content: `You are a friendly and professional maker reaching out to fellow 3D printing enthusiasts about your SKÅDIS hook project. Be genuine, helpful, and focus on the technical benefits that solve real workshop organization problems. Keep messages conversational but informative, and always end with a call-to-action that invites feedback or questions.

Key principles:
- Personalize based on their specific comment or project
- Highlight technical innovations (two-slot mounting, stability improvements) 
- Mention practical benefits (cable management, precision tool mounting)
- Include complete project documentation as a value-add
- Sound like a peer, not a salesperson
- Keep it under 150 words unless they showed high technical engagement

Template context: `
    };
    
    this.messageTemplates = {
      technical: {
        name: 'Technical Focus',
        template: `Hi {name},

I came across your {comment_reference} on {project} and noticed you're quite technical with SKÅDIS systems. As a fellow maker working with precision engineering, I thought you might find my latest hook design interesting.

{technical_details}

{personalized_benefits}

The project includes complete documentation with assembly photos and print settings:
https://makerworld.com/en/models/1503225-simple-skadis-hook#profileId-1572818

{call_to_action}

Best,
Mihkel`
      },
      
      problem_solver: {
        name: 'Problem-Solution Focus',
        template: `Hi {name},

Saw your comment on {project} - {comment_insight}! 

I've been frustrated with similar issues and designed a solution that might interest you. {problem_solution}

{specific_benefits}

Here's the project if you'd like to check it out:
https://makerworld.com/en/models/1503225-simple-skadis-hook#profileId-1572818

{personalized_question}

Cheers,
Mihkel`
      },
      
      community: {
        name: 'Community & Collaboration',
        template: `Hi {name},

Great to meet another SKÅDIS enthusiast! I noticed your {engagement_type} on {project} and thought you might appreciate some new hook designs I've been working on.

{community_connection}

{project_highlights}

Would love to hear your thoughts and any feedback you might have:
https://makerworld.com/en/models/1503225-simple-skadis-hook#profileId-1572818

{collaboration_invite}

Best,
Mihkel`
      },
      
      brief: {
        name: 'Brief & Direct',
        template: `Hi {name},

Saw your comment on {project} - thought you might like these enhanced SKÅDIS hooks I designed.

{key_benefit}

Quick link: https://makerworld.com/en/models/1503225-simple-skadis-hook#profileId-1572818

{simple_question}

Thanks!
Mihkel`
      }
    };

    this.benefitLibrary = {
      stability: [
        "Two-slot mounting system eliminates hook wobble and rotation",
        "40mm standard spacing ensures perfect alignment with SKÅDIS boards", 
        "Superior stability compared to single-slot designs"
      ],
      variety: [
        "Four different hook variants (U, U-o, H, H-o) for various applications",
        "Closed-loop options prevent items from sliding off",
        "Open designs for easy item access"
      ],
      documentation: [
        "Complete assembly documentation with step-by-step photos",
        "Detailed print settings and material recommendations",
        "Professional-grade documentation for reliable results"
      ],
      cable_management: [
        "Center holes in H-variants for zip-ties and wire routing",
        "Cable-friendly designs for workshop organization",
        "Integrated cable management features"
      ],
      practical: [
        "Tested in real workshop environments",
        "Optimized for common 3D printer capabilities",
        "Ready-to-print STL files included"
      ]
    };
  }

  // 🧠 AI-POWERED MESSAGE GENERATION (Enhanced with Real AI)
  async generatePersonalizedMessage(prospect) {
    try {
      // Use MessagePersonalizer for analysis and personalization
      const analysis = window.MessagePersonalizer.analyzeProspect(prospect);
      // Use TemplateManager for template selection
      if (!this.templateManager) {
        this.templateManager = new window.TemplateManager();
        // Load templates from old messageTemplates for now
        this.templateManager.setTemplate('technical', this.messageTemplates.technical.template);
        this.templateManager.setTemplate('problem_solver', this.messageTemplates.problem_solver.template);
        this.templateManager.setTemplate('community', this.messageTemplates.community.template);
        this.templateManager.setTemplate('brief', this.messageTemplates.brief.template);
      }
      const templateStr = this.templateManager.selectTemplate(analysis);
      const personalizations = window.MessagePersonalizer.generatePersonalizations(prospect, analysis, this.benefitLibrary);
      // Generate template message with system prompt
      let templateMessage = this.applySystemPrompt(templateStr);
      Object.entries(personalizations).forEach(([key, value]) => {
        const placeholder = `{${key}}`;
        templateMessage = templateMessage.replace(new RegExp(placeholder, 'g'), value);
      });
      templateMessage = this.cleanupMessage(templateMessage);

      // 🚀 TRY REAL AI SYNTHESIS
      if (this.realAI) {
        // Use system prompt for enhanced AI context
        const systemPromptedTemplate = this.getSystemPromptedTemplate(template.template, prospect, analysis);
        
        const realAIResult = await this.realAI.synthesizePersonalizedMessage(
          prospect.text,
          systemPromptedTemplate,
          prospect
        );

        if (realAIResult) {
          console.log('✨ Real AI synthesized message with system prompt for:', prospect.username);
          return realAIResult;
        }
      } else {
        console.log('🔄 Real AI not available - using template system');
      }

      // 🔄 FALLBACK TO TEMPLATE SYSTEM
      console.log('🤖 Using template-based AI for:', prospect.username);
      console.log('📊 Analysis:', analysis);
      console.log('📝 Template used:', template.name);
      
      return {
        message: templateMessage,
        templateUsed: `AI: ${template.name}`,
        confidence: analysis.confidence,
        personalizations: personalizations,
        synthesized: false
      };
      
    } catch (error) {
      console.error('Error generating AI message:', error);
      return {
        message: this.generateFallbackMessage(prospect),
        templateUsed: 'AI: Fallback Template',
        confidence: 0.5,
        personalizations: {},
        synthesized: false
      };
    }
  }

  // 🎯 SYSTEM PROMPT APPLICATION
  applySystemPrompt(template) {
    if (!this.systemPrompt.enabled) {
      return template;
    }
    
    // For now, we'll add the system prompt as context for the AI, not directly to the message
    // The system prompt guides message generation but doesn't appear in the final message
    // However, you can optionally prefix templates with instructions
    
    // Return the template as-is for user-facing message
    // The system prompt will be used by the AI when generating/refining the message
    return template;
  }
  
  // 🎯 GET FULL CONTEXT FOR AI PROCESSING
  getSystemPromptedTemplate(template, prospect, analysis) {
    if (!this.systemPrompt.enabled) {
      return template;
    }
    
    // Combine system prompt with template for AI processing
    const fullContext = `${this.systemPrompt.content}

PROSPECT ANALYSIS:
- Technical Level: ${analysis.technicalLevel}
- Comment: "${prospect.text}"
- Quality: ${prospect.quality}
- Platform: ${prospect.platform || 'Unknown'}

TEMPLATE TO USE:
${template}

Please generate a personalized message following the system prompt guidelines above.`;
    
    return fullContext;
  }

  // 🎯 SYSTEM PROMPT MANAGEMENT
  updateSystemPrompt(newPrompt) {
    this.systemPrompt.content = newPrompt;
    console.log('✅ System prompt updated');
  }
  
  enableSystemPrompt() {
    this.systemPrompt.enabled = true;
    console.log('✅ System prompt enabled');
  }
  
  disableSystemPrompt() {
    this.systemPrompt.enabled = false;
    console.log('⚠️ System prompt disabled');
  }
  
  getSystemPrompt() {
    return this.systemPrompt;
  }

  // 🔍 PROSPECT ANALYSIS ENGINE
  // Removed: Now in MessagePersonalizer

  // 🎯 TEMPLATE SELECTION AI
  selectOptimalTemplate(analysis) {
    // Technical users get technical template
    if (analysis.technicalLevel === 'high' && analysis.quality === 'High') {
      return this.messageTemplates.technical;
    }
    
    // Users with identified problems get problem-solver template
    if (analysis.problemAreas.length > 0) {
      return this.messageTemplates.problem_solver;
    }
    
    // Detailed commenters get community template
    if (analysis.engagementStyle === 'detailed') {
      return this.messageTemplates.community;
    }
    
    // Brief commenters get brief template
    if (analysis.engagementStyle === 'brief') {
      return this.messageTemplates.brief;
    }
    
    // Default to community template
    return this.messageTemplates.community;
  }

  // ✨ PERSONALIZATION GENERATOR
  // Removed: Now in MessagePersonalizer

  // 🎨 PERSONALIZATION COMPONENTS
  // Removed: Now in MessagePersonalizer

  // 🛠️ UTILITY FUNCTIONS
  // Removed: Now in MessagePersonalizer

  // 📊 ANALYTICS
  getMessageAnalytics(prospect, result) {
    return {
      prospect: {
        username: prospect.username,
        quality: prospect.quality,
        commentLength: prospect.text.length
      },
      ai: {
        templateUsed: result.templateUsed,
        confidence: result.confidence,
        personalizationCount: Object.keys(result.personalizations).length
      },
      message: {
        length: result.message.length,
        personalizedElements: Object.keys(result.personalizations).filter(key => 
          result.personalizations[key] && result.personalizations[key].length > 0
        ).length
      }
    };
  }
}

// Make it globally available
window.AIMessagingManager = AIMessagingManager;
