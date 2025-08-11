// validators.js
const { body, validationResult } = require("express-validator");

const createValidationMiddleware = (rules, validFields) => [
  ...rules,
  (req, res, next) => {
    const extraFields = Object.keys(req.body).filter(
      (field) => !validFields.includes(field)
    );
    if (extraFields.length > 0) {
      return res
        .status(400)
        .json({ error: `Unexpected fields: ${extraFields.join(", ")}` });
    }
    next();
  },
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({
          status: "fail",
          errors: errors.array().map((error) => error.msg),
        });
    }
    next();
  },
];

module.exports = createValidationMiddleware;
