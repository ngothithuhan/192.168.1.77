

var data ={tradingdate:''};

 var systemdate = (state = data, action) => {

  switch(action.type) {
   
    case "SET_TRADINGDATE":
        
      return {...state,tradingdate:action.tradingdate};
      
    default:
       return state;
  }
}
module.exports = systemdate;