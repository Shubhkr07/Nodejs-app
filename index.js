import { render } from 'ejs';
import express from 'express';
import fs from 'fs'
import path  from 'path';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import e from 'express';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; 

mongoose.connect("mongodb://localhost:27017",{
    dbName: "Backend",
}).then(()=> console.log("Database Connected"))
  .catch((e) => console.log(e));
 
  const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
  });
  const User = mongoose.model("User",userSchema);
const app = express();
// Setting up View Engine
// 


const users = [];
app.use(express.static(path.join(path.resolve(),"public")));
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.set("view engine", "ejs");
// console.log(path.join(path.resolve(),"public"));


const isAuthenticated = async (req,res,next)=>{
    const {token} = req.cookies;
    if (token) {
        // console.log(req.user);  
        const decoded = jwt. verify(token,"abcdef");
        //  res.render("logout");
        // console.log(decoded);
        req.user = await User.findById(decoded._id);
        next();
    }
    else{
        res.redirect("/login");
    }
}



app.get("/" , isAuthenticated,(req,res)=> {
    // console.log(req.user);
    res.render("logout",{name: req.user.name });
    // console.log(req.cookies);
    // res.status(400).send("Nikal");
    // const file = fs.readFileSync("./index.html");
    // res.sendFile(file);
    // console.log(path.resolve());
    // const pathlocation = path.resolve();
    // res.sendFile(path.join(pathlocation,"./index.html" ));
    // res.render("login.ejs");
    // res.sendFile
})

app.post("/login", async (req,res)=>{
    const {email,password} = req.body;
    let user = await User.findOne({email});
    if (!user) {
    return res.redirect("/register");
    }
const ismatch = await bcrypt.compare(password, user.password);
if(!ismatch)  return res.render("login",{email, message: "Incorrect Password"});
const token = jwt.sign({_id: user._id},"abcdef");
// console.log(token); 
res.cookie("token",token, {
    httpOnly:true,
    expires: new Date(Date.now() + 60*1000),
});
res.redirect("/");
})


app.post("/register", async  (req,res)=>{
    const {name,email,password} = req.body;
    let user  = await User.findOne({email});
    if (user) {
        return res.redirect("/login"); 
    }
    // console.log(req.bo dy);
    const hashpassword = await bcrypt.hash(password,10 );
     user = await User.create({
         name,
         email,
         password: hashpassword,
        });
        const token = jwt.sign({_id: user._id},"abcdef");
        // console.log(token); 
        res.cookie("token",token, {
            httpOnly:true,
            expires: new Date(Date.now() + 60*1000),
        });
     res.redirect("/");
});
app.get("/logout",(req,res)=>{
    res.cookie("token","null",{
        // httpOnly:true,
        expires: new Date(Date.now()),
    });
    res.redirect("/");
});
app.get("/register",(req,res)=>{
    
    res.render("register");
});
app.get("/login",(req,res)=>{
    
    res.render("login");
});
app.listen(5000,() => {
    console.log("Server is Working");
})


// app.get("/add", async (req,res)=>{
    //     await Messge.create({name: "Abhi2", email: "wd2@gmail.com"})
    //     res.send("Nice");
    
    // })
    
    // app.post("/login", async  (req,res)=>{
    //     const {name,email} = req.body;
    //     let user  = await User.findOne({email});
    //     if (!user) {
    //         return res.redirect("/register"); 
    //     }
    //     // console.log(req.bo dy);
    //      user = await User.create({
    //         name,
    //         email,
    //     });
    //     const token = jwt.sign({_id: user._id},"abcdef");
    //     // console.log(token); 
    //     res.cookie("token",token, {
    //         httpOnly:true,
    //         expires: new Date(Date.now() + 60*1000),
    //     });
    //      res.redirect("/");
    // });






// app.get("/users",(req,res)=>{
//     res.json({
//         users,
//     });
// })








// app.post("/contact", (req,res)=>{
//     // console.log(req.body);
//     users.push({username: req.body.name,email:req.body.email});
//     res.render("success");
//     // res.redirect("/success");
// });




// Without Express
// // const http = require("http");
// import http from "http";
// // import name, {name3} from "./features.js";
// // import * as myObj from "./features.js";
// import fs from "fs";
// import { lpg } from "./features.js";
// // import {name3} from "./features.js";
// // const name = require("./features");
// console.log(lpg());
// const Server = http.createServer((req,res)=>{
//     // console.log(req.url);
//     if (req.url === "/about") {
//         res.end(`<h1>number is ${lpg()} </hi>`);
//     }
//     else if (req.url === "/") {
//         res.end("<h1>Home Page </hi> ");
//     }
//     else{
//         res.end("<h1>Page Not Found </hi> ");
//     }
    
// });

// Server.listen(5000,() => {
//     console.log("Server is Working");
// });
