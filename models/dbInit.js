const mongoose = require('mongoose');

mongoose.connect(`${process.env.DB_URL}/bigbraintime`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}, (err) => {
  if (!err) {
    console.log('Connected to DB successfully');
  } else {
    console.log(`Error in DB connection ${err}`);
  }
});

// || 'mongodb://localhost:27017/bigbraintime'
