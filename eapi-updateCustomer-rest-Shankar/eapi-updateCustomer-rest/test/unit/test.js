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
const nock = require('nock');

describe('/GET ping service', () => {
	it('it should GET ping status message', (done) => {
		chai.request(url)
			.get('/v1/pharmacy/patient/ping')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.status.should.equal('ok');
				res.body.apiname.should.equal('eapi-customer-rest');
				res.body.apiversion.should.equal('v1_0_0');
				done();
			});
	});
	
});

describe('Test Info/Debug/Error Message Logging', () => {
	it('it should log info message', (done) => {
		logging.logInfo("SampleAplicationName",101,1001,1,"GET","200","Success","TestInfoLog","100ms",null,null);
		done();
	});
	it('it should log info message', (done) => {
		logging.logInfo(null,102,1002,1,"GET","200","Success","TestInfoLog","100ms",null,null);
		done();
	});
	it('it should log Debug message', (done) => {
		logging.logDebug("SampleAplicationName",103,1003,2,"GET","200","Success","TestDebugLog","150ms",null,null);
		done();
	});
	it('it should log Debug message', (done) => {
		logging.logDebug(null,104,1004,2,"GET","200","Success","TestDebugLog","150ms",null,null);
		done();
	});
	it('it should log error message', (done) => {
		let error = new Error("Internal Error")
		logging.logError("SampleAplicationName",105,1005,3,"GET","500","Failure","Error Occured %s", "50ms","KFK-ERR-001","Error accessing input topic",error);
		done();
	});
	it('it should log error message', (done) => {
		let error = new Error("Internal Error")
		logging.logError(null,106,1006,3,"GET","500","Failure","Error Occured %s", "50ms","KFK-ERR-001","Error accessing input topic",error);
		done();
	});


}); 

describe("POST /v1/pharmacy/patient/",()=>{

	/**Test dataObj**/
	var patientTestDoc = {
		patientId: "10101010",
		email: "nŮźDåŷ:ė",
		dob: "mm/dd/yyyy, 08/25/1909",
		phoneNumberAreaCode: "nŮźDåŷ:ė",
		phoneNumber: "nŮźDåŷ:ė",
		preferredStoreNumber: 0,
		lastFilledStoreNumber: "string",
		preferredPaymentMethod: "string",
		previousFilledLastMile: "string",
		customerShippingAddress: {
			addressLine1: "nŮźDåŷ:ė",
			city: "nŮźDåŷ:ė",
			zipCode: "Encrypted - string FPE",
			state: "string"
			
		},
		profilePaymentDetails: [{ 
			cardType: "string",
			creditCard: "string",
			lastFourDigits: 0,
			expiryMonth: 0,
			expiryYear: 0,
			zipCode: "string",
			isDefault: true
		}]   
	};

	it("it should send patient info to kafka",(done)=>{

		chai.request(server)
		.post("/v1/pharmacy/patient/update")
		.send(patientTestDoc)
		.set("Authorization","001")
		.end((err,response)=>{
			
			response.should.have.status(200);
			response.body.should.be.a('object');
			response.body.messages[0].should.have.property('code').eq('WAG_E_OK');
			response.body.messages[0].should.have.property('type').eq('SUCCESS');
			done();

		});
	});

	it("it should return 400 when request have missing patientId",(done)=>{

		chai.request(server)
		.post("/v1/pharmacy/patient/update")
		.set("Authorization","001")
		.end((err,response)=>{

			response.should.have.status(400);
			response.body.should.be.a('object');
			response.body.should.have.property('messages');
			response.body.messages[0].should.have.property('code').eq('WAG_E_INVALID_REQUEST_1001');
			response.body.messages[0].should.have.property('type').eq('ERROR');
			done();

		});
	});

	it("it should return 405 when invalid method call",(done)=>{

		chai.request(server)
		.get("/v1/pharmacy/patient/update")
		.send(patientTestDoc)
		.set("Authorization","001")
		.end((err,response)=>{

			response.should.have.status(405);
			response.body.should.be.a('object');
			response.body.should.have.property('messages');
			response.body.messages[0].should.have.property('code').eq('WAG_E_INVALID_METHOD_1001');
			response.body.messages[0].should.have.property('type').eq('ERROR');
			done();

		});
	});

	it("it should return 401 if not authenticated",(done)=>{

		chai.request(server)
		.post("/v1/pharmacy/patient/update")
		.send(patientTestDoc)
		.end((err,response)=>{

			response.should.have.status(401);
			response.body.should.be.a('object');
			response.body.should.have.property('messages');
			response.body.messages[0].should.have.property('code').eq('WAG_E_UNAUTHORIZED_REQUEST_1001');
			response.body.messages[0].should.have.property('type').eq('ERROR');
			done();

		});
	});

// Nocking API with response code 503
	let patientResponse503 = {
		messages: [
			{
				"code": "WAG_E_INVALID_METHOD_1001",
				"message": "DB Service Temporarily down !!! Try again after some time...",
				"type": "ERROR"
			}
		],
		status: 503
	};

	before('Set up a fake HTTP Server', () => {
		nock(url)
			.post('/v1/pharmacy/patient/update')
			.reply(503, patientResponse503);
	});

	it("it should return 503 when apache kafka is not responding", (done) => {

		chai.request(url)
			.post("/v1/pharmacy/patient/update")
			.set("Authorization", "001")
			.send(patientTestDoc)
			.end((err, response) => {

				response.should.have.status(503);
				response.body.should.be.a('object');
				response.body.should.have.property('messages');
				response.body.messages[0].should.have.property('code').eq('WAG_E_INVALID_METHOD_1001');
				response.body.messages[0].should.have.property('type').eq('ERROR');
				done();
			});
	});

	// Nocking API with response code 500
	let patientResponse500 = {
		messages: [
			{
				"code": "WAG_E_SVC_ERROR_1000",
				"message": "Sorry! This service is temporarily unavailable. Please try again later.",
				"type": "ERROR"
			}
		],
		status: 500
	};

	before('Set up a fake HTTP Server', () => {
		nock(url)
			.post('/v1/pharmacy/patient/update')
			.reply(500, patientResponse500);
	});

	it("it should return 500 when internal server error occured", (done) => {

		chai.request(url)
			.post("/v1/pharmacy/patient/update")
			.set("Authorization", "001")
			.send(patientTestDoc)
			.end((err, response) => {

				response.should.have.status(500);
				response.body.should.be.a('object');
				response.body.should.have.property('messages');
				response.body.messages[0].should.have.property('code').eq('WAG_E_SVC_ERROR_1000');
				response.body.messages[0].should.have.property('type').eq('ERROR');
				done();
			});
	});
	

});




