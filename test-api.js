const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('Testing API route...');

    // Test with a simple JSON request
    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'a simple test image of a red apple'
      })
    });

    console.log('Response status:', response.status);

    if (response.ok) {
      const result = await response.json();
      console.log('API test successful!');
      console.log('Result:', result);
    } else {
      const error = await response.text();
      console.log('API test failed:', error);
    }
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testAPI();
