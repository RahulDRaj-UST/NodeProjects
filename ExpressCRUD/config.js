var mongo = require('mongoose');
var db = mongo.connect('mongodb://localhost:27017/express-crud', function(
  err,
  response
) {
  if (err) {
    console.log('Failed to connect to DB');
  } else {
    console.log('database connection is successful');
  }
});

module.exports = db;
