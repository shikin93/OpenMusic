const Hapi = require('@hapi/hapi');

const CLientError = require('./exceptions/ClientError');

require('dotenv').config();
// Songs
const MusicService = require('./services/postgres/MusicService');
const MusicValidator = require('./validator/music');
const songs = require('./api/songs');

// Users
const UserService = require('./services/postgres/UsersService');
const UserValidator = require('./validator/users');
const users = require('./api/users');

// Authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

const init = async () => {
  const musicServices = new MusicService();
  const usersService = new UserService();
  const authenticationsService = new AuthenticationsService();
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

  await server.register([
    {
      plugin: songs,
      options: {
        service: musicServices,
        validator: MusicValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UserValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
