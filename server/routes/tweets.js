"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const tweetsRoutes  = express.Router();
const ObjectId      = require('mongodb').ObjectID;

module.exports = function(DataHelpers, middlewares) {

  tweetsRoutes.get("/:id", function(req, res) {
    DataHelpers.getTweet({'_id': req.params.id}, (err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.post("/", middlewares.isLoggedIn, function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
    const tweet = {
      user: user,
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
  });

  tweetsRoutes.put("/:id/liked", middlewares.isLoggedIn, function(req, res) {

    DataHelpers.getTweet({'_id': ObjectId(`${req.params.id}`)}, (err, tweet) => {
      if (err) {
        res.status(403).send(`Tweet not found`);

      } else {

        if(tweet.userId === req.session.user_id){
          res.status(400).send('Unauthorized');

        }else{
          (! tweet.hasOwnProperty('liked')) ? tweet['liked'] = 1 : tweet.liked ++;

          DataHelpers.updateTweet(tweet, (err, updatedTweet) => {
            if (err) {
              res.status(500).json({ error: err.message });
            } else {
              res.status(201).send(updatedTweet);
              // res.status(201).send();
            }
          });

        }
      }
    });
  });

  return tweetsRoutes;

}
