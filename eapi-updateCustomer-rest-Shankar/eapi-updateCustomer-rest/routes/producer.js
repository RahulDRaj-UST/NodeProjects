"use strict";
var express = require('express');
var producerRouter = express.Router();
var error = require('./error/error');
let logger = require('../utils/logging');

var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    client = new kafka.KafkaClient(),
    producer = new Producer(client);

producer.on('ready', function() {
    logger.logDebug('Producer is ready');
});


//  @method POST
//  @params input object
//  @description this router used to validate req object and send data to kafka server
//  returns in case of success, Status code 200 with output object message, else Error:output object with respective error code
 
producerRouter.post('/update', function(req, res) {
    logger.logDebug("Hi am inside update");
    validation(req, res);
});

/**
 * @description: This function used to validate req object and patientId
 * @param req and res params 
 * @returns  incase of success it will call kafkaProducer or else will throw error
 */
async function validation(req, res) {
    logger.logDebug("inside validation function==>");
    try {
        //validating authorization token
        if (req.headers.authorization === '' || req.headers.authorization === null || req.headers.authorization === undefined) {
            logger.logDebug("authorization token not found==> ");
            sendErrorCode(res, error.HttpStatusCodes.UNAUTHORIZED);
            return false;
        }
        //validating incoming body object and patientId
        if (!req.body || req.body.patientId === '' || req.body.patientId === null || req.body.patientId === undefined) {
            logger.logDebug("patientId not found==> ");
            sendErrorCode(res, error.HttpStatusCodes.INVALIDREQ);
            return false;
        }
        //If patientId found, then call kafkaProducer
        await kafkaProducer(req, res);
    } catch (err) {
        logger.logDebug("===catch error: inside validation==>" + err);
        sendErrorCode(res, error.HttpStatusCodes.GENERICERROR);
    }
}

/**
 * @description: This function used to send data to kafka server
 * @param req and res params
 * @returns  incase of success it will call return 200 with success message or else will throw error
 */
async function kafkaProducer(req, res) {
    logger.logDebug("inside kafkaProducer function==>" + req.body.patientId);
    try {
        let bodyMessage = JSON.stringify(req.body);
        let payloads = [{
            topic: 'dev-customer',
            messages: bodyMessage,
            partition: 0
        }];
        producer.send(payloads, function(err, data) {
            logger.logDebug(" Incoming data to kafkaProducer err===> " + err);
            logger.logDebug(" Incoming data to kafkaProducer===> " + data);
            res.send({
                "messages": [{
                    "code": "WAG_E_OK",
                    "message": "Data successfully sent to Kafka!",
                    "type": "SUCCESS"
                }]
            });
        });
        producer.on('error', function(err) {
            logger.logDebug('Producer is in error state == '+err);
            sendErrorCode(res, error.HttpStatusCodes.BACKENDERROR);
        });
    } catch (err) {
        logger.logDebug("===catch error: inside kafkaProducer==>" + err);
        sendErrorCode(res, error.HttpStatusCodes.GENERICERROR);
    }
}

/**
 * Function for triggering Error response
 */
function sendErrorCode(res, ecode) {
    let responseString = error.getError(ecode);
    res.status(ecode);
    res.set('Content-Type', 'application/json');
    res.send(responseString);
}

module.exports = producerRouter;