"use strict";

const ObjectId      = require('mongodb').ObjectID;

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet, (err, res) => {
        if (err) {
          return callback(err);
        }
        callback(null, res.ops[0]);
      });
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      db.collection("tweets").find().toArray((err, tweets) => {
        if (err) {
          return callback(err);
        }
        const sortNewestFirst = (a, b) => b.created_at - a.created_at;
        callback(null, tweets.sort(sortNewestFirst));
      });
    },

    // Get the tweet in `db`
    getTweet: function(query, callback) {
      db.collection("tweets").findOne(query, (err, tweet) => {
        if (err) {
          return callback(err);
        }

        callback(null, tweet);
      });
    },

    // update
    updateTweet: function(updateTweet, callback) {
      db.collection("tweets")
        .updateOne(
            {'_id': ObjectId(`${updateTweet._id}`)}, // Filter
            {$set: {"liked": updateTweet.liked}} // Update
        )
        .then((updatedTweet) => {
          callback(null, updateTweet);
        })
        .catch((err) => {
          return callback(err);
        });
    },

    // Save user
    saveUser: function(newUser, callback)  {
      db.collection("users").insertOne(newUser, (err, res) => {
        if (err) {
          return callback(err);
        }
        callback(null, res.ops[0]);
      });
    },

    // Get user
    getUser: function(query, callback){
      db.collection("users").find(query).toArray( (err, user) => {
        if (err) {
          return callback(err);
        }

        user[0] ? callback(null, user[0]) : callback('User not found');
      });
    },

    // Get users
    getUsers: function(callback){
      db.collection("users").find().toArray((err, users) => {
        if (err) {
          return callback(err);
        }
        callback(null, users);
      });
    }
  };
}
