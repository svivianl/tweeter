/*------------------------------------------------------------------------------------
  VARIABLES
------------------------------------------------------------------------------------*/
const charCount = '140';

/*------------------------------------------------------------------------------------
  FUNCTIONS
------------------------------------------------------------------------------------*/
const clearMessage = (element) => {
  $(element).removeClass('error');
  $(element).removeClass('warning');
  $(element).removeClass('success');
  $(element).text('');
  $(element).addClass('message');

  if($(element).css('Display') === 'block'){
    $(element).slideToggle();
  }

}

const setMessage = (element, message, type) => {
  // clearMessage(element);

  let messageClass = 'error';

  switch ( type ) {
    case 'W':
      messageClass = 'warning';
      break;

    case 'S':
      messageClass = 'success';
      break;

    default:

  }

  $(element).addClass(messageClass);
  $(element).text(message);

  if($(element).css('Display') === 'none'){
    $(element).slideToggle();
  }

}
