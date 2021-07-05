// eslint-disable-next-line camelcase
const mapDBToModel = ({ id, title, year, performer, genre, duration, inserted, updated }) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt: inserted,
  updatedAt: updated,
});

module.exports = {
  mapDBToModel,
};
