import bcrypt from "bcrypt";
import userServices from "../services/user.services.js";
import { logger } from "../app.js";
import _ from "lodash";
import { uploadImage } from "../config/cloudinary.config.js";
import jwt from "jsonwebtoken";

class UserController {
  async signup(req, res) {
    try {
      let image = null;
      if (req.file) {
        image = await uploadImage(req.file.path);
      }
      const data = {
        libraryName: req.body.name,
        email: req.body.email.toLowerCase(),
        phoneNumber: req.body.number,
        password: bcrypt.hashSync(req.body.password, 10),
        image: image?.secure_url || "image"
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
            library: user.libraryName,
            number: user.phoneNumber,
            image: user.image
          }
        });
      }
    } catch (e) {
      logger.error(e);
      return res.status(500).send({
        success: false,
        error: e.message
      });
    }
  }
  async login(req, res) {
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
        });
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
          libraryName: user.libraryName,
          email: user.email
        },
        process.env.TOKEN_SECRET,
        { expiresIn: "24h", algorithm: "HS512" }
      );
      return res.status(200).send({
        success: true,
        body: {
          message: "user logged in successfully",
          token,
          data: {
            email: user.email,
            library: user.libraryName,
            profile_photo: user.image,
            number: user.phoneNumber
          }
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
  async getUsers(req, res) {
    const users = await userServices.getallUsers();
    if (users.length < 1) {
      return res.status(404).send({
        success: false,
        message: "No users found"
      });
    }
    return res.status(200).send({
      success: true,
      users: users
    });
  }

  async findById(req, res){
    const id = req.user._id;
    const user = await userServices.getById(id);
    if(!user) {
      return res.status(404).send({
        success: false,
        message: `Must be logged in`
      })
    }
    return res.status(200).send({success: true, data: user});
  }
}

export default new UserController();
