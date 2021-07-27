class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postExportSongsHandler = this.postExportSongsHandler.bind(this);
  }

  async postExportSongsHandler(req, h) {
    this._validator.validateExportSongsPayload(req.payload);

    const message = {
      userId: req.auth.credentials.id,
      targetEmail: req.payload.targetEmail,
    };

    await this._service.sendMessage('export:songs', JSON.stringify(message));
    const res = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrian',
    });
    res.code(201);
    return res;
  }
}

module.exports = ExportsHandler;
