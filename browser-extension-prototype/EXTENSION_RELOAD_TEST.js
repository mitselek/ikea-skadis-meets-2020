// 🧪 EXTENSION RELOAD TEST
// Run this in the popup console after reloading the extension
// Copy and paste this entire function and then run: testExtensionReload()

function testExtensionReload() {
    console.log('🧪 TESTING EXTENSION AFTER RELOAD...');
    console.log('================================================');
    
    // 1. Test script loading order
    console.log('\n🔍 SCRIPT LOADING CHECK:');
    console.log('- RealAIAssistant class:', typeof window.RealAIAssistant !== 'undefined' ? '✅' : '❌');
    console.log('- ProspectsManager class:', typeof window.ProspectsManager !== 'undefined' ? '✅' : '❌');
    console.log('- MessagingManager class:', typeof window.MessagingManager !== 'undefined' ? '✅' : '❌');
    
    // 2. Test global instances
    console.log('\n🔍 GLOBAL INSTANCES CHECK:');
    console.log('- window.realAIAssistant:', window.realAIAssistant ? '✅' : '❌');
    console.log('- window.prospectsManager:', window.prospectsManager ? '✅' : '❌');
    console.log('- window.messagingManager:', window.messagingManager ? '✅' : '❌');
    
    // 3. Test local variables (if accessible)
    console.log('\n🔍 LOCAL VARIABLES CHECK:');
    try {
        console.log('- realAIAssistant (local):', typeof realAIAssistant !== 'undefined' ? realAIAssistant : '❌ Not accessible');
    } catch (e) {
        console.log('- realAIAssistant (local): ❌ Not accessible (', e.message, ')');
    }
    
    // 4. Test Real AI Assistant creation manually
    console.log('\n🔍 MANUAL REAL AI CREATION TEST:');
    try {
        const testRealAI = new RealAIAssistant();
        console.log('- Manual creation: ✅ Success');
        console.log('- Test instance type:', typeof testRealAI);
        console.log('- Test instance methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(testRealAI)));
        
        // Assign to window for testing
        window.testRealAI = testRealAI;
        console.log('- Assigned to window.testRealAI: ✅');
        
    } catch (error) {
        console.log('- Manual creation: ❌ Failed -', error.message);
        console.error('Creation error:', error);
    }
    
    // 5. Test configuration functions
    console.log('\n🔍 CONFIGURATION FUNCTIONS CHECK:');
    console.log('- showAIConfiguration:', typeof window.showAIConfiguration !== 'undefined' ? '✅' : '❌');
    console.log('- testAISystem:', typeof window.testAISystem !== 'undefined' ? '✅' : '❌');
    console.log('- debugAIConfig:', typeof window.debugAIConfig !== 'undefined' ? '✅' : '❌');
    
    // 6. Test UI elements
    console.log('\n🔍 UI ELEMENTS CHECK:');
    const aiConfigBtn = document.getElementById('ai-config-btn');
    const aiConfigPanel = document.getElementById('ai-config-panel');
    console.log('- AI Config Button:', aiConfigBtn ? '✅' : '❌');
    console.log('- AI Config Panel:', aiConfigPanel ? '✅' : '❌');
    
    // 7. Test chrome storage
    console.log('\n🔍 STORAGE CHECK:');
    if (chrome && chrome.storage) {
        chrome.storage.local.get(['aiConfig'], (result) => {
            console.log('- Chrome storage access: ✅');
            console.log('- Current AI config:', result.aiConfig || 'None found');
        });
    } else {
        console.log('- Chrome storage access: ❌ Not available');
    }
    
    // 8. Summary and recommendations
    console.log('\n📋 SUMMARY & RECOMMENDATIONS:');
    console.log('================================================');
    
    if (typeof window.RealAIAssistant === 'undefined') {
        console.log('🚨 CRITICAL: RealAIAssistant class not loaded - check script loading');
    } else if (!window.realAIAssistant) {
        console.log('⚠️  WARNING: RealAIAssistant class exists but instance not created');
        console.log('💡 SOLUTION: Check popup.js initialization and error handling');
    } else {
        console.log('✅ SUCCESS: RealAIAssistant appears to be working correctly');
    }
    
    console.log('\n🔧 NEXT STEPS:');
    console.log('1. If class is missing: Check real-ai-assistant.js loading');
    console.log('2. If instance is missing: Check popup.js DOMContentLoaded event');
    console.log('3. If working: Run window.testAISystem() for full test');
    console.log('4. Test AI config with: window.showAIConfiguration()');
    
    return {
        classExists: typeof window.RealAIAssistant !== 'undefined',
        instanceExists: !!window.realAIAssistant,
        uiReady: !!(aiConfigBtn && aiConfigPanel),
        storageReady: !!(chrome && chrome.storage)
    };
}

// Also create a quick instance check function
function quickInstanceCheck() {
    console.log('🚀 Quick Instance Check:');
    console.log('- RealAIAssistant class:', typeof window.RealAIAssistant);
    console.log('- realAIAssistant instance:', window.realAIAssistant);
    console.log('- Test manual creation:', () => {
        try {
            const test = new RealAIAssistant();
            return 'SUCCESS';
        } catch (e) {
            return 'FAILED: ' + e.message;
        }
    });
    
    if (window.realAIAssistant) {
        console.log('✅ Instance exists - AI integration ready!');
    } else if (typeof window.RealAIAssistant !== 'undefined') {
        console.log('⚠️  Class exists but instance missing - check initialization');
    } else {
        console.log('❌ Class not loaded - check script loading order');
    }
}

console.log('🧪 Extension reload test functions loaded:');
console.log('- Run: testExtensionReload() for comprehensive test');
console.log('- Run: quickInstanceCheck() for quick check');
