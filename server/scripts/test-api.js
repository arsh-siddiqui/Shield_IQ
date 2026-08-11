const axios = require('axios');
const assert = require('assert');

const API_URL = 'http://localhost:5000/api';
let cookie = '';

async function runTests() {
  try {
    const api = axios.create({ baseURL: API_URL, withCredentials: true });
    
    // Add request interceptor to attach cookie
    api.interceptors.request.use(config => {
      if (cookie) config.headers.Cookie = cookie;
      return config;
    });

    // Add response interceptor to save cookie
    api.interceptors.response.use(response => {
      const setCookie = response.headers['set-cookie'];
      if (setCookie) {
         cookie = setCookie.join('; ');
      }
      return response;
    }, error => Promise.reject(error));

    console.log('Testing GET /health...');
    const health = await api.get('/health');
    assert.strictEqual(health.data.success, true);
    console.log('✔ Health check passed');

    console.log('Testing Register...');
    const randUser = `testuser${Date.now()}@example.com`;
    const regRes = await api.post('/auth/register', {
      name: 'Test User',
      email: randUser,
      password: 'Password123!',
      accountRole: 'Student'
    });
    assert.strictEqual(regRes.data.success, true);
    assert.strictEqual(regRes.data.data.user.email, randUser);
    console.log('✔ Register passed');

    console.log('Testing Login...');
    const loginRes = await api.post('/auth/login', {
      email: randUser,
      password: 'Password123!'
    });
    assert.strictEqual(loginRes.data.success, true);
    console.log('✔ Login passed');

    console.log('Testing Profile...');
    const profileRes = await api.get('/users/profile');
    assert.strictEqual(profileRes.data.success, true);
    assert.strictEqual(profileRes.data.data.user.email, randUser);
    console.log('✔ Profile passed');

    console.log('Testing Scan History Creation...');
    const scanRes = await api.post('/scan', {
      content: 'http://example.com',
      scanType: 'url'
    });
    assert.strictEqual(scanRes.data.success, true);
    console.log('✔ Scan History Creation passed');

    console.log('Testing Retrieve Scan History...');
    const historyRes = await api.get('/users/scans');
    assert.strictEqual(historyRes.data.success, true);
    assert(historyRes.data.data.scans.length >= 1);
    console.log('✔ Retrieve Scan History passed');

    console.log('Testing Topic Retrieval...');
    const topicRes = await api.get('/learn/topics');
    assert.strictEqual(topicRes.data.success, true);
    assert(topicRes.data.data.topics.length > 0);
    console.log('✔ Topic Retrieval passed');

    console.log('Testing Lesson Retrieval...');
    const lessonsRes = await api.get('/learn/lessons');
    assert.strictEqual(lessonsRes.data.success, true);
    assert(lessonsRes.data.data.lessons.length > 0);
    const lessonId = lessonsRes.data.data.lessons[0].slug;
    console.log('✔ Lesson Retrieval passed');

    console.log('Testing Lesson Progress Update...');
    const progressRes = await api.post(`/learn/lessons/${lessonId}/complete`);
    assert.strictEqual(progressRes.data.success, true);
    assert.strictEqual(progressRes.data.data.progress.status, 'completed');
    console.log('✔ Lesson Progress passed');

    console.log('Testing Simulation Retrieval...');
    const simsRes = await api.get('/simulations');
    assert.strictEqual(simsRes.data.success, true);
    assert(simsRes.data.data.simulations.length > 0);
    const simId = simsRes.data.data.simulations[0].slug;
    console.log('✔ Simulation Retrieval passed');

    console.log('Testing Simulation Attempt...');
    const attemptRes = await api.post(`/simulations/${simId}/submit`, { choice: 'open' });
    assert.strictEqual(attemptRes.data.success, true);
    console.log('✔ Simulation Attempt passed');

    console.log('Testing Quiz Result Submission...');
    const quizRes = await api.post('/quizzes/results', { lessonId: lessonId, correct: true });
    assert.strictEqual(quizRes.data.success, true);
    console.log('✔ Quiz Submit passed');

    console.log('Testing Quiz Results Retrieval...');
    const getQuizRes = await api.get('/quizzes/results');
    assert.strictEqual(getQuizRes.data.success, true);
    assert(getQuizRes.data.data.results.length > 0);
    console.log('✔ Quiz Results Retrieval passed');

    console.log('Testing Admin Auth (with non-admin user)...');
    try {
      await api.post('/quizzes', { title: 'Test' });
      console.log('❌ Admin Auth failed (should have thrown)');
      process.exit(1);
    } catch (e) {
      assert.strictEqual(e.response.status, 403);
      console.log('✔ Admin Auth correctly rejected non-admin');
    }

    // Now login as Admin to test successful Admin auth
    console.log('Testing Admin Auth (with admin user)...');
    const adminLogin = await api.post('/auth/login', {
       email: 'admin@shieldiq.app',
       password: 'ChangeMe123!'
    });
    assert.strictEqual(adminLogin.data.success, true);
    const adminTopics = await api.get('/learn/topics');
    assert.strictEqual(adminTopics.data.success, true);
    console.log('✔ Admin Auth with admin user passed');

    console.log('ALL TESTS PASSED SUCCESSFULLY 🎉');
  } catch (error) {
    console.error('TEST FAILED ❌');
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

runTests();
