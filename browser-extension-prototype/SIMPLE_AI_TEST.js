/*
🧪 SIMPLE AI CONFIG TEST
Copy and paste this entire code block into the DevTools console when the extension popup is open
*/

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
console.log(`  showAIConfiguration function: ${typeof showAIConfiguration === 'function' ? '✅ Available' : '❌ Missing'}`);

// Test 3: Check current storage
console.log('\n3. 💾 Checking Current Storage...');
chrome.storage.local.get(['aiProvider', 'aiApiKey']).then(result => {
  console.log(`  Stored AI Provider: ${result.aiProvider || 'None'}`);
  console.log(`  Stored API Key: ${result.aiApiKey ? 'Present (hidden)' : 'None'}`);
});

// Test 4: Try to open configuration
console.log('\n4. 🖥️ Testing Configuration UI...');
if (allElementsFound) {
  console.log('  All elements found! Testing showAIConfiguration...');
  
  try {
    // Try to find and click the configure button
    const configureBtn = document.getElementById('configure-ai');
    if (configureBtn) {
      console.log('  Clicking configure button...');
      configureBtn.click();
      
      setTimeout(() => {
        const configSection = document.getElementById('ai-config-section');
        const mainView = document.querySelector('.main-view');
        
        const configVisible = configSection && configSection.style.display !== 'none';
        const mainHidden = mainView && mainView.style.display === 'none';
        
        console.log(`  Config section visible: ${configVisible ? '✅ Yes' : '❌ No'}`);
        console.log(`  Main view hidden: ${mainHidden ? '✅ Yes' : '❌ No'}`);
        
        if (configVisible) {
          console.log('\n🎯 SUCCESS! Configuration UI is working!');
          console.log('You can now configure your AI provider.');
        } else {
          console.log('\n❌ Configuration UI not showing. Trying manual approach...');
          
          // Manual approach
          if (configSection) {
            configSection.style.display = 'block';
            console.log('✅ Manually showed config section');
          }
          if (mainView) {
            mainView.style.display = 'none';
            console.log('✅ Manually hid main view');
          }
        }
      }, 300);
    } else {
      console.log('❌ Configure button not found');
    }
  } catch (error) {
    console.error('❌ Error testing configuration:', error);
  }
} else {
  console.log('❌ Missing UI elements - configuration cannot work');
}

console.log('\n🏁 Test complete! Check results above.');
console.log('💡 If successful, you should see the AI configuration panel.');
