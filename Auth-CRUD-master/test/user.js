const request = require('supertest');
const expect = require('chai').expect;

/*let { helloword } = require('../testFunctions');
const testFunctions = require('../testFunctions');
helloword = testFunctions.helloword();*/
const server = require('../index');
var app = request.agent(server);
var token = '',
  savedId = '',
  rand = Math.floor(Math.random() * Math.floor(99999));

/*describe("Test functions", function(){
    describe("helloWorld()", function(){
       it("Result should be return Hi shankar", function(){
           expect(helloword).to.equal("Hi shankar");
       });   
    });
});*/
describe('API Test:', function() {
  //Test cases for Auth
  describe('POST /user/auth Get admin user token check', function() {
    it('Check admin login and generate Token', function(done) {
      app
        .post('/user/auth')
        .send({ username: 'admin@example.com', password: 'admin@123' })
        .end((err, res) => {
          expect(res.status).to.eql(200);
          expect(res.body.success).to.equal(true);
          expect(res.body).to.be.an('object');
          token = res.body.data.token;
          done();
        });
    });
  });
  //Test cases for create users
  describe('POST /user/create Adding new user check', function() {
    it('With valid inputs params', function(done) {
      app
        .post('/users/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'KannanTestCases' + rand + '@gmail.com',
          password: '1234567',
          mobile: '13' + rand,
          address: '1' + rand,
          pincode: '1' + rand
        })
        .end((err, res) => {
          expect(res.status).to.eql(200);
          expect(res.body.success).to.equal(true);
          expect(res.body).to.be.an('object');
          savedId = res.body.data.userId;
          done();
        });
    });
    it('With invalid inputs params', function(done) {
      app
        .post('/users/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: '', password: '1234567' })
        .end((err, res) => {
          expect(res.status).to.eql(422);
          expect(res.body.success).to.equal(false);
          expect(res.body).to.be.an('object');
          done();
        });
    });
    it('With existing user inputs params', function(done) {
      app
        .post('/users/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'shankar@gmail.com', password: '1234567' })
        .end((err, res) => {
          expect(res.status).to.eql(409);
          expect(res.body.success).to.equal(false);
          expect(res.body).to.be.an('object');
          done();
        });
    });
  });
  // Test cases for get all users
  describe('GET /users Get allUsers check', function() {
    it('Should get allusers', function(done) {
      app
        .get('/users/allusers')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.eql(200);
          expect(res.body.success).to.equal(true);
          expect(res.body).to.be.an('object');
          done();
        });
    });
  });

  //other test cases  here

  // Test cases for getting a selected user
  describe('GET /users/getUser  ', function() {
    it('Should get a particular user with valid ID', function(done) {
      app
        .get('/users/getUser/' + savedId)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.eql(200);
          expect(res.body.success).to.equal(true);
          expect(res.body).to.be.an('object');
          done();
        });
    });

    it('Should Not get a particular user with invalid User Id', function(done) {
      app
        .get('/users/getUser/60')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.eql(500);
          expect(res.body.success).to.equal(false);
          expect(res.body).to.be.an('object');
          done();
        });
    });
  });

  //Test cases for Updating user
  describe('PUT /user/create Adding new user check', function() {
    it('With valid update params', function(done) {
      app
        .put('/users/update/' + savedId)
        .set('Authorization', `Bearer ${token}`)
        .send({
          mobile: '13' + rand,
          address: '1' + rand,
          pincode: '1' + rand
        })
        .end((err, res) => {
          expect(res.status).to.eql(200);
          expect(res.body.success).to.equal(true);
          expect(res.body).to.be.an('object');
          done();
        });
    });
    it('With invalid inputs params', function(done) {
      app
        .put('/users/update/602')
        .set('Authorization', `Bearer ${token}`)
        .send({
          mobile: '13' + rand,
          address: '1' + rand,
          pincode: '1' + rand
        })
        .end((err, res) => {
          expect(res.status).to.eql(500);
          expect(res.body.success).to.equal(false);
          expect(res.body).to.be.an('object');
          done();
        });
    });
  });

  //test cases for remove user
  describe('DELETE /users/removeUser/:userId check', function() {
    it('Should delete users', function(done) {
      app
        .delete('/users/removeUser/' + savedId)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.eql(200);
          expect(res.body.success).to.equal(true);
          expect(res.body).to.be.an('object');
          done();
        });
    });
    it('Error checking while deleting invalid user', function(done) {
      app
        .delete('/users/removeUser/12301')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.eql(500);
          expect(res.body.success).to.equal(false);
          expect(res.body).to.be.an('object');
          done();
        });
    });
  });
});
