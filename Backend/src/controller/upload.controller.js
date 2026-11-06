
const id3 = require('node-id3')
const songServices = require('../services/song.services')
const songModel = require('../model/song.model')

async function songController(req,res){

   const tag = id3.read(req.file.buffer)
   const {mood} = req.body

//    const songFile = await songServices.storageService({
//     buffer : req.file.buffer,
//     filename : tag.title + ".mp3",
//     folder : "/moodify2/songs"
//    })

//    const posterFile = await songServices.storageService({

//     buffer : tag.image.imageBuffer,
//     filename : tag.title + ".jpeg",
//     folder : "/moodify2/poster"
//    })

const [songFile,posterFile] = await Promise.all([
    songServices.storageService({
        buffer : req.file.buffer,
        filename : tag.title + ".mp3",
        folder : "/moodify2/songs"
    }),
    songServices.storageService({
        buffer : tag.image.imageBuffer,
        filename : tag.title + ".jpeg",
        folder : "/moodify2/poster"
    })
])


   const song = await songModel.create({

    url : songFile.url,
    posterImg : posterFile.url,
    title : tag.title,
    mood

   })
   
   res.status(201).json({
    message : 'song created sucessfully',
    song
   })
   
}

async function getSong(req,res){

    const { mood }  =  req.query

    const song = await songModel.find({mood})

    res.status(200).json({
        message : 'song fetched successfully',
        song
    })
    
}

module.exports = {
    songController,
    getSong
}