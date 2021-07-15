const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

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

// Playlists
const playlists = require('./api/playlist');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlist');

// playlistsongs
const playlistsongs = require('./api/playlistsongs');
const PlaylistsongsService = require('./services/postgres/playlistsongsService');
const PlaylistsongsValidator = require('./validator/playlistsongs');

const init = async () => {
  const musicServices = new MusicService();
  const usersService = new UserService();
  const authenticationsService = new AuthenticationsService();
  const playlistsongsService = new PlaylistsongsService();
  const playlistsService = new PlaylistsService(playlistsongsService);
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

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // strategi authentikasi jwt
  server.auth.strategy('musicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: playlistsongs,
      options: {
        playlistsService,
        playlistsongsService,
        validator: PlaylistsongsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
