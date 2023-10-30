const express=require('express');

const {PostsModel}=require('../model/posts.model')

const {auth}=require('../middleware/auth.middleware')

const postRoutes = express.Router();
postRoutes.use(auth);

postRoutes.post("/add",async(req,res)=>{
    const payload=req.res
    console.log(payload)

    try{
        const post=new PostsModel(payload)
        await post.save()
        res.status(200).send({"msg":"new post has been adeed"})

    }catch(err){
    res.status(200).send({"msg":err})
    }
})

postRoutes.get("/posts/:id",async(req,res)=>{
    const post=await PostsModel.find({userId:req.body.userId,_id:req.params.id})
    res.status(200).send(post)
})

postRoutes.patch("/update/:id",auth,async(req,res)=>{
    const {id}= req.params
    const post=await PostsModel.findOne({_id:id})
    console.log(post)
  try{
await PostsModel.findByIdAndUpdate({_id:id},req.body);
res.status(200).send(post)
  }catch(err){
    res.status(200).send({"error":err})
  }
    
})

postRoutes.delete("/delete/:id",auth,async(req,res)=>{
    const {id}= req.params
    const post=await PostsModel.findOne({_id:id})
    console.log(post)
  try{
    if(req.body.userId!==post.userId){
        res.status(200).send({"msg":"You are not authorized"})
    }
    else{
        await PostsModel.findByIdAndDelete({_id:id});
        res.status(200).send({"msg":"post deleted"})
    }

  }catch(err){
    res.status(200).send({"error":err})
  }
    
})

postRoutes.get('/posts', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Page number
    const limit = 3; // Number of posts per page
  
    try {
      const posts = await PostsModel.find()
        .skip((page - 1) * limit)
        .limit(limit);
  
      res.json(posts);
    } catch (err) {
      res.status(400).send({ "error": err.message });
    }
  })

  postRoutes.get("/posts",async(req,res)=>{
    const userId = req.user.id; // Get the logged-in user's ID
    const minComments = parseInt(req.query.minComments) || 0;
    const maxComments = parseInt(req.query.maxComments) || Infinity;
    const device = req.query.device;
  
    try {
      const posts = await PostsModel.find({
        user: userId,
        no_of_comments: { $gte: minComments, $lte: maxComments },
        device: device
      }).sort({ no_of_comments: -1 }); // Sort by number of comments in descending order
  
      res.json(posts);
    } catch (err) {
      res.status(400).send({ "error": err.message });
    }
})
module.exports={
    postRoutes
}