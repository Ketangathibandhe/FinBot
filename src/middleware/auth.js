const jwt = require('jsonwebtoken')
const User = require('../models/User')
const userAuth = async(req , res , next)=>{
    try{
        const{token} =req.cookies;
        if(!token){
            return res.status(401).send('Please Login!')
        }
        const decodeObj = await jwt.verify(token,process.env.JWT_SECRET)
        const{_id}=decodeObj;
        const user = await User.findById(_id)
        if(!user){
            throw new Error("User does not exist")
        }
        req.user = user
        next()
    }catch(err){
        res.status(400).send("Error:"+err.message)
    }
}
module.exports={userAuth}