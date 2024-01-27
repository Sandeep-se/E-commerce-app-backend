const user=require('./model.js')
const express=require('express')
const crypto=require('crypto')
const jwt=require('jsonwebtoken')


const signUp=async(req,res)=>
{
    try{
        const {name,email,password}=req.body;
        const User=await user.findOne({email});
        if(User)
        {
            return res.json({message:'registered'});
        }
        const newUser=new user({name,email,password})
        console.log(newUser.id)
        await newUser.save()
        
        return res.json({message:'signUp success',userId:newUser._id})
    }
    catch(err)
    {
        res.json(err)
    }
}


const signIn=async(req,res)=>
 { 
    try{
        const {email,password}=req.body;
        const check=await user.findOne({email})
        if(!check)
        {
            return res.json({message:'incorrect email'});
        }
        if(check.password!==password)
        {
            return res.json({message:'incorrect password'})
        }
        console.log('login sucess')
        return res.json({message:'signIn success',userId:check._id})
    }
    catch(err)
    {
        res.json(err)
    }
    
}

const logout=(req,res)=>{
    res.clearCookie('token',
    {
        path:'/',
        secure:true,
        sameSite:'None'
    })
    res.json('logout success')
  }
module.exports={signUp,signIn,logout}