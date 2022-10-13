
import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
// const express = require("express");
import account from "./route/account.js"
import mongoose from "mongoose";
import walk from "./route/walk.js";
import memories from "./route/memories.js";
import consume from "./route/consume.js";
import dog from "./route/dog.js";
import place from "./route/place.js";
import comment from "./route/comment.js";
 

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGODB_URI, { dbName: "dogCare" });
 
app.use(cors());  
app.use(morgan("[Server] :method :url :status (:response-time ms | :date[iso]) "));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use("/storage", express.static("storage"));

app.use("/util/account", account);
app.use("/util/walk", walk); 
app.use("/util/memories", memories);
app.use("/util/consume", consume);
app.use("/util/dog", dog);  
app.use("/util/place", place);  
app.use("/util/comment", comment);  
 
app.listen(8080, ()=>{
    console.log("[Server] start."); 
});


