const ArtistsService = {
  getAllArtists(knex) {
    return knex.select("*").from("artists");
  },
  insertArtist(knex, newArtist) {
    return knex
      .insert(newArtist)
      .into("artists")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  updateArtist(knex, id, newFields) {
    return knex("artists")
      .where({ id })
      .update(newFields)
  },
  getById(knex, id) {
    return knex
      .from("artists")
      .select("*")
      .where("id", id)
      .first();
  },
  deleteArtist(knex, id) {
    return knex("artists")
      .where({ id })
      .delete();
  }
};
module.exports = ArtistsService;
