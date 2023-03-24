//jshint esversion:6

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
// const md5 = require('md5');
// const encrypt = require('mongoose-encryption');

const app = express();

console.log(process.env.API_KEY);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

const uri = 'mongodb+srv://tokedhar:xuU6rBCYY40CxpPR@tees.mtm195s.mongodb.net/userDB?retryWrites=true&w=majority';
mongoose.connect(uri);
const db = mongoose.connection;

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

// userSchema.plugin(encrypt, {
//     secret: process.env.SECRET,
//     encryptedFields: ['password']
// });
const User = new mongoose.model('User', userSchema);


/*** GETS ***/

app.get('/', (req, res) => res.render('home'));
app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));


/*** POSTS ***/

app.post ('/register', (req, res) => {
    bcrypt.hash (req.body.password, saltRounds)
    .then ((hash) => {
        return new User ({
            email: req.body.username,
            password: hash
            // password: md5(req.body.password)
        });
    })
    .then ((newUser) => {
        newUser.save()
            .then(() => res.render('secrets'))
            .catch((e) => console.log(e))             
    })
    .catch((e) => console.log(e))

});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // const password = md5(req.body.password);

    User.findOne({email: username})
    .then ((foundUser) => {
        // if (foundUser.password === password) {
        if (foundUser) {
            bcrypt.compare(password, foundUser.password)
            .then ((result) => {
                if (result === true) {
                    res.render('secrets');
                } else {
                    console.log('Wrong password!');
                }
            })
        }
    })
    .catch ((e) => console.log(e))
});






// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});