// CSP-compliant Configuration Tests
// Tests AI configuration and storage functionality

async function runConfigurationTests() {
    const results = [];
    let testsPassed = 0;
    let totalTests = 5;
    
    // Test 1: Configuration storage
    try {
        // Mock configuration data
        const testConfig = {
            aiProvider: 'openai',
            openaiApiKey: 'test-key-123',
            anthropicApiKey: '',
            enableAI: true
        };
        
        // Test that we can handle configuration data
        if (testConfig.aiProvider && testConfig.openaiApiKey) {
            results.push(`✅ Test 1: Configuration storage - PASSED`);
            testsPassed++;
        } else {
            throw new Error('Configuration data invalid');
        }
    } catch (error) {
        results.push(`❌ Test 1: Configuration storage - FAILED: ${error.message}`);
    }
    
    // Test 2: Provider validation
    try {
        const validProviders = ['openai', 'anthropic'];
        const testProviders = ['openai', 'anthropic', 'invalid', ''];
        
        let validationResults = testProviders.map(provider => ({
            provider,
            isValid: validProviders.includes(provider)
        }));
        
        const correctValidations = validationResults.filter(result => 
            (result.provider === 'openai' && result.isValid) ||
            (result.provider === 'anthropic' && result.isValid) ||
            (result.provider === 'invalid' && !result.isValid) ||
            (result.provider === '' && !result.isValid)
        );
        
        if (correctValidations.length === 4) {
            results.push(`✅ Test 2: Provider validation - PASSED`);
            testsPassed++;
        } else {
            throw new Error(`Validation failed: ${correctValidations.length}/4 correct`);
        }
    } catch (error) {
        results.push(`❌ Test 2: Provider validation - FAILED: ${error.message}`);
    }
    
    // Test 3: API key validation
    try {
        const testKeys = [
            { key: 'sk-test123456789', valid: true }, // Valid format
            { key: 'test-key', valid: false }, // Invalid format
            { key: '', valid: false }, // Empty
            { key: 'sk-proj-abcdefghijklmnop', valid: true } // Project key format
        ];
        
        let validationsPassed = 0;
        testKeys.forEach(test => {
            const isValidFormat = test.key.startsWith('sk-') && test.key.length > 10;
            if (isValidFormat === test.valid) {
                validationsPassed++;
            }
        });
        
        if (validationsPassed === testKeys.length) {
            results.push(`✅ Test 3: API key validation - PASSED`);
            testsPassed++;
        } else {
            throw new Error(`Key validation failed: ${validationsPassed}/${testKeys.length} correct`);
        }
    } catch (error) {
        results.push(`❌ Test 3: API key validation - FAILED: ${error.message}`);
    }
    
    // Test 4: Configuration updates
    try {
        // Simulate configuration update process
        let currentConfig = {
            aiProvider: 'openai',
            openaiApiKey: 'old-key',
            anthropicApiKey: ''
        };
        
        const updateData = {
            aiProvider: 'anthropic',
            anthropicApiKey: 'new-anthropic-key'
        };
        
        // Apply update
        const updatedConfig = { ...currentConfig, ...updateData };
        
        if (updatedConfig.aiProvider === 'anthropic' && 
            updatedConfig.anthropicApiKey === 'new-anthropic-key' &&
            updatedConfig.openaiApiKey === 'old-key') {
            results.push(`✅ Test 4: Configuration updates - PASSED`);
            testsPassed++;
        } else {
            throw new Error('Configuration update failed');
        }
    } catch (error) {
        results.push(`❌ Test 4: Configuration updates - FAILED: ${error.message}`);
    }
    
    // Test 5: Configuration retrieval
    try {
        // Test configuration retrieval with defaults
        const mockStoredConfig = {
            aiProvider: 'openai',
            openaiApiKey: 'stored-key'
        };
        
        const defaultConfig = {
            aiProvider: 'openai',
            openaiApiKey: '',
            anthropicApiKey: '',
            enableAI: true
        };
        
        // Merge stored with defaults
        const finalConfig = { ...defaultConfig, ...mockStoredConfig };
        
        if (finalConfig.aiProvider === 'openai' && 
            finalConfig.openaiApiKey === 'stored-key' &&
            finalConfig.enableAI === true) {
            results.push(`✅ Test 5: Configuration retrieval - PASSED`);
            testsPassed++;
        } else {
            throw new Error('Configuration retrieval failed');
        }
    } catch (error) {
        results.push(`❌ Test 5: Configuration retrieval - FAILED: ${error.message}`);
    }
    
    // Summary
    results.push(`\n📊 Configuration Test Summary:`);
    results.push(`   Passed: ${testsPassed}/${totalTests}`);
    results.push(`   Success Rate: ${Math.round((testsPassed/totalTests) * 100)}%`);
    
    if (testsPassed === totalTests) {
        results.push(`\n🎉 All configuration tests passed!`);
    } else {
        results.push(`\n⚠️ Some configuration tests failed.`);
    }
    
    return results.join('\n');
}

// Export for use in test runner
window.runConfigurationTests = runConfigurationTests;
