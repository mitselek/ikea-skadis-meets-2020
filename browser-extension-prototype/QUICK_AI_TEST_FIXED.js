/*
🚀 UPDATED QUICK AI TEST - Copy and paste this entire block into the popup console

This will test the Real AI Assistant and also try to open the configuration panel.
After reloading the extension, paste this and run: quickAITestFixed()
*/

async function quickAITestFixed() {
    console.log('🚀 QUICK AI TEST STARTING (FIXED VERSION)...');
    
    // Check class
    if (typeof RealAIAssistant === 'undefined') {
        console.log('❌ RealAIAssistant class not found - check script loading');
        return false;
    }
    console.log('✅ RealAIAssistant class found');
    
    // Check global instance
    if (!window.realAIAssistant) {
        console.log('⚠️ Global instance missing - creating one...');
        try {
            window.realAIAssistant = new RealAIAssistant();
            await window.realAIAssistant.waitForInitialization();
            console.log('✅ Global instance created and initialized');
        } catch (error) {
            console.log('❌ Failed to create instance:', error.message);
            return false;
        }
    } else {
        console.log('✅ Global instance exists');
        await window.realAIAssistant.waitForInitialization();
    }
    
    // Test configuration UI elements (corrected IDs)
    const configBtn = document.getElementById('configure-ai');
    const configPanel = document.getElementById('ai-config-section');
    const providerSelect = document.getElementById('ai-provider');
    const apiKeyInput = document.getElementById('ai-api-key');
    const testBtn = document.getElementById('test-ai-connection');
    const saveBtn = document.getElementById('save-ai-config');
    
    console.log(`${configBtn ? '✅' : '❌'} Config button (configure-ai)`);
    console.log(`${configPanel ? '✅' : '❌'} Config panel (ai-config-section)`);
    console.log(`${providerSelect ? '✅' : '❌'} Provider select`);
    console.log(`${apiKeyInput ? '✅' : '❌'} API key input`);
    console.log(`${testBtn ? '✅' : '❌'} Test connection button`);
    console.log(`${saveBtn ? '✅' : '❌'} Save config button`);
    console.log(`${typeof window.showAIConfiguration === 'function' ? '✅' : '❌'} Show config function`);
    
    // Test AI instance
    const ai = window.realAIAssistant;
    console.log(`${ai.initialized ? '✅' : '❌'} AI initialized`);
    console.log(`${ai.isAvailable ? '✅' : '⚠️'} AI available (${ai.isAvailable ? 'configured' : 'needs API key'})`);
    console.log(`Provider: ${ai.currentProvider || 'None configured'}`);
    
    // Test opening configuration panel
    console.log('\n🔧 Testing Configuration Panel...');
    if (typeof window.showAIConfiguration === 'function') {
        try {
            console.log('- Attempting to show AI configuration...');
            window.showAIConfiguration();
            
            // Check if panel is now visible
            const panelVisible = configPanel && configPanel.style.display !== 'none';
            console.log(`- Config panel visible: ${panelVisible ? '✅' : '❌'}`);
            
            if (panelVisible) {
                console.log('✅ Configuration panel opened successfully!');
                console.log('💡 You should now see the AI configuration form');
                
                // Test form elements are accessible
                if (providerSelect && apiKeyInput) {
                    console.log('✅ Form elements are accessible');
                    console.log('💡 You can now:');
                    console.log('   1. Select OpenAI or Anthropic from the dropdown');
                    console.log('   2. Enter your API key');
                    console.log('   3. Click "Test Connection" to verify');
                    console.log('   4. Click "Save Config" to store settings');
                } else {
                    console.log('❌ Form elements not accessible');
                }
            } else {
                console.log('❌ Configuration panel failed to open');
            }
            
        } catch (error) {
            console.error('❌ Error opening configuration panel:', error);
        }
    } else {
        console.log('❌ showAIConfiguration function not available');
    }
    
    // Summary
    const uiWorking = !!(configBtn && configPanel && providerSelect && apiKeyInput);
    const systemWorking = !!(
        typeof RealAIAssistant !== 'undefined' &&
        window.realAIAssistant &&
        ai.initialized &&
        typeof window.showAIConfiguration === 'function'
    );
    
    console.log('\n🎯 RESULTS:');
    console.log(`- AI System: ${systemWorking ? '✅ WORKING!' : '❌ Issues found'}`);
    console.log(`- Configuration UI: ${uiWorking ? '✅ WORKING!' : '❌ Issues found'}`);
    
    if (systemWorking && uiWorking) {
        console.log('\n🎉 SUCCESS! Real AI Assistant is fully operational!');
        console.log('📝 Next steps:');
        console.log('   1. The configuration panel should be open now');
        console.log('   2. Select your AI provider (OpenAI or Anthropic)');
        console.log('   3. Enter your API key');
        console.log('   4. Test the connection');
        console.log('   5. Save the configuration');
        return true;
    } else {
        console.log('\n❌ Issues found - check the individual test results above');
        return false;
    }
}

// Quick function to close the config panel if needed
function closeAIConfig() {
    const configPanel = document.getElementById('ai-config-section');
    const mainView = document.querySelector('.main-view');
    
    if (configPanel) configPanel.style.display = 'none';
    if (mainView) mainView.style.display = 'block';
    
    console.log('✅ AI configuration panel closed');
}

console.log('🚀 Updated Quick AI test functions loaded:');
console.log('- Run: quickAITestFixed() for complete test + open config panel');
console.log('- Run: closeAIConfig() to close the config panel');
console.log('');
console.log('🎯 Quick start: quickAITestFixed()');
