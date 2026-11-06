
const express = require('express')
const app = express()
const authRouter = require('./routes/auth.route')
const songRouter = require('./routes/song.route')
const cookieParser = require('cookie-parser')
const cors = require('cors')

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use('/api/auth',authRouter)
app.use('/api/songs',songRouter)

module.exports = app