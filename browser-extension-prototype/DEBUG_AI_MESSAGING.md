# 🔍 AI MESSAGING DEBUG GUIDE

## 🚨 **DEBUGGING STEPS - Run These in Order**

### **Step 1: Check Console for Errors**

1. Open Chrome DevTools (F12)
2. Go to **Console** tab
3. Load your extension and navigate to a SKÅDIS page
4. Click "📧 Send Template Message"
5. Look for any **red error messages**

### **Step 2: Check AI System Initialization**

Open DevTools Console and run these commands:

```javascript
// Check if AIMessagingManager is available
console.log('AIMessagingManager available:', typeof window.AIMessagingManager);

// Check if MessagingManager has AI instance
if (window.messagingManager) {
  console.log('AI instance:', window.messagingManager.aiMessaging);
} else {
  console.log('MessagingManager not found');
}
```

### **Step 3: Force Test AI Generation**

In DevTools Console, test AI generation directly:

```javascript
// Test AI generation manually
if (window.AIMessagingManager) {
  const testProspect = {
    username: 'TestUser',
    text: 'These look great! What layer height and infill settings work best?',
    quality: 'High',
    source: 'https://makerworld.com/en/models/1503225-simple-skadis-hook'
  };
  
  const aiManager = new window.AIMessagingManager();
  const result = aiManager.generatePersonalizedMessage(testProspect);
  console.log('🤖 AI Test Result:', result);
} else {
  console.log('❌ AIMessagingManager not available');
}
```

### **Step 4: Check Script Loading Order**

Check if scripts are loading in the correct order:

```javascript
// Check what's available when MessagingManager is created
console.log('Available at load time:');
console.log('- AIMessagingManager:', typeof window.AIMessagingManager);
console.log('- MessagingManager:', typeof window.MessagingManager);
```

## 🔧 **QUICK FIXES TO TRY**

### **Fix 1: Ensure Script Order**

In `popup.html`, make sure `ai-messaging.js` loads first:

```html
<!-- Load AI system first -->
<script src="js/ai-messaging.js"></script>
<!-- Then other modules -->
<script src="js/prospects.js"></script>
<script src="js/dashboard.js"></script>
<script src="js/messaging.js"></script>
<script src="js/extraction.js"></script>
<script src="js/stats.js"></script>
<!-- Main script last -->
<script src="popup.js"></script>
```

### **Fix 2: Add Debug Logging**

Temporarily add this debug code to `js/messaging.js` constructor:

```javascript
constructor() {
  console.log('🔍 MessagingManager constructor starting...');
  console.log('🔍 AIMessagingManager available:', typeof window.AIMessagingManager);
  
  this.templates = {
    standard: 'Standard Template',
    prospects: 'Prospects View Template',
    ai: 'AI Generated'
  };
  
  // Initialize AI messaging if available
  this.aiMessaging = window.AIMessagingManager ? new window.AIMessagingManager() : null;
  
  console.log('🔍 AI instance created:', !!this.aiMessaging);
  console.log('🔍 MessagingManager constructor complete');
}
```

### **Fix 3: Force Re-initialization**

Add this function to test AI manually:

```javascript
// Add to popup.js after DOM loaded
window.testAI = function() {
  console.log('🧪 Testing AI system...');
  
  if (window.messagingManager && window.messagingManager.aiMessaging) {
    console.log('✅ AI system is working!');
    return true;
  } else {
    console.log('❌ AI system not initialized, attempting fix...');
    
    if (window.messagingManager && window.AIMessagingManager) {
      window.messagingManager.aiMessaging = new window.AIMessagingManager();
      console.log('🔧 AI system re-initialized');
      return true;
    } else {
      console.log('❌ Components missing');
      return false;
    }
  }
};
```

## 📊 **EXPECTED RESULTS**

### **Working System Should Show:**

```text
✅ AIMessagingManager available: function
✅ AI instance: AIMessagingManager { messageTemplates: {...} }
✅ AI Test Result: { message: "Hi TestUser...", templateUsed: "AI: Technical Focus", confidence: 0.9 }
```

### **Broken System Will Show:**

```text
❌ AIMessagingManager available: undefined
❌ AI instance: null
❌ AI Test Result: undefined
```

## 🚀 **QUICK TEST**

Run this in DevTools Console to test everything:

```javascript
// Comprehensive AI system test
console.log('=== AI SYSTEM DIAGNOSTIC ===');
console.log('1. AIMessagingManager:', typeof window.AIMessagingManager);
console.log('2. MessagingManager:', typeof window.MessagingManager);
console.log('3. messagingManager instance:', typeof window.messagingManager);

if (window.messagingManager) {
  console.log('4. AI instance:', !!window.messagingManager.aiMessaging);
  console.log('5. AI type:', typeof window.messagingManager.aiMessaging);
}

// Test manual creation
if (window.AIMessagingManager) {
  try {
    const testAI = new window.AIMessagingManager();
    console.log('6. Manual AI creation: SUCCESS');
    console.log('7. AI templates available:', Object.keys(testAI.messageTemplates));
  } catch (error) {
    console.log('6. Manual AI creation: FAILED', error);
  }
} else {
  console.log('6. Cannot test - AIMessagingManager not available');
}
```

**Run this test and share the console output to pinpoint the exact issue!** 🎯
