
const express = require('express')
const authRouter = express.Router()
const authController = require('../controller/auth.controller')
const authUser = require('../middleware/auth..middleware')

authRouter.post('/register',authController.registerController)

authRouter.post('/login',authController.loginController)

authRouter.get('/get-me',authUser,authController.getMeController)

authRouter.post('/logout',authController.logoutController)

module.exports = authRouter