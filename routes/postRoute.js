const express = require("express")
const Post = require("../models/Post")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")
const { post } = require("./authRoute")

//create a post

router.post("/",authMiddleware,async(req,res)=>{
    const {title,content}=req.body;
    try{
        let post =  new Post({
            title,
            content,
            author:post.user.id,
        })
        let newPost = await post.save()
        res.json({newPost})
    }catch(error){
        console.error(error.message)
        res.status(500).json({msg:"no post created"})
    }
})

//get all post

router.get("/",async(req,res)=>{
    try{
        let posts = await Post.find().populate('author',['title','content'])
        let allposts = await posts.save()
        res.json(posts)
    }
    catch(error){
        res.status(500).json({msg:"error"})
    }
})

//get a single post

router.get("/",async(req,res)=>{
    try{
        let posts = await Post.findById(req.params.id)

        if(!posts){
            return res.status(400).json("no post found")
        }
        let newpost = await posts.save()
        res.json(newpost)
    }catch(error){
        console.error(error.message)
        res.status(500).json("server errir")
    }
})

//update a single post

router.put("/",authMiddleware,async(req,res)=>{
const {title,content}=req.body;
try{
    let post = await Post.findById(req.params.id)
    if(!post){
        return res.status(500).json("no post")
    }
    post = new Post.findByIdAndUpdate(req.params.id,{title,content},{new:true})
    let newpost = await post.save()
    res.json(newpost)
}catch(error){
    res.status(500).json("server error")
}
})

//delete a single post

router.delete("/",authMiddleware,async(req,res)=>{
    try{
        let post= await Post.findById(req.params.id)
        if(!post){
            return res.status(500).json({msg:"no post"})
        }
        let newpost = await post.remove()
        res.json(newpost)
    }catch(error){
        console.error(error)
        res.status(500).json("server error")
    }
})

module.exports = router;