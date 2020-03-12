const express = require("express");
const path = require("path");
const ArtistsService = require("./artists-service");
const artistsRouter = express.Router();
const jsonParser = express.json();

artistsRouter
  .route("/")
  .get((req, res, next) => {
    ArtistsService.getAllArtists(req.app.get("db"))
      .then(artists => {
        res.json(artists);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name, email, username, password } = req.body;
    const newArtist = {
      name,
      email,
      username,
      password
    };

    for (const [key, value] of Object.entries(newArtist)) {
      if (value == null) {
        return res.status(400).json({
          error: {
            message: `Missing '${key}' in request body`
          }
        });
      }
    }
    ArtistsService.insertArtist(req.app.get("db"), newArtist)
      .then(artist => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${artist.id}`))
          .json(artist);
      })
      .catch(next);
  });
artistsRouter
  .route("/:id")
  .all((req, res, next) => {
    ArtistsService.getById(req.app.get("db"), req.params.id)
      .then(artist => {
        if (!artist) {
          return res
            .status(404)
            .json({ error: { message: `Artist does not exist` } });
        }
        res.artist = artist;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(res.artist);
  })
  .patch(jsonParser, (req, res, next) => {
    const {
      image,
      bio,
      website,
      music,
      video,
      rate,
      location,
      travel,
      contact
    } = req.body;
    const updatedFields = {
      image,
      bio,
      website,
      music,
      video,
      rate,
      location,
      travel,
      contact
    };
    ArtistsService.updateArtist(req.app.get("db"), req.params.id, updatedFields)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    ArtistsService.deleteArtist(req.app.get("db"), req.params.id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = artistsRouter;
