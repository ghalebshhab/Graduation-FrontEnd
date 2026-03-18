const axios = require('axios');
async function test() {
  try {
    let email = 'test' + Date.now() + '@test.com';
    let username = 'testuser' + Date.now();
    
    const loginRes = await axios.post('http://localhost:8080/api/auth/login', { 
      email: 'a@a.com', password: '123' 
    }, { validateStatus: false });
    
    let token = loginRes.data.token || loginRes.data.jwt || '';
    if (!token && loginRes.headers.authorization) token = loginRes.headers.authorization;
    if (token && !token.startsWith('Bearer ')) token = 'Bearer ' + token;
    
    const userRes = await axios.get('http://localhost:8080/api/users/1', { 
      headers: { Authorization: token },
      validateStatus: false 
    });
    console.log('USER_JSON:', JSON.stringify(userRes.data, null, 2));
  } catch (e) {
    console.error(e.message);
  }
}
test();
