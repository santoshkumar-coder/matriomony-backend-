const AppError = require("../utils/AppError");

const validate = (schema) => (req, res, next) => {
  console.log(req.body)
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    return next(
      new AppError(error.details[0].message, 400)
    );
  }

  req.body = value;
  next();
};

module.exports = validate;