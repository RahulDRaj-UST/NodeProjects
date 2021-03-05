const mongoose = require('mongoose');

const model = require('../Models/book');

module.exports = {
  getAllBooks: function(req, res) {
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
  },
  getBookById: function(req, res) {
    model.findOne({ _id: req.params.id }, function(err, data) {
      if (err) {
        res.status(400);
        res.send({ error: 'Cant find the Requested Book' });
      } else {
        res.send(data);
      }
    });
  },
  addNewBook: function(req, res) {
    model.countDocuments({ name: { $eq: req.body.name } }, function(
      err,
      count
    ) {
      if (err) {
        res.send({ error: 'Insert Error' });
      } else {
        if (count == 0) {
          var mod = new model(req.body);
          mod.save(function(err, data) {
            if (err) {
              res.status(400);
              res.send({ error: 'Book exists already' });
            } else {
              res.send({ success: 'Book added Successfully..!!' });
            }
          });
        } else {
          res.status(400);
          res.send({ error: 'This book already Exists' });
        }
      }
    });
  },
  updateBook: function(req, res) {
    //var db = req.db;
    var bookToUpdate = req.params.id;
    model.countDocuments({ name: { $eq: req.body.name } }, function(
      err,
      count
    ) {
      if (err) {
        res.status(400);
        res.send({ error: 'Update Error' });
      } else {
        if (count > 0) {
          res.status(400);
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
              if (err != null) res.status(400);
              res.send(
                err === null
                  ? { success: 'Book Details updated successfully!' }
                  : { error: 'Update Error' }
              );
            }
          );
        }
      }
    });
  },
  deleteBookById: function(req, res) {
    model.countDocuments({ _id: { $eq: req.params.id } }, function(err, count) {
      if (err) {
        res.status(400);
        res.send({ error: 'Book does not exist' });
      } else {
        if (count == 0) {
          res.send({ error: 'No books Deleted' });
        } else {
          model.deleteOne({ _id: req.params.id }, function(err) {
            if (err) {
              res.send({ error: 'Deletion Error' });
            } else {
              res.send({ success: 'Book removed Successfully..!!' });
            }
          });
        }
      }
    });
  }
};
