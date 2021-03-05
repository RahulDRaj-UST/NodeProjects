var express = require('express');
var mongo = require('mongoose');
var bodyParser = require('body-parser');
var db = require('./config.js');

var app = express();
var port = process.env.port || 7777;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var studentSchema = new Schema(
  {
    name: { type: String },
    author: { type: String },
    price: { type: Number },
    date: { type: Date, trim: true },
    quantity: { type: Number }
  },
  { versionKey: false }
);

var model = mongoose.model('BookInfo', studentSchema, 'BookInfo');

//api for Insert data from database
app.post('/api/insertBook', function(req, res) {
  model.countDocuments({ name: { $eq: req.body.name } }, function(err, count) {
    if (err) {
      res.send({ error: 'Insert Error' });
    } else {
      if (count == 0) {
        var mod = new model(req.body);
        mod.save(function(err, data) {
          if (err) {
            res.send({ error: 'Book exists already' });
          } else {
            res.send({ success: 'Book added Successfully..!!' });
          }
        });
      } else {
        res.send({ error: 'This book already Exists' });
      }
    }
  });
});

//api for get data from database
app.get('/api/getAllBooks', function(req, res) {
  model.find({}, function(err, data) {
    if (err) {
      res.send({ error: 'No Books Found' });
    } else {
      model.countDocuments({}, function(err, count) {
        if (count == 0) res.send({ message: 'No books found' });
        else res.send(data);
      });
    }
  });
});

//api for get Book by ID
app.get('/api/getBookID/:id', function(req, res) {
  model.findOne({ _id: req.params.id }, function(err, data) {
    if (err) {
      res.send({ error: 'Cant find the Requested Book' });
    } else {
      res.send(data);
    }
  });
});

//api for Delete Books from database

app.delete('/api/deleteBook/:id', function(req, res) {
  model.countDocuments({ _id: { $eq: req.params.id } }, function(err, count) {
    if (err) {
      res.send({ error: 'Delete Error' });
    } else {
      if (count == 0) {
        res.send({ error: 'No books Deleted' });
      } else {
        model.deleteOne({ _id: req.params.id }, function(err) {
          if (err) {
            res.send({ error: 'Deletion Error' });
          } else {
            res.send({ Success: 'Book removed Successfully..!!' });
          }
        });
      }
    }
  });
});

//api for Update data from database
app.put('/api/updateBook/:id', function(req, res) {
  //var db = req.db;
  var bookToUpdate = req.params.id;
  model.countDocuments({ name: { $eq: req.body.name } }, function(err, count) {
    if (err) {
      res.send({ error: 'Update Error' });
    } else {
      if (count > 0) {
        res.send({ error: 'Book name Duplication' });
      } else {
        var objForUpdate = {};

        if (req.body.name != null) {
          objForUpdate.name = req.body.name;
        }
        objForUpdate.date = req.body.date;
        objForUpdate.price = req.body.price;
        objForUpdate.quantity = req.body.quantity;

        model.updateOne(
          { _id: req.params.id },
          { $set: objForUpdate },

          function(err, result) {
            res.send(
              err === null
                ? { Success: 'Book Details updated successfully!' }
                : { error: 'Update Error' }
            );
          }
        );
      }
    }
  });
});

//server stat on given port
app.listen(port, function() {
  console.log('server start on port' + port);
});
