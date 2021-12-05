const Router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");


//register
Router.post("/register", async (req,res) => {

    try{    
        const salt = await bcrypt.genSalt(10); //hashing password using bcrypt
        const hashedPassword = await bcrypt.hash(req.body.password,salt);

        const newUser = await new User({  //awaiting feilds from user
            username : req.body.username,
            email : req.body.email,
            password : hashedPassword
        })

        const user = await newUser.save(); //save user in the database
        res.status(200).json(user);
    }catch(err){
        console.log(err);
        res.status(500);
    }
})



//Login user in the database
Router.post("/login",async (req,res) => {
    try{
        const user = await User.findOne({ email : req.body.email })
        !user && res.status(404).json("User not found");

        const validpassword = await bcrypt.compare(req.body.password, user.password);
        !validpassword && res.status(400).json("incorrect Password");

        res.status(200).json({
            message : "welcome",
            user
        })
    }catch(err){
        // console.log(err)
        res.status(500).json({message : "error 500"});
    }
})

module.exports = Router;