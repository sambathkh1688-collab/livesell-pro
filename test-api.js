// Enhanced API testing for LiveSell Pro - Professional Facebook Live Commerce Platform
const http = require('http');

console.log('🚀 LiveSell Pro API Test Suite');
console.log('═══════════════════════════════════════════════════════════');

// Test configuration
const testConfig = {
  timeout: 10000,
  retries: 3,
  endpoints: [
    { name: 'Health Check', path: '/health', method: 'GET' },
    { name: 'API Root', path: '/api', method: 'GET' },
    { name: 'Auth Routes', path: '/api/auth', method: 'GET' },
    { name: 'Facebook Routes', path: '/api/facebook', method: 'GET' },
    { name: 'Dashboard Routes', path: '/api/dashboard', method: 'GET' }
  ]
};

// Enhanced test function with retry logic
async function testEndpoint(endpoint, retryCount = 0) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: endpoint.path,
      method: endpoint.method,
      timeout: testConfig.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'LiveSell-Pro-Test-Suite'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const result = {
          endpoint: endpoint.name,
          status: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 400,
          response: data,
          headers: res.headers
        };
        
        console.log(`${result.success ? '✅' : '❌'} ${endpoint.name}`);
        console.log(`   Status: ${result.status}`);
        console.log(`   Response: ${data.substring(0, 100)}${data.length > 100 ? '...' : ''}`);
        console.log('   ────────────────────────────────────');
        
        resolve(result);
      });
    });

    req.on('error', async (error) => {
      console.log(`❌ ${endpoint.name} - Error: ${error.message}`);
      
      if (retryCount < testConfig.retries) {
        console.log(`🔄 Retrying ${endpoint.name} (${retryCount + 1}/${testConfig.retries})`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return testEndpoint(endpoint, retryCount + 1).then(resolve).catch(reject);
      }
      
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout after ${testConfig.timeout}ms`));
    });

    req.end();
  });
}

// Run comprehensive test suite
async function runTestSuite() {
  const results = {
    passed: 0,
    failed: 0,
    total: 0,
    details: []
  };

  console.log(`\n🧪 Testing ${testConfig.endpoints.length} API endpoints...\n`);

  // Test server endpoints
  for (const endpoint of testConfig.endpoints) {
    try {
      const result = await testEndpoint(endpoint);
      results.total++;
      
      if (result.success) {
        results.passed++;
      } else {
        results.failed++;
      }
      
      results.details.push(result);
    } catch (error) {
      results.total++;
      results.failed++;
      results.details.push({
        endpoint: endpoint.name,
        success: false,
        error: error.message
      });
    }
  }

  // Generate report
  console.log('\n📊 Test Results Summary:');
  console.log('═══════════════════════════════════════');
  console.log(`✅ Passed: ${results.passed}/${results.total}`);
  console.log(`❌ Failed: ${results.failed}/${results.total}`);
  console.log(`📈 Success Rate: ${Math.round((results.passed / results.total) * 100)}%`);
  
  if (results.passed === results.total) {
    console.log('\n🎉 ALL TESTS PASSED! LiveSell Pro is ready!');
  } else {
    console.log('\n⚠️ Some tests failed. Check the logs above.');
  }

  console.log('\n🔗 Access Your Platform:');
  console.log(`   Landing Page: http://localhost:8080/Fbcomment/`);
  console.log(`   Client App:   http://localhost:3000`);
  console.log(`   API Server:   http://localhost:5000`);
}

// Test user registration
function testRegistration() {
  return new Promise((resolve, reject) => {
    const testUser = {
      email: 'test@livesellpro.com',
      password: 'SecurePassword123!',
      firstName: 'Test',
      lastName: 'User',
      organizationName: 'LiveSell Pro Test Org',
      phone: '+1234567890'
    };

    const postData = JSON.stringify(testUser);

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('✅ Registration Response:');
        console.log(`Status: ${res.statusCode}`);
        console.log(`Body: ${data}`);
        console.log('─────────────────────────────────────\n');
        resolve(data);
      });
    });

    req.on('error', (error) => {
      console.log('❌ Registration Failed:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Enhanced registration test
async function testRegistration() {
  console.log('\n� Testing User Registration...');
  
  const testUser = {
    firstName: 'LiveSell',
    lastName: 'Pro',
    email: `test-${Date.now()}@livesellpro.com`,
    password: 'SecurePassword123!',
    organizationName: 'LiveSell Pro Demo'
  };

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(testUser);
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ Registration Test - Status: ${res.statusCode}`);
        console.log(`📝 Response: ${data.substring(0, 150)}...`);
        console.log('────────────────────────────────────────────');
        resolve(data);
      });
    });

    req.on('error', (error) => {
      console.log('❌ Registration Test Failed:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Run all tests
async function main() {
  try {
    await runTestSuite();
    
    // Additional specific tests
    console.log('\n🎯 Running Specific Feature Tests...');
    await testRegistration();
    
    console.log('\n🚀 Test suite completed!');
    console.log('Ready to launch your professional platform! 💪');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  }
}

// Auto-run if called directly
if (require.main === module) {
  main();
}

module.exports = { testEndpoint, runTestSuite, testRegistration };