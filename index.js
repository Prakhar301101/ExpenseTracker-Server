require("dotenv").config();
const express = require("express");
const mongoose=require('mongoose')
const cors=require('cors');
const cookieParser = require('cookie-parser')
const Routes=require('../Server/routes/Routes')
const app = express();


app.use(cors({
   credentials: true, 
   origin:"http://127.0.0.1:5173"
  }));
app.use(express.json());
app.use(cookieParser());



mongoose.connect(process.env.MONGO_URL)


app.use(Routes);

let port = process.env.PORT;
  app.listen(port, function () {
    console.log(`Server started on ${port}`);
  });