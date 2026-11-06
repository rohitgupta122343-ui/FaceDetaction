
const jwt = require('jsonwebtoken')
const blackListModel = require('../model/blacklist.model')
const redis = require('../config/cache')

async function authUser(req,res,next){  

    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message : 'Token Not Provided'
        })
    }

    // const isExtistBlackList = await blackListModel.findOne({token})

    const isExtistBlackList = await redis.get(token)

    if(isExtistBlackList){
        return res.status(401).json({
            message :'Unauthorized .'
        })
    }


    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRECT)

        req.user = decoded.id

        next()

    }catch(err){    
        console.log(err)
    }

}

module.exports = authUser