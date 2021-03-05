var express = require('express');
var kafkaRouter = express.Router();

var error = require('./error/error');
let logger = require('../utils/logging');

var kafka = require('kafka-node'),
  HighLevelProducer = kafka.HighLevelProducer,
  client = new kafka.KafkaClient(),
  producer = new HighLevelProducer(client);
//KeyedMessage = kafka.KeyedMessage,
// Producer = kafka.Producer,
// client = new kafka.KafkaClient(),
// producer = new Producer(client),
//km = new KeyedMessage('key', 'message');
producer.on('ready', function() {
  logger.logDebug('=============================>ProducerReady');
});

producer.on('error', function(err, res) {
  logger.logDebug('===========================>Producer Error' + err);

  sendErrorCode(res, error.HttpStatusCodes.BACKENDERROR);
  return false;
});

kafkaRouter.post('/update', (req, res) => {
  logger.logDebug('Inside Update Post ');
  checkInput(req, res);
});

async function checkInput(req, res) {
  logger.logDebug('Inside Validation ');
  try {
    if (
      req.headers.authorization === '' ||
      req.headers.authorization === null ||
      req.headers.authorization === undefined
    ) {
      logger.logDebug('Authorization Error' + req.headers.authorization);
      sendErrorCode(res, error.HttpStatusCodes.UNAUTHORIZED);
      return false;
    }
    logger.logDebug('======================' + req.headers.authorization);
    if (
      req.body.patientId === null ||
      req.body.patientId === '' ||
      req.body.patientId === undefined ||
      !req.body
    ) {
      logger.logDebug('validation Error');
      sendErrorCode(res, error.HttpStatusCodes.INVALIDREQ);
      return false;
    }
    await sendToKafka(req, res);
  } catch (err) {
    logger.logDebug('checkInput catch Error' + err);
    sendErrorCode(res, error.HttpStatusCodes.GENERICERROR);
  }
}
async function sendToKafka(req, res) {
  logger.logDebug('Inside Producer Function' + req.body.patientId);
  try {
    const messageBody = JSON.stringify(req.body);
    const payload = [
      {
        topic: 'dev-customer',
        messages: messageBody,
        partition: 0
      }
    ];
    if (!producer.ready) {
      logger.logDebug('Producer Error--------------------------------');
      sendErrorCode(res, error.HttpStatusCodes.BACKENDERROR);
      return false;
    }
    producer.send(payload, function(err, data) {
      logger.logDebug('Successfull in sending data to Kafka' + data);
      res.send({
        message: [
          {
            code: 'WAG_SUCCESS',
            message: 'Data posted in Kafka',
            type: 'SUCCESS'
          }
        ],
        status: 200
      });
    });
    producer.on('error', function(err) {
      logger.logDebug('Producer is in error state == ' + err);
      sendErrorCode(res, error.HttpStatusCodes.BACKENDERROR);
    });
  } catch (err) {
    logger.logDebug('sending to kafka catch Error' + err);
    sendErrorCode(res, error.HttpStatusCodes.GENERICERROR);
  }
}

/**
 * Function for triggering Error response
 */
function sendErrorCode(res, ecode) {
  var responseString = error.getError(ecode);
  res.status(ecode);
  res.set('Content-Type', 'application/json');
  res.send(responseString);
}

module.exports = kafkaRouter;
