const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/detectiq')
  .then(async () => {
    const User = mongoose.connection.collection('users');
    const users = await User.find().toArray();
    let fixed = 0;
    for (const u of users) {
      if (typeof u.email === 'string') {
        const cleaned = u.email.toLowerCase().trim();
        if (u.email !== cleaned) {
          await User.updateOne({ _id: u._id }, { $set: { email: cleaned } });
          console.log(`Fixed email: "${u.email}" -> "${cleaned}"`);
          fixed++;
        }
      }
    }
    console.log(`Done cleaning DB. Fixed ${fixed} users.`);
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
