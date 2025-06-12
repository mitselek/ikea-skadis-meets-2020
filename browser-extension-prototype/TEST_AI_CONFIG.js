// 🧪 COMPREHENSIVE REAL AI CONFIGURATION TEST
// Run this in the DevTools console when the extension popup is open

console.log('🧪 Testing Real AI Configuration System...');

// Test 1: Check all required elements
console.log('\n1. 🔍 Checking UI Elements...');
const elements = {
  'ai-config-section': document.getElementById('ai-config-section'),
  'configure-ai': document.getElementById('configure-ai'),
  'test-ai-connection': document.getElementById('test-ai-connection'),
  'save-ai-config': document.getElementById('save-ai-config'),
  'disable-real-ai': document.getElementById('disable-real-ai'),
  'close-ai-config': document.getElementById('close-ai-config'),
  'ai-provider': document.getElementById('ai-provider'),
  'ai-api-key': document.getElementById('ai-api-key'),
  'ai-config-status': document.getElementById('ai-config-status'),
  'main-view': document.querySelector('.main-view')
};

let allElementsFound = true;
Object.entries(elements).forEach(([name, element]) => {
  const found = element !== null;
  console.log(`  ${name}: ${found ? '✅ Found' : '❌ Missing'}`);
  if (!found) allElementsFound = false;
});

// Test 2: Check JavaScript availability
console.log('\n2. 🤖 Checking JavaScript Availability...');
console.log(`  window.RealAIAssistant: ${window.RealAIAssistant ? '✅ Available' : '❌ Missing'}`);
console.log(`  realAIAssistant instance: ${window.realAIAssistant ? '✅ Available' : '❌ Missing'}`);
console.log(`  showAIConfiguration function: ${typeof window.showAIConfiguration === 'function' ? '✅ Available' : '❌ Missing'}`);
console.log(`  debugAIConfig function: ${typeof window.debugAIConfig === 'function' ? '✅ Available' : '❌ Missing'}`);

// Test 3: Check current storage
console.log('\n3. 💾 Checking Current Storage...');
chrome.storage.local.get(['aiProvider', 'aiApiKey']).then(result => {
  console.log(`  Stored AI Provider: ${result.aiProvider || 'None'}`);
  console.log(`  Stored API Key: ${result.aiApiKey ? 'Present (hidden)' : 'None'}`);
});

// Test 4: Test configuration UI
console.log('\n4. 🖥️ Testing Configuration UI...');
if (allElementsFound && typeof window.showAIConfiguration === 'function') {
  console.log('  Attempting to open AI configuration...');
  
  try {
    window.showAIConfiguration();
    
    setTimeout(() => {
      const configSection = document.getElementById('ai-config-section');
      const mainView = document.querySelector('.main-view');
      
      const configVisible = configSection && configSection.style.display !== 'none';
      const mainHidden = mainView && mainView.style.display === 'none';
      
      console.log(`  Config section visible: ${configVisible ? '✅ Yes' : '❌ No'}`);
      console.log(`  Main view hidden: ${mainHidden ? '✅ Yes' : '❌ No'}`);
      
      if (configVisible) {
        console.log('\n5. 🎯 Configuration UI Test - SUCCESS!');
        console.log('   You can now:');
        console.log('   1. Select a provider (openai or anthropic)');
        console.log('   2. Enter an API key');
        console.log('   3. Click "🔍 Test Connection"');
        console.log('   4. Click "💾 Save Config"');
        
        // Test with dummy data
        console.log('\n6. 🧪 Testing with dummy configuration...');
        const providerSelect = document.getElementById('ai-provider');
        const apiKeyInput = document.getElementById('ai-api-key');
        
        if (providerSelect && apiKeyInput) {
          providerSelect.value = 'openai';
          apiKeyInput.value = 'test-key-123';
          console.log('   ✅ Dummy data entered');
          console.log('   ⚠️  To test real connection, enter your actual API key and click Test');
        }
      } else {
        console.log('\n❌ Configuration UI failed to open');
        console.log('   Running manual test...');
        window.testAIConfigManual();
      }
    }, 200);
    
  } catch (error) {
    console.error('❌ Error opening configuration:', error);
  }
} else {
  console.log('❌ Cannot test configuration UI - missing elements or functions');
}

// Test 5: Event listener verification
console.log('\n🔧 Quick Manual Tests Available:');
console.log('   window.debugAIConfig() - Run comprehensive debug');
console.log('   window.testAIConfigManual() - Manually show config panel');
console.log('   window.showAIConfiguration() - Normal config open');

console.log('\n🏁 Initial test complete. Check results above.');
console.log('💡 If everything looks good, try configuring with a real API key!');
