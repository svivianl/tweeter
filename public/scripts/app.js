/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

/*************************************************************************************
 DOCUMENT READY
*************************************************************************************/
$(document).ready(() => {

/*------------------------------------------------------------------------------------
  FUNCTIONS
------------------------------------------------------------------------------------*/
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

    return $article;
  }

  // loops through tweets
  // calls createTweetElement for each tweet
  // takes return value and appends it to the tweets container
  const renderTweets = (tweets) => {
    const newTweets = [];
    tweets.forEach(tweetData => {
      let $tweet = createTweetElement(tweetData);
      $('#tweets-container').append($tweet);
      // newTweets.push($tweet.serialize());
    });

    // to add it to the page so we can make sure it's got all the right elements, classes, etc.
    // $('#tweets-container').append(newTweets.join(''));
  }

  const loadTweets = () => {
    $.ajax('/tweets', { method: 'GET' })
      .then(function (tweets) {
        renderTweets(tweets);
      });
  }

/*------------------------------------------------------------------------------------

------------------------------------------------------------------------------------*/
  // renderTweets(data);
  loadTweets();

/*------------------------------------------------------------------------------------
    EVENTS
------------------------------------------------------------------------------------*/

  // submit tweet
  $('.new-tweet form').submit(function(e){
    e.preventDefault();

    const usrInput = $('textarea', $(this).parent()).serialize();
    // const usrInput = $('textarea', $(this).parent()).val();

    $.post('/tweets', usrInput)
    // $.post('/tweets',{text: usrInput})
    .done(function(newTweet){
    console.log('done');
      if(newTweet){
    debugger;
        // $('textarea', $(this).parent()).val('');
        // createTweetElement(newTweet);
       }
    })
    .fail(function(err){
      console.log(err);
    });
  });


});