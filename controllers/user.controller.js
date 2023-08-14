import bcrypt from "bcrypt";
import userServices from "../services/user.services.js";
import { logger } from "../app.js";
import _ from "lodash";
import jwt from "jsonwebtoken";

class UserController {
  async signup(req, res) {
    const data = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email.toLowerCase(),
      phoneNumber: parseInt(req.body.phoneNumber),
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
  async login(req,res) {
    try {
        const data = {
          email: req.body.email.toLowerCase(),
          password: req.body.password
        };
        for (const property in data) {
          if (!data[property]) {
            return res.status(400).send({
              success: false,
              message: `The ${property} field is required`
            });
          }
        }
  
        const user = await userServices.findByEmail(data.email);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: `User with this email does not exist`
            })
        }
  
        const verifyPassword = bcrypt.compareSync(data.password, user.password);
        if (!verifyPassword) {
          return res.status(404).send({
            success: false,
            message: "email or password is invalid"
          });
        }
        const token = jwt.sign(
          {
            _id: user._id,
            firstname: user.firstname,
            email: user.email,
            lastname: user.lastname
          },
          process.env.TOKEN_SECRET,
          { expiresIn: "24h", algorithm: "HS512" }
        );
        return res.status(200).send({
          success: true,
          body: {
            message: "user logged in successfully",
            token,
            data: user
          }
        });
      } catch (err) {
        logger.error(err);
        return res.status(200).send({
          success: false,
          error: err.message
        });
      }
  }
}

export default new UserController();
