/* eslint-disable camelcase */

exports.up = (pgm) => {
  // membuat table collab
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  /* menambahkan constraint UNIQUE kombinasi dari playlist_id dan user_id untuk
   menghindari duplikasi */
  pgm.addConstraint(
    'collaborations',
    'unique_playlist_id_and_user_id',
    'UNIQUE(playlist_id, user_id)',
  );

  /* membuat foreign key pada kolom playlist_id dan user_id terhadap playlists.id dan user.id */
  pgm.addConstraint(
    'collaborations',
    'fk_collaborations.playlist_id_playlists.id',
    'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'collaborations',
    'fk_collaborations.user_id_users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};
