const CLientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistsHandler = this.postPlaylistsHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
  }

  async postPlaylistsHandler(req, h) {
    try {
      this._validator.validatePlaylistPayload(req.payload);
      const { name } = req.payload;
      const { id: credentialId } = req.auth.credentials;

      const playlistId = await this._service.addPlaylist({
        name,
        owner: credentialId,
      });
      const response = h.response({
        status: 'success',
        message: 'playlist berhasil ditambahkan',
        data: {
          playlistId,
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

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(err);
      return response;
    }
  }

  async getPlaylistsHandler(req, h) {
    try {
      const { id: credentialId } = req.auth.credentials;
      const playlists = await this._service.getPlaylists(credentialId);
      return {
        status: 'success',
        data: {
          playlists: playlists.map((p) => ({
            id: p.id,
            name: p.name,
            username: p.username,
          })),
        },
      };
    } catch (err) {
      const response = h.response({
        status: 'fail',
        message: err.message,
      });
      response.code(500);
      console.error(err);
      return response;
    }
  }

  async deletePlaylistHandler(req, h) {
    try {
      const { playlistId } = req.params;
      const { id: credentialId } = req.auth.credentials;
      console.log(playlistId);
      console.log(credentialId);

      await this._service.verifyPlaylistOwner(playlistId, credentialId);
      await this._service.deletePlaylist(playlistId);
      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
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

module.exports = PlaylistsHandler;
