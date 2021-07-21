const PlaylistsongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistsongs',
  version: '1.0.0',
  register: async (server, { playlistsService, playlistsongsService, validator }) => {
    const playlistsongsHandler = new PlaylistsongsHandler(
      playlistsService,
      playlistsongsService,
      validator,
    );
    server.route(routes(playlistsongsHandler));
  },
};
