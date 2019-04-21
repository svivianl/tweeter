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
  const getResponseError = (XHR)=>{
    if(XHR.responseJSON){
      const { error, message } = XHR.responseJSON;
      return error;
    }
    return XHR.responseText;
  }

  // get user from cookie
  const getUserCookie = () => {
    $.ajax('/user', { method: 'GET' })
      .then(function (userFound) {
        navbarButtonToggle();
        setUserNavbar(userFound);
        setUserId(userFound);
      });
  }

  const createTweetElement = (data, user) => {
    const $article = $('<article></article>');
    $article.addClass("tweet-article");

    // build header
    const $header = $('<header></header>');
    const $avatar = $(`<img>`);
    $avatar.attr("src", user.avatar.small);
    $header.append($avatar);
    const $nameLabel = $('<label></label>');
    const $nameStrong = $(`<strong></strong>`);
    $nameStrong.text(`${user.firstName} ${user.lastName}`);
    $nameLabel.append($nameStrong);
    $header.append($nameLabel);
    const $handleLabel = $(`<label></label>`);
    $handleLabel.addClass('tag');
    $handleLabel.text(`@${user.handle}`);
    $header.append($handleLabel);

    // build main
    const $main = $('<main></main>');
    const $p = $('<p></p>');
    $p.text(data.content.text);
    $main.append($p);

    // build footer
    const $footer = $('<footer></footer>');
    const $label = $(`<label></label>`);
    $label.text(moment(Date.now()).from(data.created_at).replace('in', '') + ' ago');
    $footer.append($label);
    const $div = $('<div></div>');
    $div.addClass("icons");
    const $liked = $('<label>');
    if(data.hasOwnProperty('liked')){
      $liked.text(data.liked);
    }
    const $heart = $('<i></i>');
    $heart.addClass("fas fa-heart");
    $heart.data('tweeterId', data._id);
    $liked.append($heart);
    const $retweet = $('<i></i>');
    $retweet.addClass("fas fa-retweet");
    const $flag = $('<i></i>');
    $flag.addClass("fas fa-flag");
    $div.append($liked);
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
  const renderTweets = (tweets, users) => {
    const newTweets = [];
    tweets.forEach(function(tweetData) {
      let user = users.filter(user => user._id === tweetData.userId);
      if(user && user.length > 0){
        let $tweet = createTweetElement(tweetData, user[0]);
        $('#tweets-container').append($tweet);
      }
    });

    // to add it to the page so we can make sure it's got all the right elements, classes, etc.
    $('#tweets-container').append(newTweets);
  }

  const loadTweets = () => {
    $.ajax('/tweets', { method: 'GET' })
      .then(function (tweets) {
        if(tweets){
          $.ajax('/users', { method: 'GET' })
            .then(function (users) {
              if(users){ renderTweets(tweets, users); }
            });
        }
      });
  }

  const clearPopupInput = function(node){
    // finds the parent with the id of the popup to toggle
    let $parent = node.parent().parent().parent();
    if(node.prop("tagName") === 'P'){
      $parent = $parent.parent();
    }

    const parentId = $parent.attr('id');

    // clear all the input data
    $(`#${parentId} :input`).val('');

    $(`#${parentId}`).toggle('popup-display');

    if( $(`#${parentId} .message`).css('display', 'block')){
      messages.clearMessage(`#${parentId} .message`);
    }
  }

  const getPopupInput = function(node) {
    const user = {};
    const popupId = node.parent().parent().parent().attr('id');

    $(`#${popupId} :input`).each(function() {
      const inputName = $(this).attr('name');

      if( inputName && inputName.indexOf('user[') === 0){
        const newInputName = inputName.substr(5,inputName.length - 6);

        if(newInputName.indexOf('Avatar') !== -1){
          if(!user.hasOwnProperty('avatar')){ user['avatar'] = {}; }
          user.avatar[newInputName.substr(0, newInputName.indexOf('A'))] = $(this).val();
        }else{
          user[newInputName] = $(this).val();
        }
      }
    });

    return user;
  }

  const setUserNavbar = (user) => {
    $('#nav-bar .btn-loggedin img').attr('src', user.avatar.small);
    $('#nav-bar .handle').text(`@${user.handle}`);
    // $('.btn-loggedin.user img').src(user.avatar.small);
    // $('.btn-loggedin.user .habdle').text(`@${user.handle}`);
  }

  const navbarButtonToggle = () => {
    $('.btn-login-register').toggle('popup-display');
    $('.btn-loggedin').toggle('popup-display');
    // $('#loggedin-options').toggle('display');
    // $('.btn-loggedin #loggedin-options').toggle('display');

    //
    let addClass = 'loggedin-width';
    let removeClass = 'loggedout-width';

    if($('.btn-login-register').css('display', 'block')){
      removeClass = 'loggedin-width';
      addClass = 'loggedout-width';
    }
    $('#nav-bar .header').removeClass(removeClass);
    $('#nav-bar .header').addClass(addClass);
  }

  const setUserId = (user) => {
    $('#btn-compose').data('userID', user._id);
  }

  const clearUserId = () => {
    $('#btn-compose').data('userID','');
  }

  const getUserId = () => {
    return $('#btn-compose').data('userID');
  }

  const liked = function(id, $label){
    $.ajax(`/tweets/${id}/liked`, { method: 'PUT' })
    .done(function(tweet){

      if($label){
        $label.text(tweet.liked);
        const $heart = $('<i></i>');
        $heart.addClass("fas fa-heart");
        $heart.data('tweeterId', id);
        $label.append($heart);
      }
    })
    .fail((XHR) =>{
      messages.setMessage('#tweets-container .message', getResponseError(XHR), messages.error);
    });
  };
/*------------------------------------------------------------------------------------
  MAIN
------------------------------------------------------------------------------------*/
  $('.new-tweet .counter').text(charCount);
  $('#popup_login').toggle('popup-display');
  $('#popup_register').toggle('popup-display');
  getUserCookie();
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
    let remove = unclicked;
    let add = clicked;

    if($this.hasClass(clicked)){
      remove = clicked;
      add = unclicked;

    }else{
      messages.clearMessage('.new-tweet .message');
    }

    $('.new-tweet textarea').focus();

    $(this).removeClass(remove);
    $(this).addClass(add);
  });

  // submit tweet
  $('.new-tweet form').submit(function(e){
    e.preventDefault();


    // usrInput = "text=blablablaba"
    const usrInput = $('textarea', $(this).parent()).serialize();
    let inputs = usrInput.split('=');
    let message = '';

    if( ( !inputs[1] ) || ( !inputs[1].replace(/\s/g, '') ) ){
      message = 'Invalid text';
    }

    if( Number($('.counter', $(this).parent()).text()) < 0){
      message = 'Content is too long' ;
    }

    if(message){
      messages.setMessage('.new-tweet .message', message, messages.error);
    }else{
      const userId = getUserId();
      $.post(`/${userId}/tweet`, usrInput)
      .done(function(newTweet){
        if(newTweet){
          $.ajax(`/${userId}`, { method: 'GET' })
            .then(function (user) {
              let $tweet = createTweetElement(newTweet, user);
              $('#tweets-container').prepend($tweet);
              $('.new-tweet textarea').val('');
              $('.new-tweet .counter').text(charCount);
              messages.clearMessage('.new-tweet .message');
          });
         }
      })
      .fail((XHR) =>{
        messages.setMessage('.new-tweet .message', getResponseError(XHR), messages.error);
      });
    }
  });

  $('#btn-login').on('click', function(e){
    $('#popup_login').toggle('popup-display');
  });

  $('#btn-register').on('click', function(e){
    $('#popup_register').toggle('popup-display');
  });

  $('.btn-cancel').on('click', function(e) {
    clearPopupInput($(this));
  });

  // submit register
  $('#popup_register form').submit(function(e){
    e.preventDefault();

    const $this = $(this);
    const user = getPopupInput($this);

    $.post('/register', { user })
    .done(function(newUser){
      clearPopupInput($this);
      navbarButtonToggle();

      $.post('/login', { user })
      .done(function(userFound){
          setUserNavbar(userFound);
          setUserId(userFound);
        })
        .fail((XHR) =>{
          messages.setMessage('#popup_register .message', getResponseError(XHR), messages.error);
        });

    })
    .fail((XHR) =>{
      messages.setMessage('#popup_register .message', getResponseError(XHR), messages.error);
    });
  });

  // submit login
  $('#popup_login form').submit(function(e){
    e.preventDefault();

    const $this = $(this);
    const user = getPopupInput($this);

    $.post('/login', { user })
    .done(function(userFound){
      clearPopupInput($this);
      navbarButtonToggle();
      setUserNavbar(userFound);
      setUserId(userFound);
    })
    .fail((XHR) =>{
      messages.setMessage('#popup_login .message', getResponseError(XHR), messages.error);
    });
  });

  // submit logout
  $('#btn-logout').on('click', function(e){
    e.preventDefault();

    $.post('/logout')
    .done(function(){
      navbarButtonToggle();
      clearUserId();
    });
  });

  // avatar nav bar
  $('.btn-loggedin img').on('click', function(e){
    $('.btn-loggedin #loggedin-options').toggle('display');
  });

  // like
  $('#tweets-container').on('click','.fa-heart', function(e){
    e.preventDefault();

    const $this = $(this);
    const user = getPopupInput($this);
    liked($(this).data('tweeterId'), $this.parent());
  });

// $(`#${parentId} :input`)
  $('.global-message .message').on('click', function(e){
  // debugger;
    e.preventDefault();
    e.stopPropagation();
    messages.clearMessage(`.global-message .message`);
  });
});

