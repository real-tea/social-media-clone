const User = require("../models/User");
const Router = require("express").Router();
const bcrypt = require("bcrypt");


//Updating a user : 
Router.put("/:id", async(req,res) =>{
    if(req.body.userId === req.params.id)
    {
        if(req.body.password)
        {
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt);
            }catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set : req.body,
            })
            res.status(200).json("Account updated");
        }catch(err){
            return res.status(500).json(err);
        }
    }
    else{
        return res.status(400).json({ message : "you can only Update your account "})
    }
});

//Deleting a User
Router.delete("/:id",async (req,res)=>{
    if(req.body.userId === req.params.id)
    {
        try{
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        }catch(err){
            return res.status(500).json({message : err});
        }
    }else{
        return res.status(400).json({ message : "You can only delete your account" });
    }
});  

//get a user

Router.get("/:id",async (req,res) => {
    try{
        const user = await User.findById(req.params.id)
        const { password , updatedAt, ...other } = user._doc; //_doc is the instance of the model
        res.status(200).json(other); //password and updated at won't be send and all parameters in "other" field will be send
    }catch(err){
        res.status(500).json(err);
    }
})

//follow a user 

Router.put("/:id/follow",async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){//currentUser 
                await user.updateOne({ $push : {followers : req.body.userId} });
                await currentUser.updateOne({ $push : {followings : req.params.id} });
                res.status(200).json("user has been followed");
            }else{
                res.status(403).json("you already follow this user");
            }

        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("user can't be followed")
    }
})

//unfollow a user : 

Router.put("/:id/unfollow", async (req,res) =>{
    if(req.body.userId !==req.params.id)
    { 
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({ $pull : {followers : req.body.userId} });
                await currentUser.updateOne({ $pull : { following : req.params.id } });
                res.status(200).json("user has been unfollowed");
            }else{
                res.status(403).json("you already unfollowed the user");
            }

        }catch(err){
            res.status(500).json(err);
        }
    }
    else{
        res.status(403).json("you unfollowed the user")
    }

})

module.exports = Router;