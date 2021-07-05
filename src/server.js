const Hapi = require('@hapi/hapi');
const MusicServices = require('./services/inMemory/MusicServices');
const songs = require('./api/songs');
const CLientError = require('./exceptions/ClientError');
const MusicValidator = require('./validator/music');

require('dotenv').config();

const init = async () => {
  const musicServices = new MusicServices();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.ext({
    type: 'onPreResponse',
    method(req, h) {
      const { response } = req;

      if (response instanceof CLientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      return response;
    },
  });

  await server.register({
    plugin: songs,
    options: {
      service: musicServices,
      validator: MusicValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
