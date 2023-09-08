import { userModel } from "../models/user.model.js";

class UserService{
  async create(data) {
    const user = await userModel.create(data);
    return user;
  }

  async findByEmail(email) {
    const user = await userModel.findOne({ email: email });
    return user;
  }

  async getallUsers () {
    const users = await userModel.find();
    return users;
  }

  async getById (id) {
    const user = await userModel.findById(id);
    return user;
  }
}

export default new UserService();