const Joi = require('joi');

const PlaylistsongsPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = PlaylistsongsPayloadSchema;
