//Services
const MongooseService = require('./MongooseService');

class users {
  /**
   * @description Initializes a new instance of the user
   * @param UserModel {mongoose.model} Required: Instance of Mongoose model
   */
  constructor(UserModel) {
    this.UserModel = UserModel;
    this.mongooseServiceInstance = new MongooseService(this.UserModel);
  }

  /**
   * @description creating new user document in user collection
   * @param {String} object
   * @returns {Promise} Returns result of Mongoose query
   */
  async createNewUser(body) {
    //console.log("Inside service=======>", body);
    try {
      const Exist = await this.mongooseServiceInstance.count({
        email: body.email
      });
      if (Exist > 0) return 'Exist';
      const data = await this.mongooseServiceInstance.create(body);
      // console.log("Inside service=======>", data);
      return data;
    } catch (err) {
      // console.log("Inside service err=======>", err);
      throw err;
    }
  }

  /**
   * @description SELECT (*)  users details from user collection
   * @param {String} object
   * @returns {Promise} Returns result of Mongoose query
   */
  async getAllUser() {
    //console.log("Inside service=======> getAlluserInfo");
    try {
      const data = await this.mongooseServiceInstance.find();
      return data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * @description DELETE new user document in user collection
   * @param {String} object
   * @returns {Promise} Returns result of Mongoose query
   */
  async deleteUser(userId) {
    //console.log("Inside service input deleteuserByID=======> ", userId);
    try {
      const data = await this.mongooseServiceInstance.delete(userId);
      return data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * @description SELECT (userId)  users details from user collection
   * @param {String} object
   * @returns {Promise} Returns result of Mongoose query
   */
  async getUser(userId) {
    // console.log('Inside service=======> getUserInfo');
    try {
      const data = await this.mongooseServiceInstance.findOne(userId);
      return data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * @description update user document in user collection
   * @param {String} object
   * @returns {Promise} Returns result of Mongoose query
   */
  async updateUser(body, id) {
    //console.log('Inside service=======>', body);
    try {
      const Exist = await this.mongooseServiceInstance.count({
        _id: id
      });
      //console.log(Exist);
      if (Exist < 1) return 'NotExist';
      const data = await this.mongooseServiceInstance.update(body, id);
      // console.log("Inside service=======>", data);
      return data;
    } catch (err) {
      //console.log('Inside service err=======>', err);
      throw err;
    }
  }
}

module.exports = users;
