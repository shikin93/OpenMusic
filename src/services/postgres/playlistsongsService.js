const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistsongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistsongs(playlistId, songId) {
    const id = `playlistsongs-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlists');
    }
    return result.rows[0].id;
  }

  async getPlaylistsongs(owner) {
    const query = {
      text: 'SELECT music.id, music.title, music.performer FROM music LEFT JOIN playlistsongs ON playlistsongs.song_id = music.id LEFT JOIN playlists ON playlists.id = playlistsongs.playlist_id WHERE playlists.owner = $1',
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyPlaylistsongs(playlistId, songId) {
    const query = {
      text: 'SELECT * FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Playlistsongs gagal diverifikasi');
    }
  }
}

module.exports = PlaylistsongsService;
