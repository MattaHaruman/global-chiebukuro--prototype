const fetch = require('node-fetch');

async function testQuestionAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'next-auth.session-token=test' // This will fail auth but we can see the error
      },
      body: JSON.stringify({
        title: 'Test Question',
        body: 'This is a test question body'
      })
    });

    const result = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

testQuestionAPI();