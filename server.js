const express = require("express");
// const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");

const UserRoute = require("./routes/users");
const AuthRoute = require("./routes/auth");
const PostRoute = require("./routes/post");

const bodyParser = require("body-parser");

const app = express();
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect('mongodb://127.0.0.1:27017/Social-Media',
{ useNewUrlParser: true}).then(()=>{
    console.log("database connection established");
}).catch((err)=>{
    console.log(err)
})

app.use(helmet());
app.use(morgan("common"));

app.use("/api/users",UserRoute);
app.use("/api/auth",AuthRoute);
app.use("/api/posts",PostRoute);



app.listen(4000,()=>{
    console.log("server started")
})