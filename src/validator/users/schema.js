const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  fullname: Joi.string().required().min(3).max(30).required(),
});

module.exports = UserPayloadSchema;
