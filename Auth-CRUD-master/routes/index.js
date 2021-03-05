('use strict');
const express = require('express'),
  router = express.Router(),
  userContoller = require('../controllers/user'),
  auth = require('../middlewares/auth');

module.exports = app => {
  // For testing routing functionality
  router.get('/test', function(req, res) {
    res.send('Hello World!');
  });

  /**
   * @method POST
   * @params input {object}
   * @description this router used to validate admin user, In case of success generating token key.
   * @returns In case of success, Status code 200 with output {object},  else  Error: output {object} with respective error code
   */
  router.post('/user/auth', userContoller.userAuth);

  /**
   * @method POST
   * @params input {object}
   * @description Insert new document details in user collcetion
   * @returns In case of success, Status code 200 with output {object},  else  Error: output {object} with respective error code
   */
  router.post('/users/create', auth, userContoller.createNewUser);

  /**
   * @method GET
   * @description find all user details from user collection
   * @returns In case of success, Status code 200 with output {object},  else  Error: output {object} with respective error code
   */
  router.get('/users/allusers', auth, userContoller.getAllUser);

  /**
   * @method DELETE
   * @params input user _id
   * @description delete  user details from user collection by user _id
   * @returns In case of success, Status code 200 with output {object},  else  Error: output {object} with respective error code
   */
  router.delete('/users/removeUser/:userId', auth, userContoller.deleteUser);

  /**
   * @method GET
   * @params input user _id
   * @description get  user details from user collection by user _id
   * @returns In case of success, Status code 200 with output {object},  else  Error: output {object} with respective error code
   */
  router.get('/users/getUser/:userId', auth, userContoller.getUser);

  /**
   * @method PUT
   * @params input user _id
   * @description update user details from user collection by user _id
   * @returns In case of success, Status code 200 with output {object},  else  Error: output {object} with respective error code
   */
  router.put('/users/update/:userId', auth, userContoller.updateUser);

  // Default route
  app.use('/', router);
};
