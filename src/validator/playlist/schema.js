const Joi = require('joi');

const PlaylistsPayloadSchema = Joi.object({
  name: Joi.string().max(50).required(),
});

module.exports = PlaylistsPayloadSchema;
