var LOAD_MENU ="LOAD_MENU";
var RESET_MENU ="RESET_MENU";
var SHOW_MENU ="SHOW_MENU";
var HIDE_MENU ="HIDE_MENU";
function loadMenu(data){
  return{type:LOAD_MENU,data};
}
function resetMenu(){
   return{type:RESET_MENU};
}
function showMenu(){
  return {type:SHOW_MENU}
}
function hideMenu(){
  return {type:HIDE_MENU}
}
module.exports = {loadMenu,resetMenu,showMenu,hideMenu};
