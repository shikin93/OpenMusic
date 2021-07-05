const CLientError = require('../../exceptions/ClientError');

class MusicsHandler {
  constructor(service) {
    this._service = service;
    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHanler.bind(this);
  }

  // Menambahkan lagu
  async postSongHandler(req, h) {
    try {
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
    } catch (err) {
      if (err instanceof CLientError) {
        const res = h.response({
          status: 'fail',
          message: err.message,
        });
        res.code(err.statusCode);
        return res;
      }
      const res = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server',
      });
      res.code(500);
      console.log(err);
      return res;
    }
  }

  // Menampilkan semua lagu dengan parameter id, title, performer
  async getSongsHandler(h) {
    try {
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
    } catch (err) {
      const res = h.response({
        status: 'fail',
        message: err.message,
      });
      res.code(500);
      console.log(err);
      return res;
    }
  }

  // Menampilakn lagu berdasarkan id
  async getSongByIdHandler(req, h) {
    try {
      const { songId } = req.params;
      const song = await this._service.getSongById(songId);
      return {
        status: 'success',
        data: {
          song,
        },
      };
    } catch (err) {
      if (err instanceof CLientError) {
        const res = h.response({
          status: 'fail',
          message: err.message,
        });
        res.code(err.statusCode);
        return res;
      }
      const res = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server',
      });
      res.code(500);
      console.log(err);
      return res;
    }
  }

  // Mengubah lagu berdasarkan id
  async putSongByIdHandler(req, h) {
    try {
      const { songId } = req.params;
      await this._service.editSongById(songId, req.payload);

      return {
        status: 'success',
        message: 'lagu berhasil diperbarui',
      };
    } catch (err) {
      if (err instanceof CLientError) {
        const res = h.response({
          status: 'fail',
          message: err.message,
        });
        res.code(err.statusCode);
        return res;
      }
      const res = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server',
      });
      res.code(500);
      console.log(err);
      return res;
    }
  }

  // Menghapus lagu berdasarkan id
  async deleteSongByIdHanler(req, h) {
    try {
      const { songId } = req.params;
      await this._service.deleteSongById(songId);
      return {
        status: 'success',
        message: 'Lagu berhasil dihapus',
      };
    } catch (err) {
      if (err instanceof CLientError) {
        const res = h.response({
          status: 'fail',
          message: err.message,
        });
        res.code(err.statusCode);
        return res;
      }
      const res = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server',
      });
      res.code(500);
      console.log(err);
      return res;
    }
  }
}

module.exports = MusicsHandler;
