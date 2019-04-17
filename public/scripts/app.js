/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const charCount = '140';

/*************************************************************************************
 DOCUMENT READY
*************************************************************************************/
$(document).ready(() => {

/*------------------------------------------------------------------------------------
  FUNCTIONS
------------------------------------------------------------------------------------*/

  const createTweetElement = (data) => {
    let $article = $('<article></article>');
    $article.addClass("tweet-article");

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
    let $handleLabel = $(`<label></label>`);
    $handleLabel.addClass('tag');
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
    $label.text(moment(Date.now()).from(data.created_at).replace('in', '') + ' ago');
    $footer.append($label);
    let $div = $('<div></div>');
    $div.addClass("icons");
    let $heart = $('<i></i>');
    $heart.addClass("fas fa-heart");
    let $retweet = $('<i></i>');
    $retweet.addClass("fas fa-retweet");
    let $flag = $('<i></i>');
    $flag.addClass("fas fa-flag");
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
    $('#tweets-container').append(newTweets);
  }

  const loadTweets = () => {
    $.ajax('/tweets', { method: 'GET' })
      .then(function (tweets) {
        if(tweets){ renderTweets(tweets); }
      });
  }

  const clearMessage = (element) => {
    $(element).removeClass('error');
    $(element).removeClass('warning');
    $(element).removeClass('success');
    $(element).text('');
    $(element).addClass('message');
    $(element).slideToggle();
  }

  const setMessage = (element, message, type) => {
    // clearMessage(element);

    let messageClass = 'error';

    switch ( type ) {
      // case 'E':

      //   break;

      case 'S':
        messageClass = 'success';
        break;

      default:

    }

    $(element).addClass(messageClass);
    $(element).text(message);

    // if($(".container .new-tweet").hasClass('message')){
    //   $('.new-tweet div').removeClass('message');
    // }

    $(element).slideToggle();
    // $('.new-tweet p').toggleClass('message');
  }

/*------------------------------------------------------------------------------------

------------------------------------------------------------------------------------*/
  $('.new-tweet .counter').text(charCount);

  // renderTweets(data);
  loadTweets();

/*------------------------------------------------------------------------------------
    EVENTS
------------------------------------------------------------------------------------*/

  // compose
  $('#btn-compose').click( function(e){

    $( '.new-tweet' ).slideToggle();
    e.preventDefault();

    const $this = $(this);
    const clicked = 'btn-nav-cliked';
    const unclicked = 'btn-nav-uncliked';
    // const noDisplay = 'new-tweet-no-display';
    let remove = unclicked;
    let add = clicked;

    if($this.hasClass(clicked)){
      remove = clicked;
      add = unclicked;
    }

    $('.new-tweet textarea').focus();

    $(this).removeClass(remove);
    $(this).addClass(add);

    clearMessage('.new-tweet div');
  });

  // submit tweet
  $('.new-tweet form').submit(function(e){
    e.preventDefault();

    clearMessage('.new-tweet div');

    // usrInput = "text=blablablaba"
    const usrInput = $('textarea', $(this).parent()).serialize();
    let inputs = usrInput.split('=');
    let message = '';

    if( ( !inputs[1] ) || ( !inputs[1].replace(/\s/g, '') ) ){
      message = 'Invalid text';
    }

    // validade input
    const words = inputs[1].split(' ');
    for(let word of words){
      if(word.length > 49){
        message = 'You have a word that is too long';
        break;
      }
    }

    if( Number($('.counter', $(this).parent()).text()) < 0){
      message = 'Content is too long' ;
    }

    if(message){
      setMessage('.new-tweet div', message, 'E');
    }else{

      $.post('/tweets', usrInput)
      // $.post('/tweets',{text: usrInput})
      .done(function(newTweet){
        // console.log('done');

        if(newTweet){
          let $tweet = createTweetElement(newTweet);
          $('#tweets-container').prepend($tweet);
      // debugger;
          $('.new-tweet textarea').val('');
          $('.new-tweet .counter').text(charCount);
         }
      })
      .fail(function(err){
        console.log(err);
      });
    }
  });


});