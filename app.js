const express = require("express");
const cors = require("cors");//Cross-Origin Resource Sharing.
const nftRouter = require("./Api/Router/nftRouter");
const userRouter = require("./Api/Router/userRouter");

//Middle ware-
const app = express();
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing form data
// app.use(express.json({limit:"100kb"}));//i want to allow the data of 100kb

app.use(cors());
app.options("*",cors());

//3) Routes
app.use("/api/v1/NFTs",nftRouter);
app.use("/api/v1/user",userRouter);

module.exports = app;