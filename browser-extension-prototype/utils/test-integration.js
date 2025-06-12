/*
🎯 FINAL AI INTEGRATION TEST
Complete end-to-end test of the Real AI Assistant integration
*/

async function runFinalIntegrationTest() {
    console.log('🎯 RUNNING FINAL AI INTEGRATION TEST...');
    console.log('='.repeat(50));
    
    const results = {
        configurationTest: false,
        apiConnectionTest: false,
        realAIInstanceTest: false,
        messageSynthesisTest: false,
        uiIntegrationTest: false
    };
    
    try {
        // 1. Test Configuration Storage
        console.log('\n1️⃣ TESTING CONFIGURATION STORAGE...');
        
        const config = await new Promise(resolve => {
            chrome.storage.local.get(['aiProvider', 'aiApiKey'], resolve);
        });
        
        if (config.aiProvider === 'openai' && config.aiApiKey && config.aiApiKey.startsWith('sk-proj-')) {
            console.log('✅ Configuration stored correctly');
            console.log(`   Provider: ${config.aiProvider}`);
            console.log(`   Key format: ${config.aiApiKey.substring(0, 15)}...`);
            results.configurationTest = true;
        } else {
            console.log('❌ Configuration not found or invalid');
            console.log('   Run configureOpenAIKey() first');
        }
        
        // 2. Test API Connection
        console.log('\n2️⃣ TESTING API CONNECTION...');
        
        if (config.aiApiKey) {
            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${config.aiApiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'gpt-4',
                        messages: [{ role: 'user', content: 'Test' }],
                        max_tokens: 10
                    })
                });
                
                if (response.ok) {
                    console.log('✅ API connection successful');
                    results.apiConnectionTest = true;
                } else {
                    console.log(`❌ API connection failed: ${response.status}`);
                }
            } catch (error) {
                console.log('❌ API connection error:', error.message);
            }
        }
        
        // 3. Test RealAIAssistant Instance
        console.log('\n3️⃣ TESTING REAL AI ASSISTANT INSTANCE...');
        
        try {
            if (typeof RealAIAssistant !== 'undefined') {
                const aiAssistant = new RealAIAssistant();
                await aiAssistant.waitForInitialization();
                
                if (aiAssistant.isConfigured()) {
                    console.log('✅ RealAIAssistant instance created and configured');
                    console.log(`   Provider: ${aiAssistant.provider}`);
                    results.realAIInstanceTest = true;
                } else {
                    console.log('❌ RealAIAssistant not properly configured');
                }
            } else {
                console.log('❌ RealAIAssistant class not found');
                console.log('   Make sure real-ai-assistant.js is loaded');
            }
        } catch (error) {
            console.log('❌ RealAIAssistant instance error:', error.message);
        }
        
        // 4. Test Message Synthesis
        console.log('\n4️⃣ TESTING MESSAGE SYNTHESIS...');
        
        try {
            if (results.realAIInstanceTest) {
                const aiAssistant = new RealAIAssistant();
                await aiAssistant.waitForInitialization();
                
                const testData = {
                    prospect: {
                        name: 'Test User',
                        handle: 'testuser',
                        bio: 'Maker and designer who loves creative projects',
                        recentComments: [
                            'This is such a cool design! Love the minimalist approach.',
                            'Great use of space in this workshop setup.'
                        ]
                    },
                    projectType: 'workshop organization',
                    userContext: 'SKÅDIS pegboard organizer'
                };
                
                console.log('   Generating test message...');
                const message = await aiAssistant.synthesizePersonalizedMessage(testData);
                
                if (message && message.length > 50) {
                    console.log('✅ Message synthesis successful');
                    console.log(`   Generated ${message.length} characters`);
                    console.log(`   Preview: "${message.substring(0, 100)}..."`);
                    results.messageSynthesisTest = true;
                } else {
                    console.log('❌ Message synthesis failed or too short');
                }
            } else {
                console.log('⏭️ Skipping message synthesis (AI instance not ready)');
            }
        } catch (error) {
            console.log('❌ Message synthesis error:', error.message);
        }
        
        // 5. Test UI Integration
        console.log('\n5️⃣ TESTING UI INTEGRATION...');
        
        const uiElements = {
            configSection: document.getElementById('ai-config-section'),
            providerSelect: document.getElementById('ai-provider'),
            apiKeyInput: document.getElementById('ai-api-key'),
            saveButton: document.getElementById('save-ai-config'),
            testButton: document.getElementById('test-ai-connection'),
            configureButton: document.getElementById('configure-ai')
        };
        
        let uiElementsFound = 0;
        for (const [name, element] of Object.entries(uiElements)) {
            if (element) {
                console.log(`   ✅ ${name}: Found`);
                uiElementsFound++;
            } else {
                console.log(`   ❌ ${name}: Not found`);
            }
        }
        
        if (uiElementsFound >= 4) {
            console.log('✅ UI integration looks good');
            results.uiIntegrationTest = true;
        } else {
            console.log('❌ UI integration incomplete');
        }
        
        // Final Results
        console.log('\n🏆 FINAL TEST RESULTS:');
        console.log('='.repeat(50));
        
        const passed = Object.values(results).filter(Boolean).length;
        const total = Object.keys(results).length;
        
        for (const [test, passed] of Object.entries(results)) {
            console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
        }
        
        console.log('\n📊 SUMMARY:');
        console.log(`   Tests Passed: ${passed}/${total}`);
        console.log(`   Overall Status: ${passed === total ? '🎉 ALL TESTS PASSED!' : '⚠️ SOME TESTS FAILED'}`);
        
        if (passed === total) {
            console.log('\n🚀 REAL AI ASSISTANT INTEGRATION COMPLETE!');
            console.log('✨ Your extension is now powered by AI');
            console.log('💬 AI-generated personalized messages are ready to use');
            console.log('\n🎯 Next steps:');
            console.log('   1. Visit a maker\'s page with comments');
            console.log('   2. Use the extension to generate personalized messages');
            console.log('   3. Enjoy authentic maker-to-maker conversations!');
        } else {
            console.log('\n🔧 Issues to resolve:');
            if (!results.configurationTest) console.log('   - Run configureOpenAIKey() to set up API key');
            if (!results.apiConnectionTest) console.log('   - Check API key validity and network connection');
            if (!results.realAIInstanceTest) console.log('   - Verify real-ai-assistant.js is loaded');
            if (!results.messageSynthesisTest) console.log('   - Debug AI message generation');
            if (!results.uiIntegrationTest) console.log('   - Check popup.html UI elements');
        }
        
        return results;
        
    } catch (error) {
        console.error('❌ Integration test failed:', error);
        return results;
    }
}

function quickTestSuite() {
    console.log('🚀 QUICK TEST SUITE FUNCTIONS:');
    console.log('');
    console.log('🎯 runFinalIntegrationTest() - Complete end-to-end test');
    console.log('📝 runTemplateMessagingTest() - Template system test');
    console.log('🔧 configureOpenAIKey() - Set up API key');
    console.log('🧪 testOpenAIConnection() - Test API connection');
    console.log('🔍 quickConfigGuide() - Show setup guide');
    console.log('');
    console.log('📋 Recommended order:');
    console.log('1. configureOpenAIKey()');
    console.log('2. runFinalIntegrationTest()');
    console.log('3. runTemplateMessagingTest() - Test fallback system');
    console.log('');
    console.log('💡 Load template test: eval(await fetch("./utils/test-template-messaging.js").then(r => r.text()))');
}

// Auto-run guide
console.log('🎯 Final AI Integration Test Loaded');
console.log('');
console.log('🚀 Ready to test! Run: runFinalIntegrationTest()');
console.log('📝 For template testing: Load test-template-messaging.js');
console.log('');
quickTestSuite();
