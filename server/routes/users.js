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

module.exports = function(DataHelpers) {

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
          res.json(user);
          req.session.user_id = user.id;
          // res.redirect('/');
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
          password: bcrypt.hashSync(password, 20),
          handle,
          avatar
        };

        DataHelpers.saveUser(user, (err, newUser) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            console.log('created user ', newUser);
            req.session.user_id = newUser.id;
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
  // clear session cookie
  usersRoutes.post("/logout", function(req, res) {
    req.session.user_id = null;
    res.status(200).send();
  });

  return usersRoutes;

}

