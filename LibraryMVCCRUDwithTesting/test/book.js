//process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let Book = require('../Models/book');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe('Books API', () => {
  before(done => {
    //Empty the database
    Book.remove({}, err => {
      done();
    });
  });

  /*
   * Test the /POST
   */
  describe('/POST book', () => {
    it('it should POST a book ', done => {
      let book = {
        name: 'Book34',
        author: 'Author34',
        price: 34.4,
        date: '1994-11-12',
        quantity: 34
      };
      chai
        .request(server)
        .post('/books')
        .send(book)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have
            .property('success')
            .eql('Book added Successfully..!!');
          done();
        });
    });
    it('it should Not POST a book due to Name Duplication ', done => {
      let book = {
        name: 'Book34',
        author: 'Author34',
        price: 34.4,
        date: '1994-11-12',
        quantity: 34
      };
      chai
        .request(server)
        .post('/books')
        .send(book)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have
            .property('error')
            .eql('This book already Exists');
          done();
        });
    });
  });
  /*
   * Test the /GET/:id route
   */
  describe('/GET/:id book', () => {
    it('it should GET a book by the given id', done => {
      let book = new Book({
        name: 'BookNew',
        author: 'AuthorNew',
        price: 344.4,
        date: '1994-10-12',
        quantity: 66
      });
      book.save((err, book) => {
        chai
          .request(server)
          .get('/books/' + book.id)
          .send(book)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.should.have.property('author');
            res.body.should.have.property('price');
            res.body.should.have.property('date');
            res.body.should.have.property('quantity');
            res.body.should.have.property('_id').eql(book.id);
            done();
          });
      });
    });
    it('it should NOT GET a book with an invalid id', done => {
      let id = 123;
      chai
        .request(server)
        .get('/books/' + id)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have
            .property('error')
            .eql('Cant find the Requested Book');
          done();
        });
    });
  });
  /*
   * Test the /PUT/:id route
   */
  describe('/PUT/:id book', () => {
    it('it should UPDATE a book given the id', done => {
      let book = new Book({
        name: 'BookNew1',
        author: 'AuthorNew1',
        price: 3441.4,
        date: '1994-10-12',
        quantity: 77
      });
      book.save((err, book) => {
        chai
          .request(server)
          .put('/books/' + book.id)
          .send({
            date: '1993-11-12',
            price: 33.2,
            quantity: 13
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have
              .property('success')
              .eql('Book Details updated successfully!');
            done();
          });
      });
    });
    it('it should NOT UPDATE a book given the id due to name duplication', done => {
      let book = new Book({
        name: 'BookNew2',
        author: 'AuthorNew2',
        price: 34.4,
        date: '1991-10-12',
        quantity: 777
      });
      book.save((err, book) => {
        chai
          .request(server)
          .put('/books/' + book.id)
          .send({
            name: 'BookNew2',
            date: '1993-11-12',
            price: 33.2,
            quantity: 13
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error').eql('Book name Duplication');
            done();
          });
      });
    });
    it('it should NOT UPDATE a book with invalid ID', done => {
      let id = 123;
      chai
        .request(server)
        .put('/books/' + id)
        .send({
          date: '1993-11-12',
          price: 33.2,
          quantity: 13
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Update Error');
          done();
        });
    });
  });

  /*
   * Test the /GET route
   */
  describe('GET /books', () => {
    it('it should GET all the books', done => {
      chai
        .request(server)
        .get('/books')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.not.be.eql(0);
          done();
        });
    });
    it('it should NOT GET all the books with an incorrect link', done => {
      chai
        .request(server)
        .get('/book')
        .end((err, res) => {
          res.should.not.have.status(200);
          done();
        });
    });
  });
  /*
   * Test the /DELETE/:id route
   */
  describe('/DELETE/:id book', () => {
    it('it should DELETE a book given the id', done => {
      let book = new Book({
        name: 'BookNew3',
        author: 'AuthorNew3',
        price: 343.4,
        date: '1981-10-12',
        quantity: 7777
      });
      book.save((err, book) => {
        chai
          .request(server)
          .delete('/books/' + book.id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have
              .property('success')
              .eql('Book removed Successfully..!!');

            done();
          });
      });
    });

    it('it should NOT DELETE a book with invalid ID', done => {
      let id = 132;
      chai
        .request(server)
        .delete('/books/' + id)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.should.have.status(400);
          res.body.should.have.property('error').eql('Book does not exist');

          done();
        });
    });
  });
});
