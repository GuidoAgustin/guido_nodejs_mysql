const validator = require("../libs/validate");
const jwt = require("../libs/jwt");
const { usersRepository } = require("../repositories");
const {
  LoginUser,
  UpdateUserProfile,
  GetAllUsers,
  AdminUpdateUser,
  AdminDeleteUser,
} = require("../../application/users");

const UsersController = require("../controllers/UsersController");
const ForgotPassword = require("../../application/users/ForgotPassword");
const ResetPassword = require("../../application/users/ResetPassword");

// INSTANCES
const loginUser = new LoginUser({
  usersRepository,
  validator,
  jwt,
});

const updateUserProfile = new UpdateUserProfile({
  usersRepository,
  validator,
});

const getAllUsers = new GetAllUsers({
  usersRepository,
});

const adminUpdateUser = new AdminUpdateUser({
  usersRepository,
  validator,
});

const adminDeleteUser = new AdminDeleteUser({
  usersRepository,
});

const forgotPassword = new ForgotPassword({
  usersRepository,
  validator,
});

const resetPassword = new ResetPassword({
  usersRepository,
  validator,
});

const usersController = new UsersController({
  loginUser,
  updateUserProfile,
  getAllUsers,
  adminUpdateUser,
  adminDeleteUser,
  forgotPassword,
  resetPassword,
});

module.exports = {
  usersController,
};
