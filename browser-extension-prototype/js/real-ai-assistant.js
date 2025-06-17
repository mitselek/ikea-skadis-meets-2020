// 🤖 REAL AI ASSISTANT INTEGRATION MODULE
// Integrates with external AI services for natural message synthesis

class RealAIAssistant {
  constructor() {
    this.apiEndpoints = {
      openai: 'https://api.openai.com/v1/chat/completions',
      anthropic: 'https://api.anthropic.com/v1/messages',
      // Add more providers as needed
    };
    
    this.currentProvider = null;
    this.apiKey = null;
    this.isAvailable = false;
    this.initialized = false;
    
    // Initialize from storage asynchronously
    this.initializeFromStorage().catch(error => {
      console.error('Failed to initialize Real AI Assistant:', error);
    });
    
    console.log('✅ RealAIAssistant constructor completed');
  }

  async initializeFromStorage() {
    try {
      const stored = await chrome.storage.local.get(['aiProvider', 'aiApiKey']);
      if (stored.aiProvider && stored.aiApiKey) {
        this.currentProvider = stored.aiProvider;
        this.apiKey = stored.aiApiKey;
        this.isAvailable = true;
        console.log('✅ Real AI Assistant initialized with provider:', this.currentProvider);
      } else {
        console.log('⚠️ Real AI Assistant not configured - using template system');
      }
      this.initialized = true;
      console.log('✅ Real AI Assistant storage initialization completed');
    } catch (error) {
      console.error('Error initializing Real AI Assistant:', error);
      this.initialized = true; // Mark as initialized even if failed
    }
  }

  // Wait for initialization to complete
  async waitForInitialization() {
    while (!this.initialized) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    return this.isAvailable;
  }

  // Check if AI is properly configured
  isConfigured() {
    return this.initialized && this.isAvailable && this.currentProvider && this.apiKey;
  }

  // Get current provider
  get provider() {
    return this.currentProvider;
  }

  // 🎯 MAIN AI MESSAGE SYNTHESIS METHOD
  async synthesizePersonalizedMessage(originalCommentOrData, templateMessage, prospectData) {
    // Wait for initialization to complete
    await this.waitForInitialization();
    
    if (!this.isAvailable) {
      console.log('🔄 Real AI not available, falling back to template system');
      return null;
    }

    try {
      let prompt;
      
      // Handle both parameter formats:
      // 1. New format: single data object
      // 2. Old format: three separate parameters
      if (typeof originalCommentOrData === 'object' && !templateMessage && !prospectData) {
        // New format - single data object
        prompt = this.buildEnhancedSynthesisPrompt(originalCommentOrData);
      } else {
        // Old format - three parameters
        prompt = this.buildSynthesisPrompt(originalCommentOrData, templateMessage, prospectData);
      }
      
      const response = await this.callAIProvider(prompt);
      
      if (response && response.message) {
        console.log('✨ Real AI synthesized personalized message');
        return response.message; // Return just the message string for the test
      }
    } catch (error) {
      console.error('Error with Real AI synthesis:', error);
    }
    
    return null; // Fall back to template system
  }

  buildSynthesisPrompt(originalComment, templateMessage, prospectData) {
    return `You are helping create a personalized outreach message for a 3D printing/maker community.

CONTEXT:
- I'm reaching out to a maker who commented on a SKÅDIS (IKEA pegboard) project
- I have my own SKÅDIS hook design I'd like to share with them
- The goal is authentic, helpful community engagement (not spammy)

ORIGINAL USER'S COMMENT:
"${originalComment}"

TEMPLATE MESSAGE I GENERATED:
"${templateMessage}"

USER PROFILE:
- Username: ${prospectData.username}
- Project they commented on: ${prospectData.project || 'SKÅDIS-related project'}
- Comment context: ${prospectData.commentText || 'SKÅDIS discussion'}

TASK:
Please synthesize a natural, personal message that:
1. References their specific comment in a meaningful way
2. Connects genuinely to their interests shown in the comment
3. Introduces my SKÅDIS hook design naturally
4. Feels like a real maker-to-maker conversation
5. Avoids generic promotional language
6. Keeps the same URL: https://makerworld.com/en/models/1503225-simple-skadis-hook#profileId-1572818

TONE: Friendly, maker-to-maker, genuinely helpful, not salesy

Please write a concise, personal message (2-3 paragraphs max):`;
  }

  buildEnhancedSynthesisPrompt(data) {
    const { prospect, projectType, userContext } = data;
    const comments = prospect.recentComments || [];
    const commentsText = comments.join(' ');
    
    return `You are helping create a personalized outreach message for a 3D printing/maker community.

CONTEXT:
- I'm reaching out to a maker named "${prospect.name}" (@${prospect.handle})
- They're interested in ${projectType}
- I have SKÅDIS pegboard organizers and custom hooks I'd like to share
- Goal: authentic, helpful maker-to-maker conversation

USER PROFILE:
- Name: ${prospect.name}
- Handle: @${prospect.handle}
- Bio: ${prospect.bio}
- Recent Comments: "${commentsText}"
- Project Interest: ${projectType}
- Context: ${userContext}

TASK:
Create a natural, personalized message that:
1. References their specific interests and comments
2. Connects genuinely to their maker projects
3. Introduces my SKÅDIS solutions naturally
4. Feels like authentic maker-to-maker conversation
5. Avoids generic promotional language
6. Includes this URL naturally: https://makerworld.com/en/models/1503225-simple-skadis-hook#profileId-1572818

TONE: Friendly, maker-to-maker, genuinely helpful, not salesy

Please write a concise, personal message (2-3 paragraphs max):`;
  }

  async callAIProvider(prompt) {
    switch (this.currentProvider) {
      case 'openai':
        return await this.callOpenAI(prompt);
      case 'anthropic':
        return await this.callAnthropic(prompt);
      default:
        throw new Error(`Unsupported AI provider: ${this.currentProvider}`);
    }
  }

  async callOpenAI(prompt) {
    const response = await fetch(this.apiEndpoints.openai, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      message: data.choices[0].message.content.trim(),
      provider: 'openai'
    };
  }

  async callAnthropic(prompt) {
    const response = await fetch(this.apiEndpoints.anthropic, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      message: data.content[0].text.trim(),
      provider: 'anthropic'
    };
  }

  // 🔧 CONFIGURATION METHODS
  async configureProvider(provider, apiKey) {
    this.currentProvider = provider;
    this.apiKey = apiKey;
    this.isAvailable = true;

    // Save to storage
    await chrome.storage.local.set({
      aiProvider: provider,
      aiApiKey: apiKey
    });

    console.log('✅ Real AI Assistant configured with provider:', provider);
  }

  async testConnection() {
    if (!this.isAvailable) {
      return { success: false, error: 'Not configured' };
    }

    try {
      const testPrompt = 'Please respond with "Connection successful" to test the API.';
      const response = await this.callAIProvider(testPrompt);
      
      return {
        success: true,
        provider: this.currentProvider,
        response: response.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 🚫 DISABLE REAL AI (falls back to template system)
  async disable() {
    this.isAvailable = false;
    await chrome.storage.local.remove(['aiProvider', 'aiApiKey']);
    console.log('🔄 Real AI Assistant disabled - using template system');
  }
}

// Make available globally
window.RealAIAssistant = RealAIAssistant;
