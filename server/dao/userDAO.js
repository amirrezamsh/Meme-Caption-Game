const db = require("../db/db");
const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const GameDAO = require("./gameDAO");

exports.createUser = (body) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) reject(err);
      bcrypt.hash(body.password, salt, (err, hash) => {
        if (err) reject(err);
        const sql =
          "INSERT INTO Users (username,password,salt,created_at) VALUES (?,?,?,?)";
        db.run(
          sql,
          [body.username, hash, salt, dayjs().format("YYYY-MM-DD")],
          (err) => {
            if (err) reject(err);
            resolve(true);
          }
        );
      });
    });
  });
};

exports.getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Users WHERE username = ?";
    db.get(sql, [username], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Users WHERE id = ?";
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};
