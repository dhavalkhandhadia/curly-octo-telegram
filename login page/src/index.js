const express = require('express');
const path = require ("path");
const bcryptjs = require('bcryptjs');
const collections = require('./config');


const app = express();
app.use(express.json());

app.use(express.urlencoded({extended: false}));



app.set('view engine', 'ejs');
app.use(express.static("public"));
app.get('/', (req,res)=>{
    res.render('login');
});
app.get('/signup',(req,res)=>{
    res.render('signup');
});

app.post ("/signup", async(req, res)=>{
    const data = {
        username: req.body.username,
        password: req.body.password,
    }
    const existingUser = await collections.findOne({username: data.username});
    if (existingUser){
        res.send("User already exists. Please choose a different username.")
    }else{
    const userdata = await collections.insertMany(data);
    console.log(userdata); 
    };
})

app.post("/login", async(req,res)=>{
    try{
        const check = await collections.findOne({username: req.body.username},{password: req.body.password})
        if(!check){
            res.send("username cannot be found");
        }
        const isPasswordMatch = await bcryptjs.compare(req.body.password, check.password);
        if(isPasswordMatch){
            res.render("home.ejs");
        }else{
            req.send("wrong password");
        }
    }
    catch{
         res.send("wrong Details");

    }
});

const port = 5000;
app.listen(port, ()=>{
    console.log(`Server running on port: ${port}`);
})
