import bcrypt from "bcrypt";
import userServices from "../services/user.services.js";
import { logger } from "../app.js";
import _ from "lodash";

class UserController {
  async signup(req, res) {
    const data = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    for (const property in data) {
      if (!data[property]) {
        return res.status(400).send({
          success: false,
          message: `The ${property} field is required`
        });
      }
    }
    const exists = await userServices.findByEmail(data.email);
    if (exists) {
      return res.status(400).send({
        success: false,
        message: `User with email ${data.email} already exists`
      });
    }

    const user = await userServices.create(data);
    if (user) {
      return res.status(201).send({
        success: true,
        message: `User created`,
        data: {
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          profile_photo: user.image,
          number: user.phoneNumber
        }
      });
    }
  }
}

export default new UserController();
