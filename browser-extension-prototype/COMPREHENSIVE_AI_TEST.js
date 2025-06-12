// 🧪 COMPREHENSIVE AI SYSTEM TEST
// Run this after reloading the extension to verify Real AI Assistant is working

async function comprehensiveAITest() {
    console.log('🧪 COMPREHENSIVE AI SYSTEM TEST');
    console.log('=====================================');
    
    const results = {
        classLoaded: false,
        instanceCreated: false,
        initializationComplete: false,
        configUIWorking: false,
        storageAccess: false,
        manualCreationWorks: false
    };
    
    // Test 1: Class Loading
    console.log('\n📋 TEST 1: Class Loading');
    results.classLoaded = typeof window.RealAIAssistant !== 'undefined';
    console.log(`- RealAIAssistant class: ${results.classLoaded ? '✅' : '❌'}`);
    
    if (!results.classLoaded) {
        console.error('🚨 CRITICAL: RealAIAssistant class not loaded');
        console.log('💡 Check script loading order in popup.html');
        return results;
    }
    
    // Test 2: Global Instance
    console.log('\n📋 TEST 2: Global Instance');
    results.instanceCreated = !!window.realAIAssistant;
    console.log(`- window.realAIAssistant: ${results.instanceCreated ? '✅' : '❌'}`);
    
    if (results.instanceCreated) {
        console.log(`- Instance type: ${typeof window.realAIAssistant}`);
        console.log(`- Constructor name: ${window.realAIAssistant.constructor.name}`);
        console.log(`- Initialized flag: ${window.realAIAssistant.initialized}`);
        console.log(`- Available flag: ${window.realAIAssistant.isAvailable}`);
    }
    
    // Test 3: Manual Creation
    console.log('\n📋 TEST 3: Manual Creation Test');
    try {
        const testInstance = new RealAIAssistant();
        results.manualCreationWorks = true;
        console.log('- Manual creation: ✅ Success');
        console.log(`- Test instance initialized: ${testInstance.initialized}`);
        
        // Wait for initialization
        console.log('- Waiting for initialization...');
        await testInstance.waitForInitialization();
        console.log(`- Initialization completed: ✅`);
        console.log(`- Available after init: ${testInstance.isAvailable}`);
        
        window.testAIInstance = testInstance;
        
    } catch (error) {
        console.error('- Manual creation: ❌ Failed', error);
        results.manualCreationWorks = false;
    }
    
    // Test 4: Initialization Check
    console.log('\n📋 TEST 4: Initialization Status');
    if (window.realAIAssistant) {
        try {
            await window.realAIAssistant.waitForInitialization();
            results.initializationComplete = true;
            console.log('- Initialization: ✅ Complete');
            console.log(`- AI Available: ${window.realAIAssistant.isAvailable}`);
            console.log(`- Provider: ${window.realAIAssistant.currentProvider || 'None'}`);
        } catch (error) {
            console.error('- Initialization: ❌ Failed', error);
        }
    }
    
    // Test 5: Configuration UI
    console.log('\n📋 TEST 5: Configuration UI');
    const configBtn = document.getElementById('configure-ai');
    const configPanel = document.getElementById('ai-config-section');
    const showConfigFn = window.showAIConfiguration;
    
    results.configUIWorking = !!(configBtn && configPanel && showConfigFn);
    console.log(`- Config button: ${configBtn ? '✅' : '❌'}`);
    console.log(`- Config panel: ${configPanel ? '✅' : '❌'}`);
    console.log(`- Show config function: ${showConfigFn ? '✅' : '❌'}`);
    
    if (results.configUIWorking) {
        console.log('- Testing config panel toggle...');
        try {
            showConfigFn();
            console.log('- Config panel opened: ✅');
            // Close it
            if (configPanel.style.display !== 'none') {
                configPanel.style.display = 'none';
                console.log('- Config panel closed: ✅');
            }
        } catch (error) {
            console.error('- Config panel test failed:', error);
        }
    }
    
    // Test 6: Storage Access
    console.log('\n📋 TEST 6: Storage Access');
    try {
        const testStorage = await chrome.storage.local.get(['aiProvider', 'aiApiKey']);
        results.storageAccess = true;
        console.log('- Chrome storage: ✅ Accessible');
        console.log(`- Current config: ${JSON.stringify(testStorage)}`);
    } catch (error) {
        console.error('- Chrome storage: ❌ Failed', error);
        results.storageAccess = false;
    }
    
    // Test 7: Message Synthesis Test (Mock)
    console.log('\n📋 TEST 7: Message Synthesis Interface');
    if (window.realAIAssistant) {
        try {
            console.log('- Testing synthesis method availability...');
            const synthesisMethod = window.realAIAssistant.synthesizePersonalizedMessage;
            console.log(`- Synthesis method: ${typeof synthesisMethod === 'function' ? '✅' : '❌'}`);
            
            if (typeof synthesisMethod === 'function') {
                console.log('- Method signature appears correct ✅');
                console.log('💡 Note: Actual API testing requires valid API keys');
            }
        } catch (error) {
            console.error('- Synthesis method test failed:', error);
        }
    }
    
    // Summary Report
    console.log('\n📋 SUMMARY REPORT');
    console.log('=====================================');
    
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(Boolean).length;
    const successRate = (passedTests / totalTests * 100).toFixed(1);
    
    console.log(`✅ Tests Passed: ${passedTests}/${totalTests} (${successRate}%)`);
    
    Object.entries(results).forEach(([test, passed]) => {
        console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
    });
    
    // Recommendations
    console.log('\n🔧 RECOMMENDATIONS:');
    if (results.classLoaded && results.manualCreationWorks && !results.instanceCreated) {
        console.log('🔍 Class works but global instance missing:');
        console.log('  - Check popup.js DOMContentLoaded event');
        console.log('  - Look for JavaScript errors during initialization');
        console.log('  - Try: window.realAIAssistant = new RealAIAssistant()');
    } else if (!results.classLoaded) {
        console.log('🔍 Class not loaded:');
        console.log('  - Check real-ai-assistant.js script tag in popup.html');
        console.log('  - Verify script loading order');
        console.log('  - Check for syntax errors in real-ai-assistant.js');
    } else if (results.instanceCreated && results.initializationComplete) {
        console.log('🎉 Real AI Assistant is working correctly!');
        console.log('  - Ready for API key configuration');
        console.log('  - Ready for message synthesis testing');
    }
    
    return results;
}

// Quick fix for missing global instance
async function quickFixGlobalInstance() {
    console.log('🔧 ATTEMPTING QUICK FIX...');
    
    if (typeof RealAIAssistant !== 'undefined') {
        try {
            console.log('- Creating new RealAIAssistant instance...');
            const newInstance = new RealAIAssistant();
            
            console.log('- Waiting for initialization...');
            await newInstance.waitForInitialization();
            
            console.log('- Setting global reference...');
            window.realAIAssistant = newInstance;
            
            console.log('✅ Quick fix completed successfully!');
            console.log(`- Instance available: ${!!window.realAIAssistant}`);
            console.log(`- Initialized: ${window.realAIAssistant.initialized}`);
            console.log(`- AI Available: ${window.realAIAssistant.isAvailable}`);
            
            return true;
        } catch (error) {
            console.error('❌ Quick fix failed:', error);
            return false;
        }
    } else {
        console.error('❌ Cannot fix - RealAIAssistant class not available');
        return false;
    }
}

// Test specific AI functionality
async function testAIFunctionality() {
    console.log('🤖 TESTING AI FUNCTIONALITY');
    console.log('============================');
    
    if (!window.realAIAssistant) {
        console.log('❌ No realAIAssistant instance found');
        console.log('💡 Run quickFixGlobalInstance() first');
        return false;
    }
    
    const ai = window.realAIAssistant;
    
    console.log('📋 Instance Properties:');
    console.log(`- Initialized: ${ai.initialized}`);
    console.log(`- Available: ${ai.isAvailable}`);
    console.log(`- Provider: ${ai.currentProvider || 'None'}`);
    console.log(`- Has API Key: ${!!ai.apiKey}`);
    
    console.log('\n📋 Available Methods:');
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(ai))
        .filter(name => typeof ai[name] === 'function' && name !== 'constructor');
    methods.forEach(method => {
        console.log(`- ${method}: ✅`);
    });
    
    console.log('\n📋 Configuration Methods:');
    try {
        console.log(`- testConnection: ${typeof ai.testConnection === 'function' ? '✅' : '❌'}`);
        console.log(`- updateConfig: ${typeof ai.updateConfig === 'function' ? '✅' : '❌'}`);
        console.log(`- synthesizePersonalizedMessage: ${typeof ai.synthesizePersonalizedMessage === 'function' ? '✅' : '❌'}`);
    } catch (error) {
        console.error('Error testing methods:', error);
    }
    
    return true;
}

console.log('🧪 Comprehensive AI test functions loaded:');
console.log('- Run: comprehensiveAITest() for full system test');
console.log('- Run: quickFixGlobalInstance() to fix missing instance');
console.log('- Run: testAIFunctionality() to test AI methods');
console.log('');
console.log('🚀 Quick start: comprehensiveAITest()');
