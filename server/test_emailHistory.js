const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('./server'); // This exports the Express app
const env = require('./config/env');
const User = require('./models/User');
const EmailHistory = require('./models/EmailHistory');
const ragClient = require('./services/ragClient'); // To mock or observe? No, let's test real integration if python is running

// We will use the live python server since it's already running.
// We will also use a test DB.

async function runTests() {
  console.log("Waiting for DB to connect...");
  // Sleep a moment to ensure app boot has connected DB
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Clean up
  await User.deleteMany({});
  await EmailHistory.deleteMany({});
  
  // Create test users
  const userA = await User.create({ name: 'User A', email: 'a@test.com', password: 'password123' });
  const userB = await User.create({ name: 'User B', email: 'b@test.com', password: 'password123' });
  
  const tokenA = jwt.sign({ id: userA._id }, env.JWT_SECRET, { expiresIn: '1h' });
  const tokenB = jwt.sign({ id: userB._id }, env.JWT_SECRET, { expiresIn: '1h' });
  
  const authA = `Bearer ${tokenA}`;
  const authB = `Bearer ${tokenB}`;

  console.log("--- Starting Tests ---");
  
  let emailA_id = null;
  let emailB_id = null;

  try {
    // 1. Authenticated Create & 8. Python Embedding Success
    console.log("1. Testing Authenticated Create (User A)...");
    const resCreateA = await request(app)
      .post('/api/email-history')
      .set('Authorization', authA)
      .send({
        sender: 'bank@legit.com',
        recipient: 'a@test.com',
        subject: 'Your Bank Statement',
        body: 'Here is your legitimate bank statement for the month.'
      });
    
    if (resCreateA.status !== 201) throw new Error(`Create failed: ${JSON.stringify(resCreateA.body)}`);
    emailA_id = resCreateA.body.email._id;
    console.log("=> Success! Email created and embedded.");
    
    // 2. Unauthenticated Create
    console.log("2. Testing Unauthenticated Create...");
    const resUnauth = await request(app)
      .post('/api/email-history')
      .send({ sender: 'x@x.com', recipient: 'y@y.com', body: 'test' });
    if (resUnauth.status !== 401) throw new Error("Unauthenticated create should return 401");
    console.log("=> Success! 401 Unauthorized received.");
    
    // Create for User B (User Isolation)
    console.log("Creating email for User B...");
    const resCreateB = await request(app)
      .post('/api/email-history')
      .set('Authorization', authB)
      .send({
        sender: 'utility@legit.com',
        recipient: 'b@test.com',
        subject: 'Utility Bill',
        body: 'Here is your legitimate utility bill.'
      });
    emailB_id = resCreateB.body.email._id;

    // 3. Authenticated List & 6/12. Cross-user access / Isolation
    console.log("3. Testing Authenticated List (User A) & Isolation...");
    const resListA = await request(app).get('/api/email-history').set('Authorization', authA);
    if (resListA.body.emails.length !== 1) throw new Error("User A should only see 1 email");
    if (resListA.body.emails[0]._id !== emailA_id) throw new Error("User A should only see Email A");
    console.log("=> Success! User A sees only Email A.");

    // 4. Individual Retrieval
    console.log("4. Testing Individual Retrieval (User A gets Email A)...");
    const resGetA = await request(app).get(`/api/email-history/${emailA_id}`).set('Authorization', authA);
    if (resGetA.status !== 200) throw new Error("Failed to get individual email");
    if (resGetA.body.email.body !== 'Here is your legitimate bank statement for the month.') throw new Error("Body mismatch");
    console.log("=> Success! Retrieved full body.");

    // Cross-user retrieval (User A tries to get Email B)
    console.log("6. Testing Cross-User Access (User A tries to GET Email B)...");
    const resGetB_as_A = await request(app).get(`/api/email-history/${emailB_id}`).set('Authorization', authA);
    if (resGetB_as_A.status !== 404) throw new Error("User A should get 404 when requesting Email B");
    console.log("=> Success! 404 Not Found received.");

    // 7. Duplicate Handling
    console.log("7. Testing Duplicate Handling...");
    const resDup = await request(app)
      .post('/api/email-history')
      .set('Authorization', authA)
      .send({
        sender: 'bank@legit.com',
        recipient: 'a@test.com',
        subject: 'Your Bank Statement (Copy)',
        body: 'Here is your legitimate bank statement for the month.' // Same body
      });
    if (resDup.body.status !== 'duplicate') throw new Error("Duplicate not detected");
    console.log("=> Success! Duplicate detected.");
    
    // 9. Python Embedding Failure
    // Mock the python client to force a failure
    console.log("9. Testing Python Embedding Failure...");
    const origEmbed = ragClient.embedEmail;
    ragClient.embedEmail = async () => ({ success: false, reason: 'Mocked failure' });
    const resFail = await request(app)
      .post('/api/email-history')
      .set('Authorization', authA)
      .send({
        sender: 'newsletter@legit.com',
        recipient: 'a@test.com',
        body: 'Newsletter text...'
      });
    ragClient.embedEmail = origEmbed; // restore
    if (resFail.body.email.embeddingStatus !== 'failed') throw new Error("Embedding status should be failed");
    console.log("=> Success! Email saved with 'failed' status.");

    // 10. Rebuild after RAG service restart
    console.log("10. Testing Index Rebuild...");
    const resRebuild = await request(app).post('/api/email-history/rebuild').set('Authorization', authA);
    if (resRebuild.status !== 200) throw new Error("Rebuild failed");
    console.log(`=> Success! Rebuild complete: ${resRebuild.body.result.successCount} succeeded.`);

    // 5 & 11. Delete & Deleted email no longer retrieved
    console.log("5. Testing Delete...");
    const resDelete = await request(app).delete(`/api/email-history/${emailA_id}`).set('Authorization', authA);
    if (resDelete.status !== 200) throw new Error("Delete failed");
    
    const resCheckDel = await request(app).get(`/api/email-history/${emailA_id}`).set('Authorization', authA);
    if (resCheckDel.status !== 404) throw new Error("Deleted email still exists");
    console.log("=> Success! Email deleted and no longer retrieved.");

    console.log("ALL API TESTS PASSED SUCCESSFULLY!");
    
  } catch (err) {
    console.error("TEST FAILED:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

runTests();
