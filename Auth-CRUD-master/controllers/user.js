const sha256 = require('js-sha256'),
  jwt = require('jwt-then'),
  config = require('config-yml');

//Models
const UserModel = require('../model/user');

//Services
const userService = require('../services/user');

//Middlewares
const resUtil = require('../middlewares/response');
const Messages = require('../config/messages');

//Create usable instances of services
const userServiceInstance = new userService(UserModel);

module.exports = {
  userAuth,
  createNewUser,
  getAllUser,
  deleteUser,
  getUser,
  updateUser
};

/**
 * @description this function used to validate admin user, In case of success generating token key.
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
async function userAuth(req, res) {
  const { username, password } = req.body;
  // console.log('Inside auth controller=======>', req.body, username, password);
  try {
    if (
      username === config.Admin.username &&
      password === config.Admin.password
    ) {
      //In case of valide admin details generate token
      const token = await jwt.sign({ id: username }, config.SECRET, {
        expiresIn: config.TokenExpiresIn
      });
      let respData = {};
      respData.token = token;
      return res.send(resUtil.sendSuccess(respData));
    } else {
      return res
        .status(422)
        .send(resUtil.sendError(Messages.responses.InvalidAdminCredentials));
    }
  } catch (err) {
    throw err;
  }
}

/**
 * @description Insert  new user details to user collection
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
async function createNewUser(req, res) {
  //console.log("Inside controller=======>", req.body);
  const { email, password, mobile, address, pincode } = req.body;
  try {
    if (
      req.body.email !== '' &&
      req.body.email !== null &&
      req.body.email !== undefined &&
      req.body.password !== '' &&
      req.body.password !== null &&
      req.body.password !== undefined
    ) {
      //Email validation

      const emailRegExp = /@gmail.com|@yahoo.com|@hotmail.com|@live.com/;
      if (!emailRegExp.test(email))
        return res
          .status(422)
          .send(resUtil.sendError(Messages.responses.emailError));
      //Password validation
      if (password.length < 5)
        return res
          .status(422)
          .send(resUtil.sendError(Messages.responses.passwordError));
      //Password encoding
      const userInput = {
        email: email,
        password: sha256(password + config.SALT),
        mobile: mobile,
        address: address,
        pincode: pincode
      };
      const resp = await userServiceInstance.createNewUser(userInput);
      //Checking user exist and throw error
      if (resp === 'Exist')
        return res
          .status(409)
          .send(resUtil.sendError(Messages.responses.userFoundError + email));
      if (resp._id) {
        let respData = {};
        respData.userId = resp._id;
        respData.email = resp.email;
        return res.send(resUtil.sendSuccess(respData));
      }
      return res
        .status(500)
        .send(resUtil.sendError(Messages.responses.DocumentCreateError));
    } else {
      return res
        .status(422)
        .send(resUtil.sendError(Messages.responses.InvalidInputParams));
    }
  } catch (err) {
    throw err;
  }
}

/**
 * @description Retrieve all user documents details from the user collction
 * @param req params are nothing
 * @returns returns all documents from user  collection with success 200 or Error with 500
 */
async function getAllUser(req, res) {
  try {
    const data = await userServiceInstance.getAllUser();
    // console.log("============response from service==========",data);
    if (data.length > 0) {
      return res.send({ success: true, data: data });
    } else {
      return res
        .status(404)
        .send({ success: false, Error: Messages.responses.dataNotFound });
    }
  } catch (err) {
    res.status(500).send(resUtil.sendError(err.message));
  }
}

/**
 * @description delete  user document details from the user collction by user _Id
 * @param req params user _Id
 * @returns returns deleted user details from user  with success 200 or Error with 500
 */
async function deleteUser(req, res) {
  try {
    // console.log("============inside controller==========",req.params.userId);
    if (req.params.userId !== undefined || req.params.userId !== '') {
      const data = await userServiceInstance.deleteUser(req.params.userId);
      // console.log("============response from service==========",data);
      if (data && data._id) {
        return res.send({
          success: true,
          Message: Messages.responses.dataDeleted
        });
      } else {
        return res.status(404).send({
          success: false,
          Error: Messages.responses.dataNotFoundToDelete
        });
      }
    } else {
      return res.send({
        success: false,
        Error: Messages.responses.InvalidInputParams
      });
    }
  } catch (err) {
    res.status(500).send(resUtil.sendError(err.message));
  }
}

/**
 * @description Retrieve specific user documents details from the user collction
 * @param req params user _Id
 * @returns returns updated user Detail  from user  collection with success 200 or Error with 500
 */
async function getUser(req, res) {
  try {
    //console.log('============inside controller==========', req.params.userId);
    if (req.params.userId !== undefined || req.params.userId !== '') {
      const data = await userServiceInstance.getUser(req.params.userId);
      //console.log('============response from service==========', data);
      if (data && data._id) {
        return res.send({
          success: true,
          data: data
        });
      } else {
        return res.status(404).send({
          success: false,
          Error: Messages.responses.userNotFound
        });
      }
    } else {
      return res.send({
        success: false,
        Error: Messages.responses.invalidUserId
      });
    }
  } catch (err) {
    res.status(500).send(resUtil.sendError(Messages.responses.userNotFound));
  }
}

/**
 * @description Updates specific user documents details from the user collction
 * @param req params user _Id
 * @returns returns specific user Detail  from user  collection with success 200 or Error with 500
 */
async function updateUser(req, res) {
  const { mobile, address, pincode } = req.body;
  const id = req.params.userId;

  try {
    if (req.params.userId !== undefined || req.params.userId !== '') {
      //Password encoding
      const userInput = {
        mobile: mobile,
        address: address,
        pincode: pincode
      };
      const resp = await userServiceInstance.updateUser(userInput, id);
      //Checking user exist and throw error

      if (resp === 'NotExist') {
        return res
          .status(412)
          .send(resUtil.sendError(Messages.responses.userNotFound));
      } else {
        return res
          .status(200)
          .send(resUtil.sendSuccess(Messages.responses.userUpdated));
      }
      return res
        .status(500)
        .send(resUtil.sendError(Messages.responses.DocumentCreateError));
    } else {
      return res
        .status(422)
        .send(resUtil.sendError(Messages.responses.InvalidInputParams));
    }
  } catch (err) {
    res.status(500).send(resUtil.sendError(Messages.responses.userNotFound));
  }
}
