
const express = require('express')
const songRouter = express.Router()
const uploadSong = require('../controller/upload.controller')
const upload = require('../middleware/upload.middleware')

songRouter.post('/',upload.single('song'),uploadSong.songController)

songRouter.get('/',uploadSong.getSong)

module.exports = songRouter