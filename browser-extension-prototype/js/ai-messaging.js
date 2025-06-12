// 🤖 AI-POWERED MESSAGE COMPOSITION MODULE
// Generates personalized promotional messages based on prospect data

class AIMessagingManager {
  constructor() {
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

  // 🧠 AI-POWERED MESSAGE GENERATION
  generatePersonalizedMessage(prospect) {
    try {
      // Analyze prospect data to determine best template and personalization
      const analysis = this.analyzeProspect(prospect);
      const template = this.selectOptimalTemplate(analysis);
      const personalizations = this.generatePersonalizations(prospect, analysis);
      
      // Generate the personalized message
      let message = template.template;
      
      // Apply all personalizations
      Object.entries(personalizations).forEach(([key, value]) => {
        const placeholder = `{${key}}`;
        message = message.replace(new RegExp(placeholder, 'g'), value);
      });
      
      // Final cleanup
      message = this.cleanupMessage(message);
      
      console.log('🤖 AI Generated message for:', prospect.username);
      console.log('📊 Analysis:', analysis);
      console.log('📝 Template used:', template.name);
      
      return {
        message: message,
        templateUsed: `AI: ${template.name}`,
        confidence: analysis.confidence,
        personalizations: personalizations
      };
      
    } catch (error) {
      console.error('Error generating AI message:', error);
      // Fallback to basic template
      return {
        message: this.generateFallbackMessage(prospect),
        templateUsed: 'AI: Fallback Template',
        confidence: 0.5,
        personalizations: {}
      };
    }
  }

  // 🔍 PROSPECT ANALYSIS ENGINE
  analyzeProspect(prospect) {
    const analysis = {
      technicalLevel: 'medium',
      problemAreas: [],
      interests: [],
      engagementStyle: 'standard',
      commentLength: prospect.text.length,
      quality: prospect.quality,
      confidence: 0.7
    };

    const commentText = prospect.text.toLowerCase();
    
    // Analyze technical level
    const technicalWords = ['print', 'settings', 'layer', 'infill', 'support', 'tolerance', 'precision', 'dimension'];
    const techScore = technicalWords.filter(word => commentText.includes(word)).length;
    
    if (techScore >= 3) analysis.technicalLevel = 'high';
    else if (techScore >= 1) analysis.technicalLevel = 'medium';
    else analysis.technicalLevel = 'low';

    // Identify problem areas
    if (commentText.includes('wobbl') || commentText.includes('loose') || commentText.includes('stable')) {
      analysis.problemAreas.push('stability');
    }
    if (commentText.includes('organiz') || commentText.includes('storage')) {
      analysis.problemAreas.push('organization');
    }
    if (commentText.includes('cable') || commentText.includes('wire')) {
      analysis.problemAreas.push('cable_management');
    }
    if (commentText.includes('tool')) {
      analysis.problemAreas.push('tool_storage');
    }

    // Identify interests
    if (commentText.includes('hook') || commentText.includes('mount')) {
      analysis.interests.push('mounting_solutions');
    }
    if (commentText.includes('workshop') || commentText.includes('garage')) {
      analysis.interests.push('workshop_organization');
    }
    if (commentText.includes('diy') || commentText.includes('maker')) {
      analysis.interests.push('diy_projects');
    }

    // Determine engagement style
    if (prospect.text.length > 100) {
      analysis.engagementStyle = 'detailed';
      analysis.confidence += 0.1;
    } else if (prospect.text.length < 30) {
      analysis.engagementStyle = 'brief';
    }

    // Quality-based confidence adjustment
    if (prospect.quality === 'High') analysis.confidence += 0.2;
    else if (prospect.quality === 'Low') analysis.confidence -= 0.1;

    return analysis;
  }

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
  generatePersonalizations(prospect, analysis) {
    const personalizations = {
      name: prospect.username,
      project: this.extractProjectName(prospect.source),
      comment_reference: this.generateCommentReference(prospect, analysis),
      comment_insight: this.generateCommentInsight(prospect, analysis),
      technical_details: this.generateTechnicalDetails(analysis),
      personalized_benefits: this.generatePersonalizedBenefits(analysis),
      problem_solution: this.generateProblemSolution(analysis),
      specific_benefits: this.generateSpecificBenefits(analysis),
      call_to_action: this.generateCallToAction(analysis),
      personalized_question: this.generatePersonalizedQuestion(prospect, analysis),
      engagement_type: this.generateEngagementType(prospect, analysis),
      community_connection: this.generateCommunityConnection(analysis),
      project_highlights: this.generateProjectHighlights(analysis),
      collaboration_invite: this.generateCollaborationInvite(analysis),
      key_benefit: this.generateKeyBenefit(analysis),
      simple_question: this.generateSimpleQuestion(prospect, analysis)
    };

    return personalizations;
  }

  // 🎨 PERSONALIZATION COMPONENTS
  generateCommentReference(prospect, analysis) {
    if (analysis.technicalLevel === 'high') {
      return `detailed technical comment`;
    } else if (prospect.text.length > 50) {
      return `thoughtful comment`;
    } else {
      return `comment`;
    }
  }

  generateCommentInsight(prospect, analysis) {
    const commentText = prospect.text.toLowerCase();
    
    if (commentText.includes('perfect') || commentText.includes('great')) {
      return "sounds like you've had good experiences with SKÅDIS";
    } else if (analysis.problemAreas.length > 0) {
      return "I can relate to those challenges";
    } else {
      return "great to meet another SKÅDIS enthusiast";
    }
  }

  generateTechnicalDetails(analysis) {
    if (analysis.technicalLevel === 'high') {
      return `🔧 **Two-slot mounting system** (40mm spacing) for superior stability
🔧 **Four variants**: U, U-o, H, H-o hooks for different applications
🔧 **Precision tolerances** optimized for standard FDM printers
🔧 **Material tested** with PLA, PETG, and ABS filaments`;
    } else {
      return `The design uses a smart two-slot mounting system that makes the hooks much more stable than standard single-slot designs.`;
    }
  }

  generatePersonalizedBenefits(analysis) {
    const benefits = [];
    
    if (analysis.problemAreas.includes('stability')) {
      benefits.push(...this.benefitLibrary.stability);
    }
    if (analysis.problemAreas.includes('cable_management')) {
      benefits.push(...this.benefitLibrary.cable_management);
    }
    if (analysis.technicalLevel === 'high') {
      benefits.push(...this.benefitLibrary.documentation);
    }
    if (benefits.length === 0) {
      benefits.push(...this.benefitLibrary.variety);
    }

    return benefits.slice(0, 3).map(benefit => `• ${benefit}`).join('\n');
  }

  generateProblemSolution(analysis) {
    if (analysis.problemAreas.includes('stability')) {
      return "My two-slot mounting system completely eliminates the wobble and rotation issues you get with single-slot hooks.";
    } else if (analysis.problemAreas.includes('organization')) {
      return "I've created four different hook variants that can handle various organization challenges.";
    } else {
      return "I've designed some enhanced SKÅDIS hooks that solve common stability and organization issues.";
    }
  }

  generateSpecificBenefits(analysis) {
    const benefits = this.generatePersonalizedBenefits(analysis);
    return benefits;
  }

  generateCallToAction(analysis) {
    if (analysis.technicalLevel === 'high') {
      return "Would love to get your technical feedback on the design!";
    } else {
      return "Would love to hear your thoughts if you check them out!";
    }
  }

  generatePersonalizedQuestion(prospect, analysis) {
    const commentText = prospect.text.toLowerCase();
    
    if (analysis.problemAreas.includes('stability')) {
      return "Curious if you've had similar stability issues with standard hooks?";
    } else if (commentText.includes('print')) {
      return "Have you tried printing any custom SKÅDIS accessories yourself?";
    } else {
      return "What's been your biggest challenge with SKÅDIS organization?";
    }
  }

  generateEngagementType(prospect, analysis) {
    if (prospect.text.length > 100) {
      return "detailed feedback";
    } else if (analysis.technicalLevel === 'high') {
      return "technical insights";
    } else {
      return "comment";
    }
  }

  generateCommunityConnection(analysis) {
    if (analysis.interests.includes('workshop_organization')) {
      return "As someone who's constantly trying to optimize workshop organization, I think you'll appreciate these designs.";
    } else if (analysis.technicalLevel === 'high') {
      return "Since you seem to have a good eye for technical details, I'd love your perspective on these designs.";
    } else {
      return "I think you'll find these hook designs quite useful for your SKÅDIS setup.";
    }
  }

  generateProjectHighlights(analysis) {
    const highlights = [];
    
    if (analysis.technicalLevel === 'high') {
      highlights.push("Complete technical documentation with assembly photos");
    }
    highlights.push("Four different hook variants for various applications");
    highlights.push("Two-slot mounting system for superior stability");
    
    return highlights.map(h => `• ${h}`).join('\n');
  }

  generateCollaborationInvite(analysis) {
    if (analysis.technicalLevel === 'high') {
      return "Always interested in collaborating with other makers who understand good design!";
    } else {
      return "Love connecting with fellow SKÅDIS enthusiasts!";
    }
  }

  generateKeyBenefit(analysis) {
    if (analysis.problemAreas.includes('stability')) {
      return "Two-slot mounting eliminates hook wobble completely.";
    } else {
      return "Four hook variants with superior stability design.";
    }
  }

  generateSimpleQuestion(prospect, analysis) {
    if (analysis.problemAreas.length > 0) {
      return "Think they might solve some issues you've had?";
    } else {
      return "Thoughts?";
    }
  }

  // 🛠️ UTILITY FUNCTIONS
  extractProjectName(url) {
    if (!url) return "your SKÅDIS project";
    
    const match = url.match(/models\/\d+-([^#?]+)/);
    if (match) {
      return match[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    return "your SKÅDIS project";
  }

  generateFallbackMessage(prospect) {
    return `Hi ${prospect.username},

Saw your comment on this SKÅDIS project - great to meet another SKÅDIS enthusiast!

I've been working on some enhanced SKÅDIS hooks that solve the stability issues of single-slot hooks through a two-slot mounting system. Since you're interested in SKÅDIS accessories, I thought you might find them interesting.

The project includes 4 hook variants with complete documentation and assembly photos:
https://makerworld.com/en/models/1503225-simple-skadis-hook#profileId-1572818

Would love to hear your thoughts if you check them out!

Best,
Mihkel`;
  }

  cleanupMessage(message) {
    // Remove any unfilled placeholders
    message = message.replace(/\{[^}]+\}/g, '');
    
    // Clean up extra whitespace and line breaks
    message = message.replace(/\n\s*\n\s*\n/g, '\n\n');
    message = message.replace(/^\s+|\s+$/g, '');
    
    return message;
  }

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
