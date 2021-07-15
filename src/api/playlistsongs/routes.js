const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists/{playlistId}/songs',
    handler: handler.postPlaylistsongsHandler,
    options: {
      auth: 'musicapp_jwt',
    },
  },
];

module.exports = routes;
