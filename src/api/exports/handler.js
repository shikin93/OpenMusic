class ExportsHandler {
  constructor(playlistsService, service, validator) {
    this._playlistsService = playlistsService;
    this._service = service;
    this._validator = validator;

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  async postExportPlaylistHandler(req, h) {
    this._validator.validateExportPlaylistPayload(req.payload);
    const { playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const message = {
      userId: credentialId,
      targetEmail: req.payload.targetEmail,
    };

    await this._service.sendMessage('export:playlist', JSON.stringify(message));
    const res = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    res.code(201);
    return res;
  }
}

module.exports = ExportsHandler;
