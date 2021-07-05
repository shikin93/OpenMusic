/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('music', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'integer',
      notNull: true,
    },
    performer: {
      type: 'TEXT',
      notNull: true,
    },
    genre: {
      type: 'TEXT',
    },
    duration: {
      type: 'integer',
    },
    inserted: {
      type: 'TEXT',
      notNull: true,
    },
    updated: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('music');
};
