var data = {
   type:"info",
   title:"Đặt lệnh",
   content:"có 1 bản ghi mới"
}
var notification = (state = data, action) => {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return action.data;
   
    default:
      return state;
  }
}
module.exports = notification;
