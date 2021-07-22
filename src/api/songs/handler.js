class MusicsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHanler.bind(this);
  }

  // Menambahkan lagu
  async postSongHandler(req, h) {
    this._validator.validateSongPayload(req.payload);
    const { title, year, performer, genre, duration } = req.payload;
    const songId = await this._service.addSong({
      title,
      year,
      performer,
      genre,
      duration,
    });
    const res = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId,
      },
    });
    res.code(201);
    return res;
  }

  // Menampilkan semua lagu dengan parameter id, title, performer
  async getSongsHandler() {
    const songs = await this._service.getSongs();
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
  }

  // Menampilakn lagu berdasarkan id
  async getSongByIdHandler(req) {
    const { songId } = req.params;
    const song = await this._service.getSongById(songId);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  // Mengubah lagu berdasarkan id
  async putSongByIdHandler(req) {
    this._validator.validateSongPayload(req.payload);
    const { songId } = req.params;
    await this._service.editSongById(songId, req.payload);

    return {
      status: 'success',
      message: 'lagu berhasil diperbarui',
    };
  }

  // Menghapus lagu berdasarkan id
  async deleteSongByIdHanler(req) {
    const { songId } = req.params;
    await this._service.deleteSongById(songId);
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = MusicsHandler;
