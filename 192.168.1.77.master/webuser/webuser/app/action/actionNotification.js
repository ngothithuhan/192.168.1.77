function showNotifi(data){
  return{type:'SHOW_NOTIFICATION',data};
}
 function hideNotifi(){
   return{type:'HIDE_NOTIFICATION'};
}
module.exports = {showNotifi,hideNotifi};
