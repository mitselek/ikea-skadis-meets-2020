/*
🚀 QUICK AI TEST - Copy and paste this entire block into the popup console

This single block will test and fix the Real AI Assistant integration.
After reloading the extension, paste this and run: quickAITest()
*/

async function quickAITest() {
    console.log('🚀 QUICK AI TEST STARTING...');
    
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
    
    // Test configuration UI
    const configBtn = document.getElementById('configure-ai');
    const configPanel = document.getElementById('ai-config-section');
    console.log(`${configBtn ? '✅' : '❌'} Config button`);
    console.log(`${configPanel ? '✅' : '❌'} Config panel`);
    console.log(`${typeof window.showAIConfiguration === 'function' ? '✅' : '❌'} Show config function`);
    
    // Test AI instance
    const ai = window.realAIAssistant;
    console.log(`${ai.initialized ? '✅' : '❌'} AI initialized`);
    console.log(`${ai.isAvailable ? '✅' : '⚠️'} AI available (${ai.isAvailable ? 'configured' : 'needs API key'})`);
    console.log(`Provider: ${ai.currentProvider || 'None configured'}`);
    
    // Summary
    const working = !!(
        typeof RealAIAssistant !== 'undefined' &&
        window.realAIAssistant &&
        ai.initialized &&
        configBtn &&
        configPanel &&
        typeof window.showAIConfiguration === 'function'
    );
    
    console.log('\n🎯 RESULT:', working ? '✅ AI SYSTEM WORKING!' : '❌ Issues found');
    
    if (working) {
        console.log('💡 Ready to configure API keys with: window.showAIConfiguration()');
        console.log('💡 Test message synthesis after API key setup');
    }
    
    return working;
}

// Auto-run on paste (optional)
console.log('🚀 Quick AI test function loaded. Run: quickAITest()');
