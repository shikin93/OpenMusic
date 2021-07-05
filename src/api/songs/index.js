const MusicsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { service }) => {
    const musicsHandler = new MusicsHandler(service);
    server.route(routes(musicsHandler));
  },
};
