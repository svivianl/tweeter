"use strict";

// checks if user is logged in
const isUserLoggedIn = (id) => (id === '' || id === undefined) ?  false : true;

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function middlewares(DataHelpers) {
  return {

    // checks if the user is logged in
    isLoggedIn: (req, res, next)=>{
        console.log('req.session.user_id ', req.session.user_id);
      if(!isUserLoggedIn(req.session.user_id)){
        return res.status(403).send(`Please login or register`);
        // return res.redirect('/login');
      }
      return next();
    }

    // // checks if the user that is calling the method is the same that created
    // // the URL
    // isUsersTweeter: (req, res, next)=>{
    //   if(!isUserLoggedIn(req.session.user_id)){
    //     return res.redirect('/login');
    //   }

    //   DataHelpers.getTweet({id: req.params.id}, (err, tweet) => {
    //     if (err) {
    //       res.status(500).json({ error: err.message });
    //     } else {
    //       // res.json(tweets);
    //       if(utweet.userId !== req.session.user_id){
    //         return res.status(403).send(`Unauthorized`);
    //       }
    //       return next();
    //     }
    //   });
    // }
  };
}
