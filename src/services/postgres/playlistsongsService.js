const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistsongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addPlaylistsongs(playlistId, songId) {
    const id = `playlistsongs-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlists, lagu tidak ditemukan');
    }

    await this._cacheService.delete(`playlistSongs:${playlistId}`);
    return result.rows[0].id;
  }

  async getPlaylistsongs(owner, playlistId) {
    try {
      // mendapatkan playlistsongs dari cache
      const result = await this._cacheService.get(`playlistSongs:${playlistId}`);
      return JSON.parse(result);
    } catch (err) {
      // mendapatkan playlistsongs dari database
      const query = {
        text: 'SELECT music.id, music.title, music.performer FROM music LEFT JOIN playlistsongs ON playlistsongs.song_id = music.id LEFT JOIN playlists ON playlists.id = playlistsongs.playlist_id LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id WHERE playlists.owner = $1 OR collaborations.user_id = $1',
        values: [owner],
      };

      const result = await this._pool.query(query);

      // menyimpan playlistsongs pada cache sebelum memanggil fungsi getPlaylistsongs
      await this._cacheService.set(`playlistSongs:${playlistId}`, JSON.stringify(result.rows));
      return result.rows;
    }
  }

  async deleteSongInPlaylists(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal dihapus dari playlist, lagu tidak ditemukan');
    }
    await this._cacheService.delete(`playlistSongs:${playlistId}`);
  }
}

module.exports = PlaylistsongsService;
