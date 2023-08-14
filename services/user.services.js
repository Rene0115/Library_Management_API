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
}

export default new UserService();