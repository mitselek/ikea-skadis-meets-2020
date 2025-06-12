# 🎯 System Prompt Configuration Guide

## Overview

The SKÅDIS Outreach Helper now includes **System Prompts** - a powerful feature that allows you to add consistent guidance and instructions to every template used in message generation.

## What System Prompts Do

System prompts provide:
- **Consistent messaging guidelines** across all templates
- **Enhanced AI context** for better personalization
- **Quality standards** for professional communication
- **Customizable instructions** that adapt to your style

## How It Works

### 🤖 AI System Prompts
- Provide comprehensive context to AI for message generation
- Include technical guidelines, tone instructions, and formatting rules
- Applied automatically when AI generates personalized messages
- Result in higher quality, more consistent messaging

### 📝 Standard Template Prompts
- Guide template-based message generation
- Ensure consistent principles even without AI
- Track system prompt usage in template names
- Maintain quality standards across all messaging modes

## Configuration

### Current Default System Prompt (AI)
```
You are a friendly and professional maker reaching out to fellow 3D printing enthusiasts about your SKÅDIS hook project. Be genuine, helpful, and focus on the technical benefits that solve real workshop organization problems. Keep messages conversational but informative, and always end with a call-to-action that invites feedback or questions.

Key principles:
- Personalize based on their specific comment or project
- Highlight technical innovations (two-slot mounting, stability improvements) 
- Mention practical benefits (cable management, precision tool mounting)
- Include complete project documentation as a value-add
- Sound like a peer, not a salesperson
- Keep it under 150 words unless they showed high technical engagement
```

### Standard Template Guidance
```
Remember: Be friendly, professional, and focus on solving real workshop organization problems. Mention specific technical benefits and invite feedback.
```

## Usage

### Through Browser Console

1. **Check Current System Prompts**
```javascript
getSystemPrompts()
```

2. **Update System Prompts**
```javascript
updateSystemPrompts(
  "Your custom AI prompt here...", 
  "Your custom standard guidance here..."
)
```

3. **Toggle System Prompts**
```javascript
toggleSystemPrompts(true)  // Enable
toggleSystemPrompts(false) // Disable
```

4. **Test System Prompt Functionality**
```javascript
testSystemPrompts()
```

### Advanced Testing

Load and run the comprehensive test suite:
```javascript
// Load the test script
eval(await fetch('./utils/test-system-prompt.js').then(r => r.text()));

// Run comprehensive tests
testSystemPrompt()
```

## Benefits

### 🎯 **Consistency**
- All messages follow the same quality standards
- Consistent tone and approach across all prospects
- Professional communication maintained automatically

### 🚀 **Enhanced AI Performance**
- AI receives clear instructions for better personalization
- Technical guidelines ensure relevant details are included
- Contextual information improves message relevance

### 📈 **Better Results**
- Higher response rates from more targeted messaging
- Professional impression with prospects
- Reduced need for manual message editing

### 🔧 **Flexibility**
- Easily customize prompts for different campaigns
- Toggle system prompts on/off as needed
- Update guidelines without changing core templates

## Template Usage Tracking

When system prompts are enabled, you'll see enhanced template names in logs:
- `Standard Template (System Prompt Enhanced)`
- `AI: Technical Focus` (with system prompt context)
- `AI Generated` (with system prompt guidance)

## Best Practices

### Writing Effective System Prompts

1. **Be Specific**: Include clear guidelines about tone, length, and content
2. **Include Context**: Provide background about your project and goals
3. **Set Boundaries**: Specify what to include/exclude in messages
4. **Define Success**: Explain what makes a good message for your campaign

### Example Custom System Prompt
```
You are reaching out about innovative SKÅDIS solutions to makers who value precision and quality. Focus on:

- Technical superiority (two-slot mounting, stability)
- Professional documentation and support
- Real workshop problem-solving
- Community feedback and collaboration

Keep messages under 120 words, always include the project link, and end with a specific question about their SKÅDIS setup or printing experience.
```

## Troubleshooting

### System Prompts Not Working
1. Check if system prompts are enabled: `getSystemPrompts()`
2. Verify messaging managers are loaded properly
3. Test with: `testSystemPrompts()`

### AI Not Using System Prompts
1. Ensure Real AI Assistant is configured
2. Check AI provider connection
3. Verify system prompt is passed to AI correctly

### Template Names Not Showing Enhancement
1. Confirm system prompts are enabled
2. Check message generation logs in console
3. Verify template tracking in outreach log

## Integration with Existing System

System prompts work seamlessly with:
- ✅ **AI Message Generation** - Enhanced context for better personalization
- ✅ **Template Fallback System** - Quality guidelines when AI unavailable  
- ✅ **Message Preview** - Real-time generation with system prompt guidance
- ✅ **Outreach Tracking** - Template usage includes system prompt status
- ✅ **Analytics Dashboard** - System prompt usage tracked in campaign stats

---

*System prompts ensure every message meets your quality standards while maintaining the personal touch that makes outreach effective.*
