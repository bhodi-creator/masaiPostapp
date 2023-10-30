const express = require("express");
const jwt =require("jsonwebtoken")
const bcrypt=require("bcrypt")

const {UserModel}=require('../model/user.model')
const {BlacklistedToken} = require('../model/blacklisted.model')
const userRoutes = express.Router()

userRoutes.post("/register",async(req,res)=>{
    const {email,password,name,gender,age,city,is_married}=req.body;
    console.log(email,password,name,gender,age,city,is_married)

    try{
        bcrypt.hash(password,5,async(err,hash)=>{
            const user=new UserModel({email,name,gender,age,city,is_married,password:hash})
            await user.save();
            res.status(200).send({"msg":"A new User have been added"})
        })
    }catch(err){
        res.status(200).send.apply({"error":err})
    }
})

userRoutes.post("/login",async(req,res)=>{
    const {email,password}=req.body
    const user = await UserModel.findOne({email});

    try{
        bcrypt.compare(password,user.password,async(err,result)=>{
            if(result){
                const token=jwt.sign({userId:user._id,name:user.name},"masai")
                res.status(200).send({"msg":"Login Succesfulll" ,"token":token})
            }
            else{
                res.status(200).send({"msg":"wrong credintioal" }) 
            }
        })

    }catch(err){
        res.status(200).send({"msg":err }) 
    }
})

userRoutes.post('/logout', async (req, res) => {
    const tokenToBlacklist = req.token; // Get the user's token from the request
  
    try {
      // Add the token to the blacklist
      const blacklistedToken = new BlacklistedToken({ token: tokenToBlacklist });
      await blacklistedToken.save();
  
      res.status(200).send({ 'message': 'Logged out successfully' });
    } catch (err) {
      res.status(400).send({ 'error': err.message });
    }
  });

module.exports={
    userRoutes
}