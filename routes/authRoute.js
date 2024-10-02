const express = require("express")
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcryptjs = require("bcryptjs")
const router = express.Router()

router.route("/register",async(req,res)=>{
    const {name,email,password}=req.body;
    try{
        //check if user already exits
        let user = await User.findOne({email:email})

        if(user){
            return res.status(400).send("user already exits")
        }
        user =  new User({
            name:name,
            email:email,
            password:password
        })
        //encrypt password
        const salt = await bcryptjs.genSalt(10)
        user.password = await bcryptjs.hash(salt,password)

        //create token
        const payload = {
            user:{
                id:user.id
            }
        }
        const token = jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn:"1h"})
        res.json({token})
    }catch(error){
        console.error(error)
        res.status(500).send("error message")
    }
})

router.route("/login",async(req,res)=>{
    const {email,password}=req.body;
    try{
        let user = await User.findOne({email})
        if(!user){
            return res.status(500).json({msg:"no user found"})
        }
        //compare password
        const isMatch= await bcryptjs.compare(password,user.password)

        if(!isMatch){
            return res.status(500).json({msg:"passowrd not matched"})
        }

        const payload={
            user:{
                id:user.id
            }
        }
        const token = jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn:"1h"})
        res.json({token})

    }catch(error){
        console.log(error)
        res.status(500).json({msg:"error message"})
    }
})

module.exports = router;