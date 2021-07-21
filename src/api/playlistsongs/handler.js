const CLientError = require('../../exceptions/ClientError');

class PlaylistsongsHandler {
  constructor(playlistService, playlistsongsService, validator) {
    this._playlistsService = playlistService;
    this._playlistsongsService = playlistsongsService;
    this._validator = validator;

    this.postPlaylistsongsHandler = this.postPlaylistsongsHandler.bind(this);
    this.getPlaylistsongsHandler = this.getPlaylistsongsHandler.bind(this);
    this.deleteSongInPlaylistsHandler = this.deleteSongInPlaylistsHandler.bind(this);
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
    } catch (err) {
      if (err instanceof CLientError) {
        const response = h.response({
          status: 'fail',
          message: err.message,
        });
        response.code(err.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(err);
      return response;
    }
  }

  async getPlaylistsongsHandler(req, h) {
    try {
      const { playlistId } = req.params;
      const { id: credentialId } = req.auth.credentials;
      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      const songs = await this._playlistsongsService.getPlaylistsongs(credentialId);
      return {
        status: 'success',
        data: {
          songs: songs.map((s) => ({
            id: s.id,
            title: s.title,
            performer: s.performer,
          })),
        },
      };
    } catch (err) {
      if (err instanceof CLientError) {
        const response = h.response({
          status: 'fail',
          message: err.message,
        });
        response.code(err.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(err);
      return response;
    }
  }

  async deleteSongInPlaylistsHandler(req, h) {
    try {
      this._validator.validatePlaylistsongsPayload(req.payload);
      const { id: credentialId } = req.auth.credentials;
      const { playlistId } = req.params;
      const { songId } = req.payload;

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      await this._playlistsongsService.deleteSongInPlaylists(playlistId, songId);
      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      };
    } catch (err) {
      if (err instanceof CLientError) {
        const response = h.response({
          status: 'fail',
          message: err.message,
        });
        response.code(err.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(err);
      return response;
    }
  }
}

module.exports = PlaylistsongsHandler;
