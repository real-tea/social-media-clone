const Router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//create a post : 

Router.post("/",async (req,res)=>{
    const newPost = new Post(req.body);
    try{
        const savedPost = newPost.save();
        res.status(200).json("posted successfully");
    }catch(err){
        res.status(500).json(err);
    }

});

//update a post 

Router.put("/:id",async (req,res) =>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
        await post.updateOne({ $set : req.body });
        res.status(200).json("post updated");}
        else{
            res.status(403).json("you can delete only your posts");
        }

    }catch(err){
        res.status(500).json(err);
    }
})

//Delete a post

Router.delete("/:id", async(req,res) =>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId)
        {
            await post.deleteOne();
            res.status(200).json("post deleted succesfully");
        }
        else{
            res.status(403).json("can only delete your post");
        }
    }catch(err){
        res.status(500).json(err);
    }
})

//upvote/downvote  a post

Router.put("/:id/like",async (req,res) =>{ 
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({ $push : {likes : req.body.userId} });
            res.status(200).json("Post liked");
        }else{
            await post.updateOne({ $pull : { likes : req.body.userId} })
            res.status(200).json("Post Disliked");
        }

    }catch(err){
        res.status(500).json(err);
    }
})
//get a post 

Router.get("/:id",async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);

    }catch(err){
        res.status(500).json(err);
    }
})


//get all timeline posts 
Router.get("/timeline/all" ,async (req,res)=>{
    try{
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId : currentUser._id });
        const FriendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId : friendId })
            })
        );
        res.json(userPosts.concat(...FriendPosts))

    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = Router;