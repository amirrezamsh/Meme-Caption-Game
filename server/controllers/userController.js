// import UserDAO from "../dao/userDAO";
const UserDAO = require("../dao/userDAO");
const userError = require("../errors/userErrors");

exports.createUser = async (req, res) => {
  try {
    const user = await UserDAO.getUserByUsername(req.body.username);
    if (user) {
      throw new userError.UserAlreadyExists();
    }
    return UserDAO.createUser(req.body);
  } catch (error) {
    throw error;
  }
};
