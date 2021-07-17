const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUsers({ username, password, fullname }) {
    await this.verifyNewUsername(username);
    const id = `user-${nanoid(16)}`;
    const hashedPass = await bcrypt.hash(password, 5);
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPass, fullname],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);
    if (result.rowCount > 0) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan');
    }
  }
}

module.exports = UsersService;
