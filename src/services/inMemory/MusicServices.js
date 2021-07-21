const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class MusicServices {
  constructor() {
    this._songs = [];
  }

  addSong({ title, year, performer, genre, duration }) {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newSongs = {
      id,
      title,
      year,
      performer,
      genre,
      duration,
      insertedAt,
      updatedAt,
    };

    this._songs.push(newSongs);

    const isSuccess = this._songs.filter((song) => song.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError('Tidak dapat menambahkan lagu');
    }
    return id;
  }

  getSongs() {
    return this._songs;
  }

  getSongById(songId) {
    const song = this._songs.filter((s) => s.id === songId)[0];
    if (!song) {
      throw new NotFoundError('Lagu yang anda cari tidak ada');
    }
    return song;
  }

  editSongById(songId, { title, year, performer, genre, duration }) {
    const index = this._songs.findIndex((song) => song.id === songId);

    if (index === -1) {
      throw new NotFoundError('Tidak dapat memperbarui lagu. lagu tidak ditemukan');
    }
    const updatedAt = new Date().toISOString();
    this._songs[index] = {
      ...this._songs[index],
      title,
      year,
      performer,
      genre,
      duration,
      updatedAt,
    };
  }

  deleteSongById(songId) {
    const index = this._songs.findIndex((song) => song.id === songId);
    if (index === -1) {
      throw new NotFoundError('Tidak dapat menghapus lagu. lagu tidak ditemukan');
    }
    this._songs.splice(index, 1);
  }
}

module.exports = MusicServices;
