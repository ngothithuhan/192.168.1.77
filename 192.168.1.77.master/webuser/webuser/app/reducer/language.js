// import { SET_CURRENT_USER } from '../actions/types';

var data ={language:"vie"};

 var language = (state = data, action) => {

  switch(action.type) {
   
    case "CHANGE_LANGUAGE":
      return {language:action.language};
      
    default:
       return state;
  }
}
module.exports = language;