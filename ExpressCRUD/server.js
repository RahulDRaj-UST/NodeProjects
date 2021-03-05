var express = require('express');
var mongo = require('mongoose');
var bodyParser = require('body-parser');
var db = require('./config.js');

var app = express();
var port = process.env.port || 7777;
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var studentSchema = new Schema(
  {
    name: { type: String },
    address: { type: String },
    email: { type: String },
    contact: { type: String }
  },
  { versionKey: false }
);

var model = mongoose.model('student', studentSchema, 'student');

//api for Insert data from database
app.post('/api/savedata', function(req, res) {
  var mod = new model(req.body);
  mod.save(function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send({ data: 'Record has been Inserted..!!' });
    }
  });
});

//api for get data from database
app.get('/api/getdata', function(req, res) {
  model.find({}, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

//api for Delete data from database

app.delete('/api/Removedata/:id', function(req, res) {
  model.deleteOne({ _id: req.params.id }, function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send({ data: 'Record has been Deleted..!!' });
    }
  });
});

//api for Update data from database
app.put('/api/updateuser/:id', function(req, res) {
  var db = req.db;
  var userToUpdate = req.params.id;
  model.update({ _id: userToUpdate }, req.body, function(err, result) {
    res.send(
      err === null ? { data: 'Data updated successfully!' } : { msg: err }
    );
  });
});

//server stat on given port
app.listen(port, function() {
  console.log('server start on port' + port);
});
