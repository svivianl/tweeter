/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

/*************************************************************************************
 FUNCTIONS
*************************************************************************************/
const timeSince = (date) => {

  let seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

const createTweetElement = (data) => {
  let $article = $('<article class="tweet-article"></article>');

  // build header
  let $header = $('<header></header>');
  let $avatar = $(`<img>`);
  $avatar.attr("src",data.user.avatars.small);
  $header.append($avatar);
  let $nameLabel = $('<label></label>');
  let $nameStrong = $(`<strong></strong>`);
  $nameStrong.text(data.user.name);
  $nameLabel.append($nameStrong);
  $header.append($nameLabel);
  let $handleLabel = $(`<label class="tag"></label>`);
  $handleLabel.text(data.user.handle);
  $header.append($handleLabel);

  // build main
  let $main = $('<main></main>');
  let $p = $('<p></p>');
  $p.text(data.content.text);
  $main.append($p);

  // build footer
  let $footer = $('<footer></footer>');
  let $label = $(`<label></label>`);
  $label.text(timeSince(new Date(Date.now() - data.created_at)));
  $footer.append($label);
  let $div = $('<div class="icons"></div>');
  const $heart = $('<i class="fas fa-heart"></i>');
  const $retweet = $('<i class="fas fa-retweet"></i>');
  const $flag = $('<i class="fas fa-flag"></i>');
  $div.append($heart);
  $div.append($retweet);
  $div.append($flag);
  $footer.append($div);

  // append
  $article.append($header);
  $article.append($main);
  $article.append($footer);

  // return $(`
  //     <header>
  //       <img src='${data.user.avatars.small}'>
  //       <label><strong>${data.user.name}</strong></label>
  //       <label class="tag">${data.user.handle}</label>
  //     </header>
  //     <main>
  //       <p>${data.content.text}</p>
  //     </main>
  //     <footer>
  //       <label>${timeSince(new Date(Date.now() - data.created_at))}</label>
  //       <div class="icons">
  //         <i class="fas fa-heart"></i>
  //         <i class="fas fa-flag"></i>
  //         <i class="fas fa-retweet"></i>
  //       </div>
  //     </footer>
  // `);

  return $article;
}

// loops through tweets
// calls createTweetElement for each tweet
// takes return value and appends it to the tweets container
const renderTweets = (tweets) => {
  tweets.forEach(tweetData => {

    let $tweet = createTweetElement(tweetData);
    $('#tweets-container').append($tweet); // to add it to the page so we can make sure it's got all the right elements, classes, etc.
  });
}

/*************************************************************************************
 DOCUMENT READY
*************************************************************************************/
$(document).ready(() => {
  // Test / driver code (temporary). Eventually will get this from the server.
  const data = [
    {
      "user": {
        "name": "Newton",
        "avatars": {
          "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
          "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
          "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
        },
        "handle": "@SirIsaac"
      },
      "content": {
        "text": "If I have seen further it is by standing on the shoulders of giants"
      },
      "created_at": 1461116232227
    },
    {
      "user": {
        "name": "Descartes",
        "avatars": {
          "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
          "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
          "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
        },
        "handle": "@rd" },
      "content": {
        "text": "Je pense , donc je suis"
      },
      "created_at": 1461113959088
    },
    {
      "user": {
        "name": "Johann von Goethe",
        "avatars": {
          "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
          "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
          "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
        },
        "handle": "@johann49"
      },
      "content": {
        "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
      },
      "created_at": 1461113796368
    }
  ];

  renderTweets(data);

});