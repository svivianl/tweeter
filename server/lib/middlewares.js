"use strict";

const ObjectId      = require('mongodb').ObjectID;

// checks if user is logged in
const isUserLoggedIn = (id) => (id === '' || id === undefined) ?  false : true;

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function middlewares(DataHelpers) {
  return {
    hasUserLoggedIn: isUserLoggedIn,

    // checks if the user is logged in
    isLoggedIn: (req, res, next)=>{
        console.log('isLoggedIn: .... req.session.user_id ', req.session.user_id);
      if(!isUserLoggedIn(req.session.user_id)){
        return res.status(403).send(`Please login or register`);
        // return res.redirect('/login');
      }
      return next();
    },

    // checks if the user that is calling the method is the same that created
    // the URL
    isUsersTweeter: (req, res, next)=>{
      if(!isUserLoggedIn(req.session.user_id)){
        return res.status(403).send(`Please login or register`);
      }

      DataHelpers.getTweet({'_id': ObjectId(`${req.params.id}`)}, (err, tweet) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {

          // it is returning false
          // if(ObjectId(`${tweet.userId}`) == ObjectId(`${req.session.user_id}`)){
          if(ObjectId(`${tweet.userId}`).toString() === ObjectId(`${req.session.user_id}`).toString()){
            return res.status(403).send(`Unauthorized`);
          }
          return next();
        }
      });
    }
  };
}
