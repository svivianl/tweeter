/*************************************************************************************
 DOCUMENT READY
*************************************************************************************/
$(document).ready(function() {

  const countValue = charCount;

  $('.new-tweet textarea').on('input', function(e){

    e.stopPropagation();

    const newValue = countValue - this.textLength;
    const counterClass = {
      default: 'counter-default',
      error: 'counter-error'
    };
    let removeClass = counterClass.default;
    let addClass = counterClass.error;

    $('.counter', $(this).parent()).text(newValue);

    if(newValue > 0){
      removeClass = counterClass.error;
      addClass = counterClass.default;
    }

    $('.counter', $(this).parent()).removeClass(removeClass);
    $('.counter', $(this).parent()).addClass(addClass);
  });

});