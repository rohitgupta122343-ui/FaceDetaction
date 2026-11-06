
const userModel = require('../model/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const blackListModel = require('../model/blacklist.model')
const redis = require('../config/cache')

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
}

async function registerController(req,res) {

    const { username,email,password } = req.body

    const isUserExtist = await userModel.findOne({email})

    if(isUserExtist){
        return res.status(409).json({
            message : 'User Already Extist'
        })
    }

    const hash = await bcrypt.hash(password,10)

    const user = await userModel.create({
        username,
        email,
        password:hash
    })

    const token = jwt.sign({id:user._id},process.env.JWT_SECRECT,{expiresIn:'3d'})

    res.cookie('token',token,{...cookieOptions,maxAge:3*24*60*60*1000})

    res.status(201).json({
        message : 'user created sucessfully',
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })


}   

async function loginController(req,res) {

   const { username,email,password } = req.body

   const user = await userModel.findOne({
    $or:[
        {username},
        {email}
    ]
   }).select('+password')

   if(!user){
        return res.status(404).json({
            message : 'user not found'
        })
   }

   const isValidPass = await bcrypt.compare(password,user.password)

   if(!isValidPass){
    return res.status(401).json({
        message : 'Invalid Password'
    })
   }

   const token = jwt.sign({id:user._id},process.env.JWT_SECRECT,{expiresIn:'3d'})

   res.cookie('token',token,{...cookieOptions,maxAge:3*24*60*60*1000})

   res.status(200).json({
    message : 'user LoggedIn..',
    user:{
        id:user._id,
        username:user.username,
        email:user.email
    }
   })
    
}

async function getMeController(req,res){

    const userId = req.user

    const user = await userModel.findById(userId)

    res.status(200).json({
        message : 'User Fetch sucessfully',
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })

}

async function logoutController(req,res){

    const token = req.cookies.token 

    if(token){
        await redis.set(token,Date.now().toString(),"EX",60*60)
    }

    res.clearCookie('token',cookieOptions)

    res.status(200).json({
        message : 'user logout sucessfully.'
    })

}

module.exports = {
    registerController,
    loginController,
    getMeController,
    logoutController
}