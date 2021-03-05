var express = require('express');
var consumerRouter = express.Router();
const { Kafka } = require('kafkajs');
let logger = require('../utils/logging');
var error = require('./error/error');
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'kafka-node-group' });

const run = async () => {
  // Consuming
  await consumer.connect();
  await consumer.subscribe({ topic: 'dev-customer', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const jsonObj = JSON.parse(message.value.toString());

        if (jsonObj) {
          var dbconnection = global.db;
          try {
            var dbo = dbconnection.db('eapi_data');
            logger.logDebug('Before Saving');
            logger.logDebug('-=-=-=-=' + jsonObj.profilePaymentDetails);
            dbo
              .collection('tbf0_patient')
              .insertOne(jsonObj, function(err, res) {
                if (err) throw err;
              });
          } catch (err) {
            logger.logDebug(
              'Error !!! Unable to establish MongoDb Connection..'
            );
            sendErrorCode(res, error.HttpStatusCodes.BACKENDERROR);
            return;
          }
        }
      } catch (error) {
        console.log('err=', error);
      }
    }
  });
};

run().catch(console.error);

function sendErrorCode(res, ecode) {
  var responseString = error.getError(ecode);
  res.status(ecode);
  res.set('Content-Type', 'application/json');
  res.send(responseString);
}
module.exports = consumerRouter;
