"use strict";

const userHelper    = require("../lib/util/user-helper")
const express       = require('express');
const bcrypt        = require('bcrypt');
const usersRoutes   = express.Router();

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
    smallAvatar: 'Small avatar',
    regularAvatar: 'Regular avatar',
    largeAvatar: 'Large avatar'
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

const createUser = (err, userFound) => {
  console.log('in data helpers... after calling db.... callback');
  console.log('error ', err);
  console.log('user found ', userFound);
  console.log('body ', req.body);
  try{
  if (err) {
    console.log('before saving.......');
    const {
      firstName,
      lastName,
      password,
      handle,
      smallAvatar,
      regularAvatar,
      largeAvatar
    } = req.body.user;

    const user = {
      firstName,
      lastName,
      password: bcrypt.hashSync(password, 10),
      handle,
      smallAvatar,
      regularAvatar,
      largeAvatar
    };

    DataHelpers.saveUser(user, (err, newUser) => {
      console.log('saved.......');
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        console.log('created user ', newUser);
        req.session.user_id = newUser.id;
        res.status(201).send(newUser);
        res.redirect('/login');
        // res.status(201).send();
      }
    });

  } else {
    res.status(400).json({ error: 'user/e-mail already exists' });
  }
}
catch(e){
  console.log('e ', e);
  console.log('error ', err);
  console.log('user found ', userFound);
  console.log('body ', req.body);
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

    const {handle} = req.body.user;

    // DataHelpers.getUser({handle}, {password: 1, handle: 1}, (err, user) => {
    DataHelpers.getUser({handle}, {password: 1, handle: 1, 'avatar.small': 1}, (err, user) => {
      if (err) {
        res.status(403).send(`User not found`);

      } else {
        if(bcrypt.compareSync( password, user.password)){
          res.json(user);
          req.session.user_id = user.id;
          res.redirect('/');
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
    console.log('before saving 1.......');
    // DataHelpers.getUser({{email, handle}, {password: 1}}, createUser);
    DataHelpers.getUser({email, handle}, (err, userFound) => {
      console.log('in data helpers... after calling db.... callback');
      console.log('error ', err);
      console.log('user found ', userFound);
      console.log('body ', req.body);
      if (err || (!userFound)) {
        console.log('before saving.......');
        const {
          firstName,
          lastName,
          password,
          handle,
          smallAvatar,
          regularAvatar,
          largeAvatar
        } = req.body.user;

        const user = {
          firstName,
          lastName,
          password: bcrypt.hashSync(password, 10),
          handle,
          smallAvatar,
          regularAvatar,
          largeAvatar
        };

        DataHelpers.saveUser(user, (err, newUser) => {
          console.log('saved.......');
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            console.log('created user ', newUser);
            req.session.user_id = newUser.id;
            res.status(201).send(newUser);
            res.redirect('/login');
            // res.status(201).send();
          }
        });

      } else {
        res.status(400).json({ error: 'user/e-mail already exists' });
      }
    });
  });
  // clear session cookie
  usersRoutes.post("/logout", function(req, res) {
    req.session.user_id = null;
    res.status(200).send();
  });

  return usersRoutes;

}

