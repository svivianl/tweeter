"use strict";

const userHelper    = require("../lib/util/user-helper")
const express       = require('express');
const bcrypt        = require('bcrypt');
const usersRoutes   = express.Router();
const ObjectId      = require('mongodb').ObjectID;

const attributes    = {
  login: {
    handle: 'Username',
    password: 'Password',
  },

  register: {
    firstName: 'First name',
    lastName: 'Last name',
    email: 'E-mail',
    // handle: 'Username',
    // password: 'Password',
    passwordConfirm: 'Confirm Password',
    avatar: {
      small: 'Small avatar',
      regular: 'Regular avatar',
      large: 'Large avatar'
    }
  }
}

const isEmpty = (obj, key, attributes) => {
  if( (!obj.hasOwnProperty(key)) || (!obj[key]) || obj[key].replace(/\s/g, '') === ''){
    return `"${attributes[key]}" is empty`;
  }
}

// check if the inputs are empty
const checkMandatoryInputs = (attributes, input) => {

  for(let key in attributes){
    let message;

    if(typeof input  === 'object'){
      for(let innerKey in input[key]){
        message = isEmpty(input[key], innerKey, attributes[key]);
        if( message ){
          return message;
        }
      }
    }else{
      message = isEmpty(input, key, attributes);
      if( message ){
        return message;
      }
    }
  }
}

// checks if user is logged in
const isUserLoggedIn = (id) => (id === '' || id === undefined) ?  false : true;

module.exports = function(DataHelpers, middlewares) {
  // get users
  usersRoutes.get("/users", function(req, res) {
    // console.log('get...........');
    // req.session.user_id = '';

    DataHelpers.getUsers((err, users) => {
      if (err) {
        res.status(403).send(`Users not found`);

      } else {
        res.status(201).send(users);
      }
    });
  });

  // get loggedin user
  usersRoutes.get("/user", function(req, res) {

    if(middlewares.hasUserLoggedIn(req.session.user_id)){

      DataHelpers.getUser({'_id': ObjectId(`${req.session.user_id}`)}, (err, user) => {
        if (err) {
          res.status(403).send(`User not found`);

        } else {
          res.status(201).send(user);
        }
      });
    }
  });

  // get user
  usersRoutes.get("/:id", middlewares.isLoggedIn, function(req, res) {

    try{
      if(req.params.id){
        DataHelpers.getUser({'_id': ObjectId(`${req.params.id}`)}, (err, user) => {
          if (err) {
            res.status(403).send(`User not found`);

          } else {
            res.status(201).send(user);
          }
        });
      }
    }catch(e){

    }
  });

  // create user's Tweet
  usersRoutes.post("/:id/tweet", middlewares.isLoggedIn, function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    DataHelpers.getUser({'_id': ObjectId(`${req.params.id}`)}, (err, user) => {
      if (err) {
        res.status(403).send(`User not found`);

      } else {
        const tweet = {
          userId: user._id,
          content: {
            text: req.body.text
          },
          created_at: Date.now()
        };

        DataHelpers.saveTweet(tweet, (err, newTweet) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            res.status(201).send(newTweet);
            // res.status(201).send();
          }
        });
      }
    });
  });

  // login
  usersRoutes.post("/login", function(req, res) {
    if (!req.body.user) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    // check if the inputs are empty
    const error = checkMandatoryInputs(attributes.login, req.body.user);
    if(error){
      return res.status(400).json({ error });
    }

    const {handle, password} = req.body.user;
    DataHelpers.getUser({handle}, (err, user) => {
    // DataHelpers.getUser({handle}, {password: 1, handle: 1}, (err, user) => {
    // DataHelpers.getUser({handle}, {password: 1, handle: 1, 'avatar.small': 1}, (err, user) => {
      if (err) {
        res.status(403).send(`User not found`);

      } else {
        if(bcrypt.compareSync( password, user.password)){
          req.session.user_id = user._id;
          res.json(user);
      console.log('login: ... req.session.user_id ', req.session.user_id);
          // res.session.user_id = user._id;
          // res.redirect('/');
        }else{
          res.status(403).send(`Password doesn't match`);
        }
      }
    });
  });

  // register
  usersRoutes.post("/register", function(req, res) {
    if (!req.body.user) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    // check if the inputs are empty
    let error = checkMandatoryInputs(attributes.register, req.body.user);
    if(error){
      return res.status(400).json({ error });
    }
    error = checkMandatoryInputs(attributes.login, req.body.user);
    if(error){
      return res.status(400).json({ error });
    }

    if(req.body.user.password === req.body.user.confirmPassword){
      return res.status(400).json({ error: `passwords don't match` });
    }

    const {email, handle} = req.body.user;
    // DataHelpers.getUser({{email, handle}, {password: 1}}, createUser);
    DataHelpers.getUser({email, handle}, (err, userFound) => {
      if (err || (!userFound)) {
        const {
          firstName,
          lastName,
          password,
          handle,
          avatar
        } = req.body.user;

        const user = {
          firstName,
          lastName,
          password: bcrypt.hashSync(password, 10),
          handle,
          avatar
        };

        DataHelpers.saveUser(user, (err, newUser) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            req.session.user_id = newUser._id;
            res.status(201).send(newUser);
            // res.redirect('/login');
            // res.status(201).send();
          }
        });

      } else {
        res.status(400).json({ error: 'user/e-mail already exists' });
      }
    });
  });

  // logout
  usersRoutes.post("/logout", function(req, res) {
    req.session.user_id = null;
    res.status(200).send();
  });

  return usersRoutes;
}

