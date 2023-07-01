var newcaptcha =(state='',action) =>{
    switch (action.type) {
      case 'SETCAPTCHA':
        return action.captcha;
      default:
        return state;
    }
  }
  module.exports = newcaptcha;
  