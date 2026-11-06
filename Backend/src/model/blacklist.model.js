
const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true,'token is required']
    }
})

const blackListModel = mongoose.model('tokens', tokenSchema)

module.exports = blackListModel