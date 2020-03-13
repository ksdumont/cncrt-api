const knex = require("knex");
const { expect } = require("chai");
const fixtures = require("./artists-fixtures");
const app = require("../src/app");
require("dotenv").config();

describe("artist endpoints", () => {
  let db;
  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });
  after("disconnect from db", () => db.destroy());

  before("cleanup", () => db.raw("TRUNCATE artists"));
  afterEach("cleanup", () => db.raw("TRUNCATE artists"));

  describe("GET /api/artists", () => {
    context(`Given no artists`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/artists")
          .expect(200, []);
      });
    });
    context(`Given there are artists in the database`, () => {
      const testArtists = fixtures.makeArtistsArray();

      beforeEach("insert Artists", () => {
        return db.into("artists").insert(testArtists);
      });
      it("gets the artists", () => {
        return supertest(app)
          .get("/api/artists")
          .expect(200, testArtists);
      });
    });
  });
  describe(`GET /api/artists/:artistId`, () => {
    context(`given no artists`, () => {
      it("responds with 404 when artist does not exist", () => {
        return supertest(app)
          .get("/api/artists/123")
          .expect(404, { error: { message: `Artist does not exist` } });
      });
    });
    context(`given there are artists in the database`, () => {
      const testArtists = fixtures.makeArtistsArray();

      beforeEach("insert artists", () => {
        return db.into("artists").insert(testArtists);
      });
      it(`responds with 200 and the specified artists`, () => {
        const artistId = 2;
        const expectedArtist = testArtists[artistId - 1];
        return supertest(app)
          .get(`/api/artists/${artistId}`)
          .expect(200, expectedArtist);
      });
    });
  });
  describe("POST /api/artists", () => {
    it(`adds a new artist to the database`, () => {
      const newArtist = {
        name: "keith",
        email: "keith@gmail.com",
        username: "keith",
        password: "keith"
      };
      return supertest(app)
        .post("/api/artists")
        .send(newArtist)
        .expect(201)
        .expect(res => {
          expect(res.body.name).to.eq(newArtist.name);
          expect(res.body.email).to.eq(newArtist.email);
          expect(res.body.username).to.eq(newArtist.username);
          expect(res.body.password).to.eq(newArtist.password);
          expect(res.headers.location).to.eql(`/api/artists/${res.body.id}`);
        })
        .then(res =>
          supertest(app)
            .get(`/api/artists/${res.body.id}`)
            .expect(res.body)
        );
    });
  });
  describe(`DELETE /api/artists/:artistId`, () => {
    context(`Given there are artists`, () => {
      const testArtists = fixtures.makeArtistsArray();

      beforeEach("insert artists", () => {
        return db.into("artists").insert(testArtists);
      });
      it("removes the artist from the database", () => {
        const idToRemove = 2;
        const expectedArtists = testArtists.filter(a => a.id !== idToRemove);
        return supertest(app)
          .delete(`/api/artists/${idToRemove}`)
          .expect(204)
          .end()
          .then(() =>
            supertest(app)
              .get("/api/artists")
              .expect(expectedArtists)
          );
      });
    });
  });
});
