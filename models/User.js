const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        require : true,
        unique : true
    },
    email : {
        type : String,
        require : true,
        unique : true,
    },
    password : {
        type : String,
        require : true,
        min : 5
    },
    profilePicture : {
        type : String,
        default : ""
    },
    followers : {
        type : Array,
        default : []
    },
    following : {
        type : Array ,
        default : []
    },
    desc : {
        type : String,
        min : 4
    },
    city : {
        type : String,
    },
    relationship : {
        type : Number,
        enum  : [1,2,3]
    }
},{
    timestamps : true
});

module.exports = mongoose.model("User",UserSchema);