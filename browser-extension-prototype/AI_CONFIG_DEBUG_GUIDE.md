# 🔧 AI Configuration Debug Steps

## Manual Testing Steps

### Step 1: Open Extension Popup
1. Click on the SKÅDIS extension icon in your browser toolbar
2. The popup should open showing the main interface

### Step 2: Copy and Run Test Code
1. Right-click in the popup and select "Inspect" or "Inspect Element"
2. Go to the "Console" tab in DevTools
3. Copy and paste the entire content from `SIMPLE_AI_TEST.js` into the console
4. Press Enter to run the test

### Step 3: Check Test Results
Look for these results in the console:

#### ✅ Expected Good Results:
```
🧪 Testing Real AI Configuration System...

1. 🔍 Checking UI Elements...
  ai-config-section: ✅ Found
  configure-ai: ✅ Found
  test-ai-connection: ✅ Found
  save-ai-config: ✅ Found
  disable-real-ai: ✅ Found
  close-ai-config: ✅ Found
  ai-provider: ✅ Found
  ai-api-key: ✅ Found
  ai-config-status: ✅ Found
  main-view: ✅ Found

2. 🤖 Checking JavaScript Availability...
  window.RealAIAssistant: ✅ Available
  realAIAssistant instance: ✅ Available
  showAIConfiguration function: ✅ Available

🎯 SUCCESS! Configuration UI is working!
```

#### ❌ Problem Indicators:
- Any "❌ Missing" elements
- "❌ Configuration UI not showing"
- JavaScript errors in red text

### Step 4: Manual Configuration Test
If the test passes, try manually configuring:

1. **Open AI Config**: Click the "🤖 Configure AI Assistant" button
2. **Select Provider**: Choose "OpenAI (GPT-4)" or "Anthropic (Claude)"
3. **Enter API Key**: Paste your API key
4. **Test Connection**: Click "🔍 Test Connection"
5. **Save Config**: Click "💾 Save Config"

### Step 5: Verify Real AI is Working
After successful configuration:

1. Extract some prospects: Click "💬 Extract Comments"
2. Send a message: Click "📧 Send Template Message"
3. Check console for: "✨ Real AI synthesized personalized message"

## Quick Debug Commands

Run these in the console for quick tests:

### Check if elements exist:
```javascript
console.log('Configure button:', !!document.getElementById('configure-ai'));
console.log('Config section:', !!document.getElementById('ai-config-section'));
console.log('RealAI available:', !!window.RealAIAssistant);
```

### Manual config panel open:
```javascript
document.getElementById('ai-config-section').style.display = 'block';
document.querySelector('.main-view').style.display = 'none';
```

### Check current AI status:
```javascript
chrome.storage.local.get(['aiProvider', 'aiApiKey']).then(r => 
  console.log('AI Config:', r.aiProvider || 'None', r.aiApiKey ? '(key present)' : '(no key)')
);
```

## Common Issues & Solutions

### Issue: "❌ Missing" UI elements
**Solution**: HTML structure problem. Check if popup.html loaded correctly.

### Issue: "❌ Missing" JavaScript functions
**Solution**: Script loading problem. Check if all .js files are loading.

### Issue: Configuration panel doesn't open
**Solution**: CSS or event listener problem. Try manual open command.

### Issue: "Connection failed" with valid API key
**Solution**: Check browser network permissions and API key format.

---

**🎯 Goal**: Get all ✅ in the test, then successfully configure and test AI connection.
