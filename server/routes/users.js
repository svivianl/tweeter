"use strict";

const userHelper    = require("../lib/util/user-helper")
const express       = require('express');
const bcrypt        = require('bcrypt');
const usersRoutes   = express.Router();

const attributes    = {
  login: {
    emailUsername: 'E-mail / username',
    password: 'Password',
  },

  register: {
    firstName: 'First name',
    lastName: 'Last name',
    email: 'E-mail',
    handle: 'Handle',
    password: 'Password',
    passwordConfirm: 'Confirm Password',
    smallAvatar: 'Small avatar',
    Regularavatar: 'Regular avatar',
    largeAavatar: 'Large avatar'
  }
}

// check if the inputs are empty
const checkMandatoryInputs = (attributes, input) => {
  for(let key in attributes){
    if( (!input.hasOwnProperty(key)) || (!input[key]) || input[key].replace(/\s/g, '') === ''){
      return `"${attributes[key]}" is empty`;
    }
  }
}

const createUser = (err, users) => {
  if (err) {

    const {
      firstName,
      lastName,
      password,
      handle,
      smallAvatar,
      regularAvatar,
      largeAavatar
    } = req.body.user;

    const user = {
      firstName,
      lastName,
      password: bcrypt.hashSync(password, 10),
      handle,
      smallAvatar,
      regularAvatar,
      largeAavatar
    };

    DataHelpers.saveUser(user, (err, newUser) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send(newUser);
        // res.status(201).send();
      }
    });

  } else {
    res.status(400).json({ error: 'user/e-mail already exists' });
  }
}

module.exports = function(DataHelpers) {

  usersRoutes.get("/login", function(req, res) {
    if (!req.body.user) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    // check if the inputs are empty
    const error = checkMandatoryInputs(attributes.login, req.body.user);
    if(error){
      return res.status(400).json({ error });
    }

    DataHelpers.getUser({email, handle}, {password: 1}, (err, user) => {
      if (err) {
        res.status(403).send(`User not found`);

      } else {
        if(bcrypt.compareSync( password, user.password)){
          res.json(user);
        }else{
          res.status(403).send(`Password doesn't match`);
        }
      }
    });
  });

  usersRoutes.post("/register", function(req, res) {
    if (!req.body.user) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    // check if the inputs are empty
    const error = checkMandatoryInputs(attributes.register, req.body.user);
    if(error){
      return res.status(400).json({ error });
    }

    if(req.body.user.password === req.body.user.confirmPassword){
      return res.status(400).json({ error: `passwords don't match` });
    }

    DataHelpers.getuser({email, handle}, {password: 1}, createUser);

  });

  // clear session cookie
  usersRoutes.post("/logout", function(req, res) {
    req.session.user_id = null;
    res.status(200).send();
  });

  return usersRoutes;

}

