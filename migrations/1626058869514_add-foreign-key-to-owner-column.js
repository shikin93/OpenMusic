/* eslint-disable camelcase */

exports.up = (pgm) => {
  // memebuat user baru
  pgm.sql(
    "INSERT INTO users(id, username, password, fullname) VALUES('user', 'user', 'user', 'user')",
  );

  // mengubah nilai owner pada playlists yg ownernya null
  pgm.sql("UPDATE playlists SET owner = 'user' WHERE owner = NULL");

  // memberikan constraint foreign key pada owner terhadap kolom id dari tabel users
  pgm.addConstraint(
    'playlists',
    'fk_playlists.owner_user.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  // menghapus constraint fk_playlists.onwer_user.id pada tabel playlists
  pgm.dropConstraint('playlists', 'fk_playlists.owner_user.id');

  // mengubah nilai owner old_songs pada playlists menjadi NULL
  pgm.sql('UPDATE playlists SET owner = NULL WHERE owner = "user"');

  // menghapus user baru
  pgm.sql('DELETE FROM users WHERE id = "user"');
};
