/*------------------------------------------------------------------------------------
  VARIABLES
------------------------------------------------------------------------------------*/
const charCount = '140';

/*------------------------------------------------------------------------------------
  FUNCTIONS
------------------------------------------------------------------------------------*/
const messages = {
  error: 'error',
  warning: 'warining',
  success: 'success',
  class: 'message',
  types: [this.error,this.warining,this.success],

  clearMessage: function(element) {
    this.types.forEach( type => $(element).removeClass( type ));
    $(element).text('');
    $(element).addClass(this.class);

    if($(element).css('Display') === 'block'){
      $(element).slideToggle();
    }
  },

  setMessage: function(element, message, type) {

    let messageClass = this.types[type];

    if( !messageClass ){ messageClass = 'error'; }

    $(element).addClass(messageClass);
    $(element).text(message);

    if($(element).css('Display') === 'none'){
      $(element).slideToggle();
    }
  }
}