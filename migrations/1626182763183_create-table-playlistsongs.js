/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlistsongs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  // menambahkan constraint UNIQUE, kombinasi dari playlist_id dan song_id
  pgm.addConstraint(
    'playlistsongs',
    'unique_playlist_id_and_song_id',
    'UNIQUE(playlist_id, song_id)',
  );

  // memberikan constraint foreign key pada kolom playlist_id dan song_id
  // terhadap playlists.id dan music.id
  pgm.addConstraint(
    'playlistsongs',
    'fk_playlistsongs.playlist_id_playlists.id',
    'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'playlistsongs',
    'fk_playlistsongs.song_id_music.id',
    'FOREIGN KEY(song_id) REFERENCES music(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('palylistsongs');
};
