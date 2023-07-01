module.exports = {
    removeException:function(err){
        return err?"Null":("Err: "+err.message);
    }
}