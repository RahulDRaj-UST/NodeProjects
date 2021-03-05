/* eslint-disable no-console */
/* eslint-disable no-undef */
let chai = require('chai');
let chaiHttp = require('chai-http');
// eslint-disable-next-line no-unused-vars
let server = require('../../app');
// eslint-disable-next-line no-unused-vars
let should = chai.should();
chai.use(chaiHttp);
const url = 'http://localhost:8080';
let logging = require('../../utils/logging');

describe('/GET ping service', () => {
  it('it should GET ping status message', done => {
    chai
      .request(url)
      .get('/v1/pharmacy/patient/ping')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.equal('ok');
        res.body.apiname.should.equal('eapi-updatecustomer-rest');
        res.body.apiversion.should.equal('v1_0_0');
        done();
      });
  });

  it('it should not GET ping status message', done => {
    chai
      .request(url)
      .post('/v1/pharmacy/patient/ping')
      .end((err, res) => {
        res.should.have.status(405);
        res.body.messages[0].should.have.property('type').eq('ERROR');
        res.body.messages[0].should.have
          .property('code')
          .eq('WAG_E_INVALID_METHOD_1001');

        done();
      });
  });
});

describe('Test Info/Debug/Error Message Logging', () => {
  it('it should log info message', done => {
    logging.logInfo(
      'SampleAplicationName',
      101,
      1001,
      1,
      'GET',
      '200',
      'Success',
      'TestInfoLog',
      '100ms',
      null,
      null
    );
    done();
  });
  it('it should log info message', done => {
    logging.logInfo(
      null,
      102,
      1002,
      1,
      'GET',
      '200',
      'Success',
      'TestInfoLog',
      '100ms',
      null,
      null
    );
    done();
  });
  it('it should log Debug message', done => {
    logging.logDebug(
      'SampleAplicationName',
      103,
      1003,
      2,
      'GET',
      '200',
      'Success',
      'TestDebugLog',
      '150ms',
      null,
      null
    );
    done();
  });
  it('it should log Debug message', done => {
    logging.logDebug(
      null,
      104,
      1004,
      2,
      'GET',
      '200',
      'Success',
      'TestDebugLog',
      '150ms',
      null,
      null
    );
    done();
  });
  it('it should log error message', done => {
    let error = new Error('Internal Error');
    logging.logError(
      'SampleAplicationName',
      105,
      1005,
      3,
      'GET',
      '500',
      'Failure',
      'Error Occured %s',
      '50ms',
      'KFK-ERR-001',
      'Error accessing input topic',
      error
    );
    done();
  });
  it('it should log error message', done => {
    let error = new Error('Internal Error');
    logging.logError(
      null,
      106,
      1006,
      3,
      'GET',
      '500',
      'Failure',
      'Error Occured %s',
      '50ms',
      'KFK-ERR-001',
      'Error accessing input topic',
      error
    );
    done();
  });
});

describe('POST /update', function() {
  it('With valid inputs params', function(done) {
    chai
      .request(server)
      .post('/v1/pharmacy/patient/update')
      .set('Authorization', '001')
      .send({
        patientId: '58519001003',
        email: 'nŮźDåŷ:ė',
        dob: 'mm/dd/yyyy, 08/25/1909',
        phoneNumberAreaCode: 'nŮźDåŷ:ė',
        phoneNumber: 'nŮźDåŷ:ė',
        preferredStoreNumber: 0,
        lastFilledStoreNumber: 'string',
        preferredPaymentMethod: 'string',
        previousFilledLastMile: 'string',
        customerShippingAddress: {
          addressLine1: 'nŮźDåŷ:ė',
          city: 'nŮźDåŷ:ė',
          zipCode: 'Encrypted - string FPE',
          state: 'string'
        },
        profilePaymentDetails: [
          {
            cardType: 'string',
            creditCard: 'string',
            lastFourDigits: 0,
            expiryMonth: 0,
            expiryYear: 0,
            zipCode: 'string',
            isDefault: true
          }
        ]
      })

      .end((err, res) => {
        res.should.have.status(200);
        res.body.message[0].should.have.property('type').eq('SUCCESS');
        res.body.should.be.an('object');

        done();
      });
  });

  it('With invalid authorization', function(done) {
    chai
      .request(server)
      .post('/v1/pharmacy/patient/update')

      .send({
        patientId: '58519001003',
        email: 'nŮźDåŷ:ė',
        dob: 'mm/dd/yyyy, 08/25/1909',
        phoneNumberAreaCode: 'nŮźDåŷ:ė',
        phoneNumber: 'nŮźDåŷ:ė',
        preferredStoreNumber: 0,
        lastFilledStoreNumber: 'string',
        preferredPaymentMethod: 'string',
        previousFilledLastMile: 'string',
        customerShippingAddress: {
          addressLine1: 'nŮźDåŷ:ė',
          city: 'nŮźDåŷ:ė',
          zipCode: 'Encrypted - string FPE',
          state: 'string'
        },
        profilePaymentDetails: [
          {
            cardType: 'string',
            creditCard: 'string',
            lastFourDigits: 0,
            expiryMonth: 0,
            expiryYear: 0,
            zipCode: 'string',
            isDefault: true
          }
        ]
      })

      .end((err, res) => {
        res.should.have.status(401);
        res.body.messages[0].should.have.property('type').eq('ERROR');
        res.body.should.be.an('object');
        res.body.messages[0].should.have
          .property('code')
          .eq('WAG_E_UNAUTHORIZED_REQUEST_1001');
        done();
      });
  });

  it('With empty patient ID ', function(done) {
    chai
      .request(server)
      .post('/v1/pharmacy/patient/update')
      .set('Authorization', '001')
      .send({
        patientId: '',
        email: 'nŮźDåŷ:ė',
        dob: 'mm/dd/yyyy, 08/25/1909',
        phoneNumberAreaCode: 'nŮźDåŷ:ė',
        phoneNumber: 'nŮźDåŷ:ė',
        preferredStoreNumber: 0,
        lastFilledStoreNumber: 'string',
        preferredPaymentMethod: 'string',
        previousFilledLastMile: 'string',
        customerShippingAddress: {
          addressLine1: 'nŮźDåŷ:ė',
          city: 'nŮźDåŷ:ė',
          zipCode: 'Encrypted - string FPE',
          state: 'string'
        },
        profilePaymentDetails: [
          {
            cardType: 'string',
            creditCard: 'string',
            lastFourDigits: 0,
            expiryMonth: 0,
            expiryYear: 0,
            zipCode: 'string',
            isDefault: true
          }
        ]
      })

      .end((err, res) => {
        res.should.have.status(400);
        res.body.messages[0].should.have.property('type').eq('ERROR');
        res.body.messages[0].should.have
          .property('code')
          .eq('WAG_E_INVALID_REQUEST_1001');
        res.body.should.be.an('object');

        done();
      });
  });

  it('With wrong request ', function(done) {
    chai
      .request(server)
      .get('/v1/pharmacy/patient/update')
      .set('Authorization', '001')
      .send({
        patientId: '123456',
        email: 'nŮźDåŷ:ė',
        dob: 'mm/dd/yyyy, 08/25/1909',
        phoneNumberAreaCode: 'nŮźDåŷ:ė',
        phoneNumber: 'nŮźDåŷ:ė',
        preferredStoreNumber: 0,
        lastFilledStoreNumber: 'string',
        preferredPaymentMethod: 'string',
        previousFilledLastMile: 'string',
        customerShippingAddress: {
          addressLine1: 'nŮźDåŷ:ė',
          city: 'nŮźDåŷ:ė',
          zipCode: 'Encrypted - string FPE',
          state: 'string'
        },
        profilePaymentDetails: [
          {
            cardType: 'string',
            creditCard: 'string',
            lastFourDigits: 0,
            expiryMonth: 0,
            expiryYear: 0,
            zipCode: 'string',
            isDefault: true
          }
        ]
      })

      .end((err, res) => {
        res.should.have.status(405);
        res.body.messages[0].should.have.property('type').eq('ERROR');
        res.body.messages[0].should.have
          .property('code')
          .eq('WAG_E_INVALID_METHOD_1001');
        res.body.should.be.an('object');

        done();
      });
  });
});
