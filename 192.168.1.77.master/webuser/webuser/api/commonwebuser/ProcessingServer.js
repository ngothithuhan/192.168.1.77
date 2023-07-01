/**
 *  @author LinhTD
 *  @description Nhận xử lý ở Processing Server 
 */
module.exports={
    /**
     * @argument model 
     * @description API thêm model
     */
    createmodel:function (model,done){
        serviceTest.requsetPost(model,'front/create',function(err,rs){

            if(err){
                done(err,null)
            }
            try {
                 done(null,rs)

            } catch (error) {
               done(error,null)
            }
           
           
        })
    },
    /**
     * @argument model 
     * @description API lấy model
     */
    getmodel:function(model,done){
        serviceTest.requsetPost(model,'front/execProd',function(err,rs){
            if(err){
               done(err,null)
            }
            console.log(rs)
            if(rs.EC==0){
                   let result ;

                   result =   ConvertData.convert_to_Object(rs.DT.ret)
                   console.log('result',result)
                   rs.DT = result ; 
                   done(null,rs)
            }
            else{
               done('err',null)
            }
           
        })
    },
    /**
     * @argument model 
     * @description API sửa model
     */
    updatemodel:function(model,done){
        serviceTest.requsetPost(model,'front/update',function(err,rs){
            
                        if(err){
                            done(err,null)
                        }
                        try {
                             done(null,rs)
            
                        } catch (error) {
                           done(error,null)
                        }
                       
                       
                    })
    },
    /**
     * @argument model 
     * @description API duyệt model
     */
    approvemodel:function(model,done){
        serviceTest.requsetPost(model,'front/approve',function(err,rs){
            
                        if(err){
                            done(err,null)
                        }
                        try {
                             done(null,rs)
            
                        } catch (error) {
                           done(error,null)
                        }
                       
                       
                    })
    },
    /**
     * @argument model 
     * @description API từ chối model
     */
    rejectmodel:function(model,done){
        serviceTest.requsetPost(model,'front/reject',function(err,rs){
            
                        if(err){
                            done(err,null)
                        }
                        try {
                             done(null,rs)
            
                        } catch (error) {
                           done(error,null)
                        }
                       
                       
                    })
    },
    /**
     * @argument model 
     * @description API xoá model
     */
    deletemodel:function(model,done){
        serviceTest.requsetPost(model,'front/delete',function(err,rs){
            
                        if(err){
                            done(err,null)
                        }
                        try {
                             done(null,rs)
            
                        } catch (error) {
                           done(error,null)
                        }
                       
                       
                    })
    },
    /**
     * @argument model 
     * @description API thực thi model
     */
    callAPI:function(obj,done) {
              serviceTest.requsetPost(obj,'front/execProd',function(err,rs){
                        if(err){
                            done(err,null)
                        }
                        try {
                             done(null,rs)
            
                        } catch (error) {
                           done(error,null)
                        }
                       
                       
                    })
    },

    /**
     * @argument model 
     * @description API thực thi model
     */
    callAPIWithUrl:function(url,obj,done) {
        serviceTest.requsetPost(obj,url,function(err,rs){
                  //console.log('res',rs)
                  if(err){
                      done(err,null)
                  }
                  try {
                       done(null,rs)
      
                  } catch (error) {
                     done(error,null)
                  }
                 
                 
              })
}
}