// message-personalization.js
// Handles personalization and formatting of AI messages

class MessagePersonalizer {
  static analyzeComment(comment) {
    // Analyze comment for technical level, problem focus, interests, etc.
    // Return an object with extracted personalization data
    return {
      technicalLevel: 'medium', // stub
      problemFocus: false, // stub
      interests: [], // stub
    };
  }

  static generatePersonalizedMessage(template, comment, personalizationData) {
    // Use template and personalizationData to generate a message
    // Replace placeholders, add customizations, etc.
    let message = template;
    // ...insert personalization logic here...
    return message;
  }

  // --- BEGIN: Extracted from ai-messaging.js ---

  static analyzeProspect(prospect) {
    // ...copied from AIMessagingManager.analyzeProspect...
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
    const technicalWords = ['print', 'settings', 'layer', 'infill', 'support', 'tolerance', 'precision', 'dimension'];
    const techScore = technicalWords.filter(word => commentText.includes(word)).length;
    if (techScore >= 3) analysis.technicalLevel = 'high';
    else if (techScore >= 1) analysis.technicalLevel = 'medium';
    else analysis.technicalLevel = 'low';
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
    if (commentText.includes('hook') || commentText.includes('mount')) {
      analysis.interests.push('mounting_solutions');
    }
    if (commentText.includes('workshop') || commentText.includes('garage')) {
      analysis.interests.push('workshop_organization');
    }
    if (commentText.includes('diy') || commentText.includes('maker')) {
      analysis.interests.push('diy_projects');
    }
    if (prospect.text.length > 100) {
      analysis.engagementStyle = 'detailed';
      analysis.confidence += 0.1;
    } else if (prospect.text.length < 30) {
      analysis.engagementStyle = 'brief';
    }
    if (prospect.quality === 'High') analysis.confidence += 0.2;
    else if (prospect.quality === 'Low') analysis.confidence -= 0.1;
    return analysis;
  }

  static generatePersonalizations(prospect, analysis, benefitLibrary) {
    return {
      name: prospect.username,
      project: MessagePersonalizer.extractProjectName(prospect.source),
      comment_reference: MessagePersonalizer.generateCommentReference(prospect, analysis),
      comment_insight: MessagePersonalizer.generateCommentInsight(prospect, analysis),
      technical_details: MessagePersonalizer.generateTechnicalDetails(analysis),
      personalized_benefits: MessagePersonalizer.generatePersonalizedBenefits(analysis, benefitLibrary),
      problem_solution: MessagePersonalizer.generateProblemSolution(analysis),
      specific_benefits: MessagePersonalizer.generateSpecificBenefits(analysis, benefitLibrary),
      call_to_action: MessagePersonalizer.generateCallToAction(analysis),
      personalized_question: MessagePersonalizer.generatePersonalizedQuestion(prospect, analysis),
      engagement_type: MessagePersonalizer.generateEngagementType(prospect, analysis),
      community_connection: MessagePersonalizer.generateCommunityConnection(analysis),
      project_highlights: MessagePersonalizer.generateProjectHighlights(analysis),
      collaboration_invite: MessagePersonalizer.generateCollaborationInvite(analysis),
      key_benefit: MessagePersonalizer.generateKeyBenefit(analysis),
      simple_question: MessagePersonalizer.generateSimpleQuestion(prospect, analysis)
    };
  }

  static generateCommentReference(prospect, analysis) {
    if (analysis.technicalLevel === 'high') {
      return `detailed technical comment`;
    } else if (prospect.text.length > 50) {
      return `thoughtful comment`;
    } else {
      return `comment`;
    }
  }

  static generateCommentInsight(prospect, analysis) {
    const commentText = prospect.text.toLowerCase();
    if (commentText.includes('perfect') || commentText.includes('great')) {
      return "sounds like you've had good experiences with SKÅDIS";
    } else if (analysis.problemAreas.length > 0) {
      return "I can relate to those challenges";
    } else {
      return "great to meet another SKÅDIS enthusiast";
    }
  }

  static generateTechnicalDetails(analysis) {
    if (analysis.technicalLevel === 'high') {
      return `🔧 **Two-slot mounting system** (40mm spacing) for superior stability\n🔧 **Four variants**: U, U-o, H, H-o hooks for different applications\n🔧 **Precision tolerances** optimized for standard FDM printers\n🔧 **Material tested** with PLA, PETG, and ABS filaments`;
    } else {
      return `The design uses a smart two-slot mounting system that makes the hooks much more stable than standard single-slot designs.`;
    }
  }

  static generatePersonalizedBenefits(analysis, benefitLibrary) {
    const benefits = [];
    if (analysis.problemAreas.includes('stability')) {
      benefits.push(...benefitLibrary.stability);
    }
    if (analysis.problemAreas.includes('cable_management')) {
      benefits.push(...benefitLibrary.cable_management);
    }
    if (analysis.technicalLevel === 'high') {
      benefits.push(...benefitLibrary.documentation);
    }
    if (benefits.length === 0) {
      benefits.push(...benefitLibrary.variety);
    }
    return benefits.slice(0, 3).map(benefit => `• ${benefit}`).join('\n');
  }

  static generateProblemSolution(analysis) {
    if (analysis.problemAreas.includes('stability')) {
      return "My two-slot mounting system completely eliminates the wobble and rotation issues you get with single-slot hooks.";
    } else if (analysis.problemAreas.includes('organization')) {
      return "I've created four different hook variants that can handle various organization challenges.";
    } else {
      return "I've designed some enhanced SKÅDIS hooks that solve common stability and organization issues.";
    }
  }

  static generateSpecificBenefits(analysis, benefitLibrary) {
    return MessagePersonalizer.generatePersonalizedBenefits(analysis, benefitLibrary);
  }

  static generateCallToAction(analysis) {
    if (analysis.technicalLevel === 'high') {
      return "Would love to get your technical feedback on the design!";
    } else {
      return "Would love to hear your thoughts if you check them out!";
    }
  }

  static generatePersonalizedQuestion(prospect, analysis) {
    const commentText = prospect.text.toLowerCase();
    if (analysis.problemAreas.includes('stability')) {
      return "Curious if you've had similar stability issues with standard hooks?";
    } else if (commentText.includes('print')) {
      return "Have you tried printing any custom SKÅDIS accessories yourself?";
    } else {
      return "What's been your biggest challenge with SKÅDIS organization?";
    }
  }

  static generateEngagementType(prospect, analysis) {
    if (prospect.text.length > 100) {
      return "detailed feedback";
    } else if (analysis.technicalLevel === 'high') {
      return "technical insights";
    } else {
      return "comment";
    }
  }

  static generateCommunityConnection(analysis) {
    if (analysis.interests.includes('workshop_organization')) {
      return "As someone who's constantly trying to optimize workshop organization, I think you'll appreciate these designs.";
    } else if (analysis.technicalLevel === 'high') {
      return "Since you seem to have a good eye for technical details, I'd love your perspective on these designs.";
    } else {
      return "I think you'll find these hook designs quite useful for your SKÅDIS setup.";
    }
  }

  static generateProjectHighlights(analysis) {
    const highlights = [];
    if (analysis.technicalLevel === 'high') {
      highlights.push("Complete technical documentation with assembly photos");
    }
    highlights.push("Four different hook variants for various applications");
    highlights.push("Two-slot mounting system for superior stability");
    return highlights.map(h => `• ${h}`).join('\n');
  }

  static generateCollaborationInvite(analysis) {
    if (analysis.technicalLevel === 'high') {
      return "Always interested in collaborating with other makers who understand good design!";
    } else {
      return "Love connecting with fellow SKÅDIS enthusiasts!";
    }
  }

  static generateKeyBenefit(analysis) {
    if (analysis.problemAreas.includes('stability')) {
      return "Two-slot mounting eliminates hook wobble completely.";
    } else {
      return "Four hook variants with superior stability design.";
    }
  }

  static generateSimpleQuestion(prospect, analysis) {
    if (analysis.problemAreas.length > 0) {
      return "Think they might solve some issues you've had?";
    } else {
      return "Thoughts?";
    }
  }

  static extractProjectName(url) {
    if (!url) return "your SKÅDIS project";
    const match = url.match(/models\/\d+-([^#?]+)/);
    if (match) {
      return match[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    return "your SKÅDIS project";
  }

  // --- END: Extracted from ai-messaging.js ---
}

// Export for use in ai-messaging.js
window.MessagePersonalizer = MessagePersonalizer;
