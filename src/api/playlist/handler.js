class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistsHandler = this.postPlaylistsHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
  }

  async postPlaylistsHandler(req, h) {
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
  }

  async getPlaylistsHandler(req) {
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
  }

  async deletePlaylistHandler(req) {
    const { playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deletePlaylist(playlistId, credentialId);
    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }
}

module.exports = PlaylistsHandler;
