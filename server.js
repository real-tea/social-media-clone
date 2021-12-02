const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

const bodyParser = require("body-parser");

const app = express();
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect('mongodb://127.0.0.1:27017/Social-Media',
{ useNewUrlParser: true}).then(()=>{
    console.log("database connection established");
})

app.listen(4000,()=>{
    console.log("server started")
})