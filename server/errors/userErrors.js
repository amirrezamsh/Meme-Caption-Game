const ALREADY_EXIST = "Username already exist";

class UserAlreadyExists extends Error {
  constructor() {
    super();
    this.message = ALREADY_EXIST;
    this.statusCode = 409;
    this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
  }
}

module.exports = { UserAlreadyExists };
