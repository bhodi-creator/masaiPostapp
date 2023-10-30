const mongoose=require("mongoose")

const postSchema=mongoose.Schema({
    title:String,
    body:String,
    device:String,
    no_of_comments:Number
},{
    versionKey:false
})

const PostsModel=mongoose.model("posts",postSchema);

module.exports={
    PostsModel
}