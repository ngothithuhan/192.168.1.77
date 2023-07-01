module.exports ={
     convertDate :function (date){
        if(!date )
           return null
        var res = date.split("/");
        var rs = res[1]+"/"+res[0] + "/"+res[2]
        return rs
    }
}