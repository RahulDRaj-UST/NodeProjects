const mongoose = require('mongoose');

module.exports = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    .then(() => {
      console.log('Mongodb connected....');
    })
    .catch(err => console.log(err.message));
};
