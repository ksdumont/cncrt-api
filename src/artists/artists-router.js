const express = require('express')
const ArtistsService = require('./artists-service')
const artistsRouter = express.Router()
const jsonParser = express.json()

artistsRouter
.route('/')
