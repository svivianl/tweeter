"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const usersRoutes   = express.Router();

module.exports = function(DataHelpers) {

  usersRoutes.get("/login", function(req, res) {
    if (!req.body.user) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    DataHelpers.getuser({{email, handle}, {password: 1}, (err, user) => {
      if (err) {

        bcrypt.hashSync(password, 10)

      } else {
        res.status(400).json({ error: 'user already exists' });
      }
    });
  });

  usersRoutes.post("/register", function(req, res) {
    if (!req.body.user) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    DataHelpers.getuser({{email, handle}, {password: 1}, (err, users) => {
      if (err) {
        res.status(500).json({ error: err.message });

      } else {

        if(bcrypt.compareSync( password, user.password)){
          DataHelpers.saveTweet(user, (err, newUser) => {
            if (err) {
              res.status(500).json({ error: err.message });
            } else {
              res.status(201).send(newUser);
              // res.status(201).send();
            }
          });
        }else{
          res.status(403).send(`Password doesn't match`);
        }
      }
    });

  });

  return usersRoutes;

}
