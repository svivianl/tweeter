$(document).ready(function() {

  const countValue = Number($('.counter').text());

  $('.new-tweet textarea').on('input', function(e){
    const newValue = countValue - this.textLength
    $('.counter').text(newValue);
    if(newValue < 0){
      $('.counter').css('color', 'red');
    }
  });


});