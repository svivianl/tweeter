// $('#main').append(          )


// const charCount = '140';

$(document).ready(function() {
  const countValue = charCount;
  // const countValue = Number($('.new-tweet .counter').text());

  $('.new-tweet textarea').on('input', function(e){

    e.stopPropagation();

    const newValue = countValue - this.textLength;
    let colour = '#244751';

    $('.counter', $(this).parent()).text(newValue);

    if(newValue < 0){
      colour = 'red';
    }

    $('.counter', $(this).parent()).css('color', colour);
  });

});