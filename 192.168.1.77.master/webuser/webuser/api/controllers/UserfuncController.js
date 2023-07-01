/**
 * UserfuncController
 *
 * @description :: Server-side logic for managing userfuncs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var data = require('../datafake/menu.json')
var Ioutput = require('../common/OutputInterface.js')
module.exports = {
  //hàm convert menu sang dạng chirlden
  convetMenu: function (data, options) {
    // return new Promise((resolve,reject)=>{
    options = options || {};
    var ID_KEY = options.idKey || 'id';
    var PARENT_KEY = options.parentKey || 'parent';
    var CHILDREN_KEY = options.childrenKey || 'children';

    var tree = [],
      childrenOf = {};
    var item, id, parentId;

    for (var i = 0, length = data.length; i < length; i++) {
      item = data[i];
      delete item["updatedAt"]
      delete item["createdAt"]
      delete item["SHORTCUT"]
      delete item["LEV"]
      delete item["TLID"]
      delete item["USERID"]
      delete item["MODCODE"]
      id = item[ID_KEY];
      parentId = item[PARENT_KEY] || null;
      // every item may have children
      childrenOf[id] = childrenOf[id] || [];
      // init its children
      item[CHILDREN_KEY] = childrenOf[id];
      if (parentId != null) {
        // init its parent's children object
        childrenOf[parentId] = childrenOf[parentId] || [];
        // push it into its parent's children object
        childrenOf[parentId].push(item);
      } else {
        tree.push(item);
      }
    };

    return tree;
    // })

  },
  insert_all: function (req, res) {
    data.map((userfunc) => {
      Userfunc.create(userfunc).exec(() => { })
    })
    return res.send(data);
  },
  // get_all: function (req, res) {
  //   Userfunc.find().exec((err, list) => {
  //     return res.send(list)
  //   })
  // },
  getMenu: function (req, res) {
    //  let USERID = req.body.USERID
    //  console.log(USERID)
    var self = this;
    if (!req.session) {
      //sails.log.info("getMenu.:session null:", req);
      return res.send(Ioutput.expireSession({
        displayMsg: false,
        msg: 'Chưa đăng nhập polices tra ve'
      }));
    }
    if (req.session.userinfo) {
      //sails.log('req.session:::::::::',req.session)
      //sails.log('req.session.userinfo :::::::::',req.session.userinfo)
      let USERID = req.session.userinfo.ISCUSTOMER == 'Y' ? sails.config.USERONL : req.session.userinfo.USERID
      sails.log('USERID:::::::::',USERID)
      //sails.log('Userfunc:::::::::',Userfunc.length)
      // let ISFIRSTLOGIN = req.session.userinfo.ISFIRSTLOGIN == 'Y' ? true : false      
      Userfunc.find({
        USERID: USERID
      }).then(list => {
        //sails.log('list :::::::::',list)
        sails.log('list length:::::::::',list.length)
        if (list) {
          var tree = self.convetMenu(list, {
            idKey: 'CMDID',
            parentKey: 'PRID',
            childrenKey: 'children'
          });
          return res.send(tree);
        } else {
          return res.send([]);
        }
      }).catch(err => {
        sails.log("Userfunc.find====================>", USERID, err)
        return res.send([]);
      })
    } else {
      sails.log(" khong co req.session.userinfo, tra ve mang rong")
      return res.send([])
    }



  }
};
