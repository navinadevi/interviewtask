require("./db/mongoose.js")
const express = require('express')
const app = express()
var bodyParser = require('body-parser');
var auth = require('./middleware/auth');

var User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//api to create user
app.post('/api/user', auth, async (req, res)=> {
    try {
        var user = new User(req.body);
        await user.save();
        res.status(201).send("User created successfully");
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal server error");
    }
})

//api to get all users
app.get('/api/user', auth, async (req, res)=> {
    try {
        var users = await User.find(req.query);
        res.status(201).send(users);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal server error");
    }
})

//api to edit user
app.put('/api/user/:id', auth, async (req, res)=> {
    try {
        await User.findByIdAndUpdate(req.params.id, req.body);
        res.status(201).send("Updated Successfully");
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal server error");
    }
})

//api to delete user
app.delete('/api/user/:id', auth, async (req, res)=> {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).send("Deleted Successfully");
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal server error");
    }
})

//api to login user
app.post('/api/login', async (req, res)=> {
    try {
        var user = await User.findByCredential(req.body.name, req.body.password);
        var token = await user.generateAuthToken();
        res.status(200).send({
            user,
            token
        })
    } catch (e) {
        res.status(500).send("Unable To Login");
    }
})

app.listen(3500, function () {
    console.log("The server runs at port : 3500");
})