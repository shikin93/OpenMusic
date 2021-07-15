const CLientError = require('../../exceptions/ClientError');

class PlaylistsongsHandler {
  constructor(playlistService, playlistsongsService, validator) {
    this._playlistsService = playlistService;
    this._playlistsongsService = playlistsongsService;
    this._validator = validator;

    this.postPlaylistsongsHandler = this.postPlaylistsongsHandler.bind(this);
  }

  async postPlaylistsongsHandler(req, h) {
    try {
      this._validator.validatePlaylistsongsPayload(req.payload);
      const { id: credentialId } = req.auth.credentials;
      const { songId } = req.payload;
      const { playlistId } = req.params;

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      const playlistsongsId = await this._playlistsongsService.addPlaylistsongs(playlistId, songId);

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
        data: {
          songId: playlistsongsId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof CLientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = PlaylistsongsHandler;
