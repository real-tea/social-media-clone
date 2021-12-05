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
//understand again
Router.get("/:id",async (req,res) => {
    try{
        const user = await User.findById(req.params.id)
        const { password , updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = Router;