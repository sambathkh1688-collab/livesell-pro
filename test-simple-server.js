const http = require('http');

console.log('🧪 Testing Simple Server on Port 5000...\n');

function testEndpoint(path, method = 'GET') {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log(`✅ ${path} (${res.statusCode}):`, JSON.stringify(jsonData, null, 2));
        } catch {
          console.log(`✅ ${path} (${res.statusCode}):`, data);
        }
        resolve({ success: true, status: res.statusCode });
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${path} failed:`, error.message);
      resolve({ success: false, error: error.message });
    });

    req.on('timeout', () => {
      console.log(`❌ ${path} timeout`);
      req.destroy();
      resolve({ success: false, error: 'timeout' });
    });

    req.end();
  });
}

async function runTests() {
  console.log('Testing available endpoints...\n');
  
  // Test health endpoint that should exist
  await testEndpoint('/health');
  await testEndpoint('/api/health');
  await testEndpoint('/');
  await testEndpoint('/api');
  
  console.log('\n🎯 Test completed!');
}

runTests();