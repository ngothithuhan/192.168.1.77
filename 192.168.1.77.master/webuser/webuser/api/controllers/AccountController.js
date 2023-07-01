/**
 * AccountController
 *
 * @description :: Server-side logic for managing accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var path = require("path");
var data = require("../datafake/Account.json");
var processingserver = require("../commonwebuser/ProcessingServer");
var commonUtil = require("../common/CommonUtil");
var Ioutput = require(path.resolve(__dirname, "../common/OutputInterface.js"));
var RestfulHandler = require("../common/RestfulHandler");
var ConvertData = require("../services/ConvertData");
var LogHelper = require(path.resolve(__dirname, "../common/LogHelper"));
const LOG_TAG = "AccountController.:";
var svgCaptcha = require("svg-captcha");
var request = require('request');
const Utils = require("../common/Utils");
var _ = require("lodash");
//var data = require('../datafake/Account.json')
//var RestfulHandler = require('../common/RestfulHandler');
AllAccounts = [];
AllAccountsManage = [];
function buildStrinput(obj) {
  delete obj["_csrf"]
  try {
    let v_return = "";
    for (var property in obj) {
      v_return += obj[property] + "~#~";
    }
    v_return = v_return.slice(0, v_return.length - 3);
    return v_return;
  } catch (error) {
    sails.log.error(error);
    return "";
  }
}
module.exports = {
  //insert 1 account moi
  add: function (req, res) {
    let data = req.body;
    data.ROLE = req.session.userinfo.ROLECODE;
    data = Account.newInstance(data);
    data = commonUtil.convertPropsNullToEmpty(data);

    data.CUSTID = { dir: 3002, type: 2001, val: data.CUSTID };
    let obj = { model: data };
    // console.log(data)
    processingserver.createmodel(obj, function (err, rs) {
      // console.log(rs)
      ErrDefs.findOne({ ERRNUM: res.EC }).exec((err, errdefs) => {
        if (err) {
          rs.EM = "Lỗi thực hiện trên redis";
          return res.send(rs);
        }
        if (errdefs) rs.EM = errdefs.ERRDESC;
        return res.send(rs);
      });
    });
  },
  /**
   * @desc Duyệt tài khoản
   * @argument req.body
   */
  approve: function (req, res) {
    let data = req.body;

    // for (var item of data) {
    data = Account.newInstance(data);
    data = commonUtil.convertPropsNullToEmpty(data);
    data = RestfulHandler.addSessionInfo(data, req);
    let obj = { model: data };
    // console.log("obj approve ====", JSON.stringify(obj))
    processingserver.approvemodel(obj, function (err, rs) {
      ErrDefs.findOne({ ERRNUM: res.EC }).exec((err, errdefs) => {
        if (err) {
          rs.EM = "Lỗi thực hiện trên redis";
          return res.send(rs);
        }
        if (errdefs) rs.EM = errdefs.ERRDESC;
        // console.log("rs...", rs);
        return res.send(rs);
      });
    });
    // }
  },
  /**
   * @desc Từ chối tài khoản
   * @argument req.body
   */
  reject: function (req, res) {
    let data = req.body;
    // for (var data of data) {
    data = Account.newInstance(data);
    data = commonUtil.convertPropsNullToEmpty(data);
    let obj = { model: data };
    // console.log("model...reject", JSON.stringify(obj))
    processingserver.rejectmodel(obj, function (err, rs) {
      ErrDefs.findOne({ ERRNUM: res.EC }).exec((err, errdefs) => {
        if (err) {
          rs.EM = "Lỗi thực hiện trên redis";
          return res.send(rs);
        }
        if (errdefs) rs.EM = errdefs.ERRDESC;
        // console.log(rs);
        return res.send(rs);
      });
    });
    // }
  },
  /**
   * @desc Huỷ tài khoản
   * @argument req.body
   */
  cancel: function (req, res) {
    let data = req.body;
    // for (var data of data) {
    data = Account.newInstance(data);

    data = commonUtil.convertPropsNullToEmpty(data);
    let obj = { model: data };
    // console.log("model...reject", JSON.stringify(obj))
    processingserver.deletemodel(obj, function (err, rs) {
      ErrDefs.findOne({ ERRNUM: rs.EC }).exec((err, errdefs) => {
        if (err) {
          rs.EM = "Lỗi thực hiện trên redis";
          return res.send(rs);
        }
        if (errdefs) rs.EM = errdefs.ERRDESC;
        // console.log(rs);
        return res.send(rs);
      });
    });
    // }
  },

  // linh.trinh lấy option cho component ReactSelect
  get_options: function (req, res) {
    let optionsFilter = req.body;
    let { TLID } = req.session.userinfo;

    Accountmanage.find({ TLID: TLID }).exec((err, listAccountmanage) => {
      let result = listAccountmanage.map(accountmanage => {
        return accountmanage.CUSTID;
      });
      Account.find(optionsFilter)
        .where({ CUSTID: result })
        //   .paginate({ limit: pagesize,page:req.body.page })
        .exec(function (err, accounts) {
          if (err) {
            res.send("error");
          }
          result = accounts.map(account => {
            return {
              label: account.CUSTODYCD,
              value: account.CUSTID
            };
          });

          return res.send(result);
        });
    });
  },
  get_detailOptions: function (req, res) {
    let option_getDetail = req.body;
    Account.findOne(option_getDetail).exec((err, account) => {
      if (err) {
      }
      if (account) {
        return res.send(account);
      }
      return res.send({});
    });
  },
  //check tai khoan co thuoc moi gioi nay
  /*
  isCareby: async function (req, res) {
    let { TLID } = req.session.userinfo;
    let { CUSTODYCD } = req.body;

    // Accountmanage.find({ TLID: TLID }).exec((err, listAccountmanage) => {
    //     let result = listAccountmanage.map((accountmanage) => {
    //         return accountmanage.CUSTID
    //     })
    //     Account.find({ CUSTODYCD: CUSTODYCD })
    //         .where({ CUSTID: result })
    //         //   .paginate({ limit: pagesize,page:req.body.page })
    //         .exec(function (err, accounts) {
    //             if (err) {
    //                 res.send('error');
    //             }
    //             //accounts = accounts.filter(account => account.STATUS == 'A')
    //             let isCareby = false
    //             if (accounts.length > 0)
    //                 isCareby = true;
    //             return res.send({ isCareby: isCareby });
    //         })
    // });

    let accounts = await Paging.find(AllAccounts, [
      { id: "TELLERID", value: TLID },
      { id: "CUSTODYCD", value: CUSTODYCD }
    ]);

    let isCareby = false;
    if (accounts.length > 0) isCareby = true;
    return res.send({ isCareby: isCareby });
  },
  */
  //linh.trinh ham nay lay tat ca account theo tlid cho react-select
  search_all: async function (req, res) {
    let { key, type, detail, keyStatus } = req.body;

    key = key ? key.toUpperCase() : "";
    sails.log('key:::', key)
    let { TLID, CUSTID, USERID } = req.session.userinfo;
    //console.log('ha_check',req.body , 'TLID',TLID)
    if (TLID != sails.config.USERONL) {
      let accounts = []
      if (keyStatus && keyStatus != undefined && keyStatus != null) {
        accounts = await this.getAllAccounts(TLID, key, keyStatus)
      }
      else {
        accounts = await this.getAllAccounts(TLID, key)
      }
      if (accounts && accounts.length > 11) {
        accounts = Paging.paginate(accounts, 10, 1);
      }
      let result = accounts.map(account => {
        return {
          // label: account.CUSTODYCD + "-" + account.FULLNAME,
          label: account.CUSTODYCD,
          value: type == "CUSTID" ? account.CUSTID : account.CUSTODYCD,
          detail: account ? account : null

        };
      });
      return res.send(result);
    } else {
      let accountids = []
      var _ = require('lodash');
      try {
        let accManage = _.filter(AllAccountsManage, { USERNAME: req.session.userinfo.USERNAME });

        if (accManage && accManage.length > 0) {
          let listAccount = _.uniq(accManage[0].ARRAY_CUSTODYCD);
          accountids = _.filter(listAccount, a => { return (!(req.body.key).toUpperCase() || (req.body.key).toUpperCase().length == 0) ? true : a.includes((req.body.key).toUpperCase()) });
          // let accounts = await this.getAllAccounts(TLID, listAccount, keyStatus)
          let accounts = await this.getAllAccounts(TLID, req.session.userinfo.USERNAME, keyStatus)

          accountids = accountids.map(item => {
            let child = [];
            if (accounts && accounts.length > 1) {
              child = accounts.find(x => x.CUSTODYCD === item);
              return { label: item, value: item, detail: child ? child : null };
            }
            else {
              return { label: item, value: item, detail: accounts ? accounts[0] : null };
            }
          });

        }
      } catch (error) {
        sails.log.error("getAllAccounts", error)
      }
      return res.send(accountids);
    }
  },
  search_all_show_fullname: async function (req, res) {
    let { key, type, detail, keyStatus } = req.body;
    key = key ? key.toUpperCase() : "";
    let { TLID, CUSTID, USERID } = req.session.userinfo;
    if (TLID != sails.config.USERONL) {
      let accounts = []
      if (keyStatus && keyStatus != undefined && keyStatus != null) {
        accounts = await this.getAllAccounts(TLID, key, keyStatus)
      }
      else {
        accounts = await this.getAllAccounts(TLID, key)
      }
      if (accounts && accounts.length > 11) {
        accounts = Paging.paginate(accounts, 10, 1);
      }
      let result = accounts.map(account => {
        return {
          label: account.CUSTODYCD + '-' + account.FULLNAME,
          value: type == "CUSTID" ? account.CUSTID : account.CUSTODYCD,
          detail: detail == "DETAIL" ? account ? account : null : null

        };
      });
      return res.send(result);
    } else {
      let accountids = []
      var _ = require('lodash');
      try {
        let accManage = _.filter(AllAccountsManage, { USERNAME: req.session.userinfo.USERNAME })
        if (accManage && accManage.length > 0) {
          let listAccount = accManage[0].ARRAY_CUSTODYCD;
          accountids = _.filter(listAccount, a => { return (!(req.body.key).toUpperCase() || (req.body.key).toUpperCase().length == 0) ? true : a.includes((req.body.key).toUpperCase()) });
          let accounts = await this.getAllAccounts(TLID, listAccount, keyStatus)
          accountids = accountids.map(item => {
            return { label: item, value: item, detail: detail == "DETAIL" ? accounts ? accounts[0] : null : null };
          });

        }
      } catch (error) {
        sails.log.error("getAllAccounts", error)
      }
      return res.send(accountids);
    }
  },
  search_all_fullname2: async function (req, res) {
    //để làm dấu hiệu lấy CUSTID

    let { key, type, detail, listCareBy } = req.body;
    //console.log('req.session.userinfo', req.session.userinfo)
    let { TLID, CUSTID, USERID } = req.session.userinfo;
    if (TLID != sails.config.USERONL) {
      let tmp = [];
      let accounts = [];
      var i, j;
      for (i = 0; i < listCareBy.length; i++) {
        accounts = await Paging.find(AllAccounts, [
          { id: "CAREBY", value: listCareBy[i] }
        ]);
        if (accounts.length > 0) {
          for (j = 0; j < accounts.length; j++) {
            tmp.push(accounts[j])
          }
        }
      }
      accounts = tmp;
      //sails.log('accounts:=======',accounts)
      accounts = Paging.find(accounts, [{ id: "CUSTODYCD", value: key }]);
      // if (accounts && accounts.length > 21) {
      //   accounts = Paging.paginate(accounts, 10, 1);
      // }
      let result = accounts.map(account => {
        return {
          label: account.CUSTODYCD + "-" + account.FULLNAME,
          value: type == "CUSTID" ? account.CUSTID : account.CUSTODYCD,
          detail: account
        };
      });
      return res.send(result);
    } else
      return res.send([
        {
          label: USERID,
          value: type == "CUSTID" ? CUSTID : USERID
        }
      ]);
  },

  getcarebygroupbytlid: async function (req, res) {

    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language
    }

    let obj =
    {
      "funckey": "prc_get_tlgroup_by_tlid",
      bindvar: rest
    }
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        if (rs.EC == 0) {

          rs.DT = ConvertData.convert_to_Object(rs.DT.p_refcursor);

          return res.send(Ioutput.success(rs.DT));
        } else {
          return res.send(rs);
        }
      } catch (error) {
        rs.EM = 'Lỗi client gọi api';
        rs.EC = -1000;
        return res.send(rs)
      }
    });
  },
  search_all_order: async function (req, res) {
    //để làm dấu hiệu lấy CUSTID
    let { key, type, detail } = req.body;
    //console.log('req.session.userinfo', req.session.userinfo)
    let { TLID, CUSTID, USERID } = req.session.userinfo;

    if (TLID != sails.config.USERONL) {
      // let accounts = await Paging.find(AllAccounts, [
      //   { id: "TELLERID", value: TLID }
      // ]);

      // accounts = Paging.find(accounts, [{ id: "CUSTODYCD", value: key }]);
      let accounts = await this.getAllAccounts(TLID, key, ["A", "J"])
      if (accounts && accounts.length > 11) {
        accounts = Paging.paginate(accounts, 10, 1);
      }
      let result = [];
      for (let i = 0; i < accounts.length; i++) {
        let account = accounts[i]
        result.push({
          label: account.CUSTODYCD,
          value: type == "CUSTID" ? account.CUSTID : account.CUSTODYCD,
          detail: detail == "DETAIL" ? account : null
        })
      }
      return res.send(result);
    } else
      return res.send([
        {
          label: USERID,
          value: type == "CUSTID" ? CUSTID : USERID,
          detail: null
        }
      ]);
  },
  search_all_fullname: async function (req, res) {
    //để làm dấu hiệu lấy CUSTID
    let { key, type, detail } = req.body;

    key = (req.body.key).toUpperCase();
    sails.log('search_all_fullname key:', key);
    //console.log('req.session.userinfo', req.session.userinfo)
    let { TLID, CUSTID, USERID } = req.session.userinfo;
    if (TLID != sails.config.USERONL) {
      //  let accounts = await Paging.find(AllAccounts, [
      //   { id: "TELLERID", value: TLID }
      //  ]);

      // accounts = Paging.find(accounts, [{ id: "CUSTODYCD", value: key }]);
      let accounts = await this.getAllAccounts(TLID, key)
      if (accounts && accounts.length > 21) {
        accounts = Paging.paginate(accounts, 10, 1);
      }
      let result = accounts.map(account => {
        return {
          label: account.CUSTODYCD + "-" + account.FULLNAME,
          value: type == "CUSTID" ? account.CUSTID : account.CUSTODYCD
        };
      });
      return res.send(result);
    } else
      return res.send([
        {
          label: USERID,
          value: type == "CUSTID" ? CUSTID : USERID
        }
      ]);
  },
  insert_all: function (req, res) {
    data.map(account => {
      Account.create(account).exec(() => { });
    });
    return res.send(data);
  },

  //cap nhat ban ghi vua ms them moi
  update: function (req, res) {
    let data = req.body;
    data = Account.newInstance(data);
    data = commonUtil.convertPropsNullToEmpty(data);
    data.CUSTID = { dir: 3002, type: 2001, val: data.CUSTID };
    let obj = { model: data };
    // console.log('update',data)
    processingserver.updatemodel(obj, function (err, rs) {
      ErrDefs.find({ ERRNUM: res.EC }).exec((err, errdefs) => {
        if (err) {
          rs.EM = "Lỗi thực hiện trên redis";
          return res.send(rs);
        }
        rs.EM = errdefs.ERRDESC;
        return res.send(rs);
      });
    });
  },

  refresh: function (req, res) {
    try {
      let { TLID, ROLECODE, USERID } = req.session.userinfo;
      let { language, isSync } = req.body;

      //delete req.body["language"];
      serviceTest.requsetPost(
        { TLID: TLID, ROLECODE: ROLECODE, LANG: language, TLNAME: USERID },
        "front/syncAccountByTLID",
        async function (err, rs) {
          if (err) {
            return res.send(Ioutput.errServer(err));
          }
          if (rs.EC == 0) {
            if (isSync)
              return res.send(Ioutput.success({ data: [], numOfPages: 0 }));
            let length = rs.DT.length;
            var pagesize = parseInt(req.body.pagesize);
            var numOfPages = Math.ceil(length / pagesize);
            let datapage = length > pagesize ? rs.DT.slice(0, pagesize) : rs.DT;
            rs.DT = {};
            // var custtypes = await Allcode.find({ CDTYPE: 'CF', CDNAME: 'CUSTTYPE' });
            // var statusdescs = await Allcode.find({ CDTYPE: 'CF', CDNAME: 'CFSTATUS' });

            Promise.all(
              datapage.map(item => {
                return new Promise(async (resolve, reject) => {
                  // let CUSTTYPE_DESC = ''
                  // let STATUS_DESC = ''
                  // let rs = custtypes.filter(custtype => custtype.CDVAL == item.CUSTTYPE)
                  // if (rs.length > 0) {
                  //     CUSTTYPE_DESC = rs[0].CDCONTENT;
                  // }
                  // rs = custtypes.filter(custtype => custtype.CDVAL == item.STATUS)
                  // if (rs.length > 0) {
                  //     STATUS_DESC = rs[0].CDCONTENT;
                  // }
                  resolve({
                    ...item,
                    STATUS_DESC: await AllcodeUtils.get_status(
                      "CF",
                      "CFSTATUS",
                      item.STATUS
                    ),
                    CUSTTYPE_DESC: await AllcodeUtils.get_status(
                      "CF",
                      "CUSTTYPE",
                      item.CUSTTYPE
                    )
                  });
                });
              })
            ).then(data_response => {
              var DT = { data: data_response, numOfPages: numOfPages };
              return res.send(Ioutput.success(DT));
              //resolve(data_response)
            });
            // rs.DT.data = datapage
            // rs.DT.numOfPages = numOfPages
            // return res.send(rs)
          } else {
            return res.send(rs);
          }
        }
      );
    } catch (error) {
      res.send(Ioutput.errServer(error));
    }
  },
  //lay ds chi nhanh theo ngan hang
  getBankBranch: async function (req, res) {
    let data = req.body;
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_mbid: data.mbid,
      p_language: data.language
    };
    //console.log("getBankBranch ", rest)
    let obj = {
      funckey: "prc_get_bank_branch",
      bindvar: rest
    };
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        if (rs.EC == 0) {
          let result,
            resultdata = ConvertData.convert_to_Object(rs.DT.p_refcursor);

          result = resultdata.map(item => {
            return {
              value: item.BRID,
              label: item.BRNAME
            };
          });
          //console.log('result ', resultdata)
          return res.send({ resultdata, result });
        } else {
          return res.send(rs);
        }
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },

  getAllAccounts: async function (TLID, CUSTODYCD, StatusArr, isSearchOne) {
    let accounts = []
    try {
      if (TLID == sails.config.USERONL) {

        //Tìm tất cả tài khoản có chung CFUSERNAME = username đăng nhập
        accounts = await Paging.find(AllAccounts, [
          { id: "CFUSERNAME", value: CUSTODYCD }
        ]);

        //Khi muốn tìm 1 tài khoản theo CUSTODYCD
        if (accounts && accounts.length === 0 && isSearchOne) {
          accounts = await Paging.find(AllAccounts, [
            { id: "CUSTODYCD", value: CUSTODYCD }
          ]);
        }
      }

      else if (sails.config.TLIDADMIN.indexOf(TLID) > -1) {
        if (CUSTODYCD === 'ALL' || CUSTODYCD === '')
          return AllAccounts;
        else
          accounts = await Paging.find(AllAccounts, [
            { id: "CUSTODYCD", value: CUSTODYCD }
          ]);
      }
      else {
        let list = await Paging.find(AllAccountsManage, [{ id: "TELLERID", value: TLID }])
        if (list)
          if (list.length > 0)
            accounts = await Paging.findArrVal(AllAccounts, "CUSTODYCD", list[0].ARRAY_CUSTODYCD)
        if (CUSTODYCD !== 'ALL' && CUSTODYCD !== '')
          accounts = await Paging.find(accounts, [{ id: "CUSTODYCD", value: CUSTODYCD }])
      }
      if (StatusArr)
        if (StatusArr.length > 0)
          accounts = await Paging.findArrVal(accounts, "STATUS", StatusArr)
    } catch (error) {
      sails.log.error("getAllAccounts", error)
    }
    return accounts;
  },

  getAllAccounts_bk: async function (TLID, CUSTODYCD, StatusArr) {
    sails.log('getAllAccounts:::', TLID, CUSTODYCD, StatusArr)
    let accounts = []
    try {
      if (TLID == sails.config.USERONL)
        accounts = await Paging.find(AllAccounts, [
          { id: "CUST_FULLNAME", value: CUSTODYCD }
        ]);
      else if (sails.config.TLIDADMIN.indexOf(TLID) > -1) {
        if (CUSTODYCD === 'ALL' || CUSTODYCD === '')
          return AllAccounts;
        else
          accounts = await Paging.find(AllAccounts, [
            { id: "CUST_FULLNAME", value: CUSTODYCD }
          ]);
        sails.log('accounts[0]:', accounts.length, AllAccounts[0])
      }
      else {
        let list = await Paging.find(AllAccountsManage, [{ id: "TELLERID", value: TLID }])
        if (list)
          if (list.length > 0)
            accounts = await Paging.findArrVal(AllAccounts, "CUSTODYCD", list[0].ARRAY_CUSTODYCD)
        if (CUSTODYCD !== 'ALL' && CUSTODYCD !== '')
          accounts = await Paging.find(accounts, [{ id: "CUST_FULLNAME", value: CUSTODYCD }])
        sails.log('accounts[0]:', accounts.length, accounts[0])
      }
      if (StatusArr)
        if (StatusArr.length > 0)
          accounts = await Paging.findArrVal(accounts, "STATUS", StatusArr)
    } catch (error) {
      sails.log.error("getAllAccounts", error)
    }
    return accounts;
  },
  getAccountIdsByUsername: function (req, res) {
    let accountids = []
    var _ = require('lodash');
    try {

      if (sails.config.TLIDADMIN.indexOf(req.session.userinfo.TLID) > -1) {    //giang.ngo: trường hợp là user admin
        let listAccount = AllAccounts;
        accountids = _.filter(listAccount, a => { return (!req.body.key || req.body.key.length == 0) ? true : a.CUSTODYCD.includes((req.body.key).toUpperCase()) });

        accountids = accountids.map(item => {
          return { label: item.CUSTODYCD + '-' + item.FULLNAME, value: item.CUSTODYCD };
        });
      } else {
        let accManage = _.filter(AllAccountsManage, { USERNAME: req.session.userinfo.USERNAME });
        if (accManage && accManage.length > 0) {

          let listAccount = accManage[0].ARRAY_CUSTODYCD;
          accountids = _.filter(listAccount, a => { return (!req.body.key || req.body.key.length == 0) ? true : a.includes((req.body.key).toUpperCase()) });

          accountids = accountids.map(item => {
            return { label: item, value: item };
          });
          //sails.log('accountids:',accountids)

        }
      }
    } catch (error) {
      sails.log.error("getAllAccounts", error)
    }
    return res.send(accountids);

  },
  getcfmastbycustid: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE, USERID } = req.session.userinfo;
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_custid: data.custid,
      p_tlid: TLID,
      p_role: ROLECODE,
      p_userid: USERID,
      p_language: data.language
    }
    sails.log("-----thanh.ngo getcfmastbycustid req.session.userinfo:", req.session.userinfo)
    let obj =
    {
      "funckey": "prc_get_cfmast_by_custid",
      bindvar: rest
    }
    processingserver.callAPI(obj, async function (err, rs) {

      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        // console.log(".....", rs)

        if (rs.EC == 0) {

          let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);

          return res.send(Ioutput.success(result));

        } else {
          return res.send(rs);
        }
      } catch (error) {
        rs.EM = 'Lỗi client gọi api';
        rs.EC = -1000;
        return res.send(rs)
      }
    });
  },

  filterAccountWithCriteria: function (keySearch, allAccounts) {
    if (keySearch && keySearch.length > 0) {
      allAccounts = allAccounts.filter(function (item, index) {
        let values = JSON.stringify(item)
        values = values.replace(/{"CUSTID":"|"CUSTODYCD":|"SID":|"FULLNAME":|"SHORTNAME":|"ACCTYPE":|"CUSTTYPE":|"GRINVESTOR":|"SEX":|"BIRTHDATE":|"IDTYPE":|"IDCODE":|"IDDATE":|"IDDATE_FD":|"IDEXPDATED":|"IDPLACE":|"TRADINGCODE":|"TRADINGDATE":|"TAXNO":|"ADDRESS":|"INVESTTIME":|"RUIRO":|"EXPERIENCE":|"ISAGREESHARE":|"COUNTRY":|"PROVINCE":|"PHONE":|"MOBILE":|"EMAIL":|"DBCODE":|"STATUS":|"CFSTATUS_DESC":|"CFSTATUS_DESC_EN":|"PSTATUS":|"LASTCHANGE":|"BANKACC":|"BANKCODE":|"MBNAME":|"CITYBANK":|"BANKACNAME":|"CAREBY":|"VSDSTATUS":|"VSDSTATUS_DESC":|"VSDSTATUS_DESC_EN":|"MAKER":|"TELLERID":|"ACCTGRP":|"ACCTGRP_DESC":|"ACCTGRP_DESC_EN":|"OPNDATE":|"OPNDATE_FD":|"CLASSCD_DESC":|"CLASSCD_DESC_EN":|"CLASSSIPCD_DESC":|"CLASSSIPCD_DESC_EN":|"CAREBY_DESC":|"CUSTTYPE_DESC":|"CUSTTYPE_DESC_EN":|"ISCFLEAD":|"ISCFLEAD_DESC":|"ISCFLEAD_DESC_EN":|"NOTE":|"ISONLINE":|"TAXNUMBER":|"SONHAREG":|"PHOTHONXOMREG":|"PHUONGXAREG":|"THANHPHOREG":|"JOB":|"POSITIONCN":|"WORKADDRESS":|"VISANO":|"LIDONHAPCANH":|"CAPITALNAME":|"CAPITALPOSITION":|"CAPITALIDCODE":|"CAPITALIDDATE":|"CAPITALIDPLACE":|"CAPITALTEL":|"CAPITALEMAIL":|"ONLINENAME":|"ONLINEPHONE":|"ONLINEEMAIL":|"LISTCODEIDINTERNAL":|"STATUSFILE":|"SALENAME":|"SALEACCTNO":|"SALEID":|"SALEDEFAULT":|"SALENAMEDEFAULT":|"ISCFINFO":|"CFUSERNAME":|"AUTHTYPE":|"FULLNAME_NL":|"IDPLACE_NL":|"ADDRESS_NL":|"CLASSCD_DESC_NL":|"CLASSSIPCD_DESC_NL":|"ACCTGRP_DESC_NL":|"CAREBY_DESC_NL":|"CFSTATUS_DESC_NL":|"VSDSTATUS_DESC_NL":|"ISCFLEAD_DESC_NL":|"CUST_FULLNAME"/g, "#$");
        if (_.includes(values, keySearch)) {
          // console.log(">>>> check filterAccountWithCriteria", values)
        }
        return _.includes(values, keySearch);
      })
    }
    return allAccounts;
  },

  //lay danh sach account theo tlid
  getlist: async function (req, res) {
    // if (!req.isSocket) {
    //     sails.log.debug('no socket');
    //     return res.badRequest();
    // }
    // if (req.isSocket) {
    //     // If this code is running, it's made it past the `isAdmin` policy, so we can safely
    //     // watch for `.publishCreate()` calls about this model and inform this socket, since we're
    //     // confident it belongs to a logged-in administrator.
    //     sails.log.debug('is socket');
    //     //để  đăng kí sự kiện lăng nghe model Command thay đổi kích hoạt sự kiện on('command') bên phía client
    //     Account.watch(req);
    // }
    // let { TLID } = req.session.userinfo;
    // let self = this;

    // var start = process.hrtime();
    // let begincount = LogHelper.getDuration(process.hrtime(start));
    // sails.log.info(LOG_TAG, "getlist.:Begin:Duration:", begincount, "body", req.body);
    // if (req.session.userinfo) {
    //     var keySearch = Paging.generate_keySearch(req.body);
    //     let dataCount = { ...keySearch }
    //     // chèn thêm điều kiện find dữ liệu theo trường Custid

    //     Account.find({ PRIKEY: { 'like': "%:" + TLID + '.%' } })
    //         .where(dataCount)
    //         .sort('createdAt DESC')
    //         .exec(async function (err, acclist) {
    //             let endcount = LogHelper.getDuration(process.hrtime(start));
    //             sails.log.info(LOG_TAG, "getlist.:Count:Duration:", endcount, "length", acclist ? acclist.length : 0, "body", req.body)
    //             if (err) return next(err);
    //             let pagesize = parseInt(req.body.pagesize);
    //             let numOfPages = Math.ceil((acclist ? acclist.length : 0) / pagesize);
    //             let page_number = req.body.page - 1;//base 0

    //             let response = acclist.slice(page_number * pagesize, (page_number + 1) * pagesize);
    //             var DT = { data: response, numOfPages: numOfPages }
    //             let end = LogHelper.getDuration(process.hrtime(start));
    //             sails.log.info(LOG_TAG, "getlist.:User:Page:Duration:", end, "length", response ? response.length : 0, "body", req.body)
    //             return res.send(Ioutput.success(DT));
    //         });
    // }

    try {
      let result = [];

      let numAcc = 0;
      let tmpid = '';
      tmpKeySearch = [];
      tmpKeySearch2 = [];
      let temp = [];
      let { pagesize, page, keySearch, sortSearch, objectCreterial } = req.body;
      let { TLID } = req.session.userinfo;

      let isfullname = 'N';

      let CUSTODYCD = (TLID === sails.config.USERONL) ? req.session.userinfo.USERNAME : 'ALL';
      result = await this.getAllAccounts(TLID, CUSTODYCD);

      let isFilterAcc = objectCreterial && !_.isEmpty(objectCreterial);
      if (isFilterAcc === true) {
        result = this.filterAccountWithCriteria(objectCreterial.keySearch, result);

      }

      if (keySearch || isFilterAcc === true) {
        if (keySearch.length > 0 || isFilterAcc === true) {

          for (let x = 0; x < keySearch.length; x++) {
            if (keySearch[x].id == 'FULLNAME') {
              isfullname = 'Y'
            }
          }
          //--------------------sắp xếp lại keysearch----------
          if (isfullname == 'Y') {
            for (let k = 0; k < keySearch.length; k++) {
              if (keySearch[k].id == 'FULLNAME') {
                tmpKeySearch2.push(keySearch[k])
                for (let g = 0; g < keySearch.length; g++) {
                  if (keySearch[g].id != 'FULLNAME') {
                    d
                    tmpKeySearch2.push(keySearch[g])
                  }
                }
              }
            }
          }
          else {
            tmpKeySearch2 = keySearch
          }
          console.log('tmpKeySearch2:', tmpKeySearch2)
          //--------------------------------------------------
          if (isfullname == 'Y') {
            for (let i = 0; i < tmpKeySearch2.length; i++) {
              sails.log('keySearch :-----------', tmpKeySearch2)

              if (tmpKeySearch2[i].id == 'FULLNAME') {
                for (let j = 0; j < result.length; j++) {
                  //---------------------------tìm những bản ghi có upper fullname có chứa upper của giá trị fullname nhập vào
                  if ((result[j].FULLNAME).toUpperCase().includes(
                    tmpKeySearch2[i].value.toUpperCase())) {
                    temp.push(result[j])
                  }
                }
              }
              else if (tmpKeySearch2[i].id != 'FULLNAME') {
                //------------ nếu keysearch khác fullname thì tạo ra bộ keysearch mới không có id = fullname, lọc bộ giá trị temp đẩy ra ở trên theo bộ keysearch mới đó

                tmpKeySearch.push(tmpKeySearch2[i])
                sails.log('jump to diff 2 :', tmpKeySearch)
                temp = await Paging.find(temp, tmpKeySearch);
              }
            }
          }
          else {
            temp = await Paging.find(result, keySearch);
          }

          result = temp;
        }
        else {

          temp = await this.getAllAccounts(TLID, CUSTODYCD);
          result = temp;
        }
      }
      sails.log('result final.length:--------', result.length)
      numAcc = result.length;
      let numOfPages = Math.ceil(result.length / pagesize);

      if (sortSearch) {
        if (sortSearch.length > 0)
          result = await Paging.orderby(result, sortSearch);
        else
          result = await Paging.orderby(result, [
            { id: "TXDATE", desc: true },
            { id: "CREATEDT", desc: true }
          ]);
      } else
        result = await Paging.orderby(result, [
          { id: "TXDATE", desc: true },
          { id: "CREATEDT", desc: true }
        ]);
      result = await Paging.paginate(result, pagesize, page ? page : 1);
      var DT = { data: result, numOfPages: numOfPages, sumRecord: numAcc };

      return res.send(Ioutput.success(DT));
    } catch (error) {
      let rs = {};
      rs.EM = "Lỗi client gọi api";
      rs.EC = -1000;
      return res.send(rs);
    }
  },
  getall: function (req, res) {
    Account.find().exec((err, list) => {
      return res.send(list);
    });
  },


  //giang.ngo: lay thong tin account tren redis
  get_generalinfor: async function (req, res) {
    // let criteria = req.body;
    // var account = await Account.findOne(criteria);
    // return res.send(Ioutput.jsonAPIOutput(0, '', account))
    let { CUSTODYCD } = req.body;
    let { TLID } = req.session.userinfo;
    let result = await this.getAllAccounts(TLID, CUSTODYCD, '', true);

    //  let result = await Paging.find(AllAccounts, [
    //    { id: "CUSTODYCD", value: CUSTODYCD },
    //  { id: "TELLERID", value: TLID }
    // ]);
    if (result.length > 0)
      return res.send(Ioutput.jsonAPIOutput(0, "", result[0]));
    else return res.send(Ioutput.jsonAPIOutput(0, "", {}));
  },
  //giang.ngo: lay thong tin uy quyen tren redis
  get_cfauthinfor1: async function (req, res) {
    let criteria = req.body;
    sails.log('criteria:', criteria)
    //sails.log('CFAUTH:', CFAUTH) 
    var account = await CFAUTH.find(criteria);
    sails.log('account:', account)
    if (account) return res.send(Ioutput.jsonAPIOutput(0, "", account));
    return res.send(Ioutput.jsonAPIOutput(-1, "", ""));
  },
  get_cfauthinfor: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_custid: data.p_custodycd,
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.p_language
    }
    let obj =
    {
      "funckey": "prc_get_cfauth_by_custid",
      bindvar: rest
    }
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        if (rs.EC == 0) {
          let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);

          return res.send(Ioutput.success(result));
        } else {
          return res.send(rs);
        }
      } catch (error) {
        rs.EM = 'Lỗi client gọi api';
        rs.EC = -1000;
        return res.send(rs)
      }
    });
  },

  //toan.nguyen: lay thong tin UQ
  sync_cfauth: async function (req, res) {
    let { CUSTID, LANG } = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    serviceTest.requsetPost(
      { TLID: TLID, CUSTID: CUSTID, ROLECODE: ROLECODE, LANG: LANG },
      "front/syncCFAuthByCUSTID",
      function (err, rs) {
        if (err) {
          return res.send(Utils.removeException(err));
        }
        return res.send(rs);
      }
    );
  },

  //lay thong tin chi tiet account khi o che do view
  get_detail: function (req, res) {
    let data = req.body;
    data.TLID = req.session.userinfo.TLID;
    data.ret = { dir: 3003, type: 2004 };

    var obj = {
      funckey: "FOPKS_CF.PRC_GET_ACCOUNT_BY_CUSTID",
      bindvar: data
    };

    let CUSTTYPE_DESC = "ok";
    processingserver.getmodel(obj, async function (err, rs) {
      ErrDefs.find({ ERRNUM: rs.EC }).exec(async (err, errdefs) => {
        if (err) {
          rs.EM = "Lỗi thực hiện trên redis";
          return res.send(rs);
        }

        rs.EM = errdefs.ERRDESC;
        //  Allcode.findOne({CDVAL:rs.DT[0].CUSTTYPE}).exec((err,data)=>{
        //     if(data){
        //         rs.DT[0].CUSTTYPE_DESC = data.CDCONTENT ;

        //     }
        //     return res.send(rs);

        // })

        return res.send(rs);
      });
    });
    // serviceTest.requsetPost(obj,'front/execProd',function(err,rs){
    //     if(err){
    //         return res.send(err)
    //     }
    //     console.log(rs)
    //     if(rs.EC==0){
    //            let result ;

    //            result =   ConvertData.convert_to_Object(rs.DT.ret)
    //            console.log('result',result)
    //            rs.DT = result ;
    //            return res.send(rs);

    //     }
    //     else{
    //        return res.send(rs)
    //     }

    // })
  },

  search: function (req, res) {
    if (!req.isSocket) {
      sails.log.debug("no socket");
      return res.badRequest();
    }

    if (req.isSocket) {
      // If this code is running, it's made it past the `isAdmin` policy, so we can safely
      // watch for `.publishCreate()` calls about this model and inform this socket, since we're
      // confident it belongs to a logged-in administrator.
      sails.log.debug("is socket");
      //để  đăng kí sự kiện lăng nghe model Command thay đổi kích hoạt sự kiện on('command') bên phía client
      Command.watch(req);
    }

    Account.count(function foundAccount(err, length) {
      if (err) return next(err);

      var pagesize = req.body.pagesize;

      var numOfPages = Math.ceil(length / pagesize);

      var start = (req.body.page - 1) * pagesize;

      Account.find()
        .paginate({ limit: pagesize, page: req.body.page })
        .exec(function (err, rs) {
          res.send({ data: rs, numOfPages: numOfPages });
        });
    });
  },
  getFile: function (req, res) {
    Upload.findOne({ FILENAME: "linhtd" }).exec((err, upload) => {
      if (err) {
      }
      if (upload) return res.send(upload);
    });
  },
  uploadFile: function (req, res) {
    let data = req.body;
    Upload.create(data).exec((err, upload) => {
      if (err) {
      }
      if (upload) return res.send(upload);
    });
    // console.log('fromdata',req.body)
  },
  /**
   * Lấy danh sách quỹ
   */
  getFunds: function (req, res) {
    let { key } = req.body;
    let result = [];
    Funds.find({ SYMBOL: { like: "%" + key + "%" } }).exec(function (err, list) {
      if (err) {
        res.send("error");
      }
      result = list.map(item => {
        return {
          value: item.CODEID,
          label: item.SYMBOL,
          name: item.NAME
        };
      });
      return res.send(result);
    });
  },
  /**
   * Đăng ký quỹ
   */
  createRegistedFunds: function (req, res) {
    let { REID, CODEID, CUSTID, ACTION } = req.body;
    let { TLID, DBCODE, ROLECODE } = req.session.userinfo;
    let data = {};
    data = RegistedFunds.newInstance(data);
    let rest = {
      TLID,
      CODEID,
      CUSTID,
      DBCODE,
      ROLE: ROLECODE,
      REID: REID,
      REFLOGID: "",
      ACTION: "C"
    };
    data = { ...data, ...rest };
    var obj = {
      funckey: "FOPKS_CF.PRC_SEREG",
      bindvar: data
    };

    processingserver.callAPI(obj, async function (err, rs) {
      if (err) res.send("error");
      // console.log("rs=====", rs);
      return res.send(rs);
    });
  },
  /**
   * Update quỹ đăng ký
   */
  updateRegistedFunds: (req, res) => {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    let rest = {
      TLID,
      ROLE: ROLECODE,
      REFLOGID: "",
      ACTION: "U"
    };
    data = { ...data, ...rest };
    var obj = {
      funckey: "FOPKS_CF.PRC_SEREG",
      bindvar: data
    };
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) res.send("error");
      return res.send(rs);
    });
  },
  /**
   * Xoá quỹ đăng ký
   */
  deleteRegistedFunds: (req, res) => {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    data.ACTION = "D";
    data.REFLOGID = "";
    data.TLID = TLID;
    data.ROLE = ROLECODE;
    var obj = {
      funckey: "FOPKS_CF.PRC_SEREG",
      bindvar: data
    };
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) res.send("error");
      return res.send(rs);
    });
  },
  /**
   * Lấy danh sách quỹ đăng ký
   */
  getRegistedFunds: (req, res) => {
    let { CUSTID, DISPLAY } = req.body;
    // let {CUSTID} = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    let data = {};
    data = RegistedFunds.newInstance(data);
    let rest = {
      CUSTID,
      TLID,
      ret: { dir: 3003, type: 2004 },
      REFLOGID: "",
      ROLE: ROLECODE
    };
    data = { ...data, ...rest };
    var obj = {
      funckey: "FOPKS_CF.PRC_GET_SEREG_BY_CUSTID",
      bindvar: data
    };
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) res.send(Ioutput.jsonAPIOutput(-1, "loi khi goi api", err));
      else {
        if (DISPLAY == "SYMBOL") {
          let arr = ConvertData.convert_to_Object(rs.DT.ret);
          let result = [];
          for (let i in arr) {
            result.push({ value: arr[i].CODEID, label: arr[i].SYMBOL });
          }
          return res.send(result);
        } else {
          return res.send(rs);
        }
      }
      // return res.send(rs);
    });
  },
  closeFunds: function (req, res) {
    let { CUSTID, DESC, CODEID } = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    let data = {
      TLID,
      ROLE: ROLECODE,
      CUSTID,
      DESC,
      CODEID
    };
    var obj = {
      funckey: "FOPKS_CF.PRC_CLOSE_FUND",
      bindvar: data
    };
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) res.send(Ioutput.jsonAPIOutput(-1, "loi khi goi api", err));
      else return res.send(rs);
    });
  },
  /*vinh.nguyen thay doi thong tin tai khoan */
  change_info_account: function (req, res) {
    let data = req.body;
    //    console.log('body',body)
    //let data = RestfulHandler.addSessionInfo(body, req);
    // data.REFlOGID = ''
    // data.ROLE = req.session.userinfo.ROLECODE
    // data.err_code = { dir: 3003, type: 2001 }
    // data.err_msg = { dir: 3003, type: 2001 }
    // console.log('data',data)
    let obj = {
      funckey: "FOPKS_CF.PRC_CHANGE_INFO",
      bindvar: data
    };
    processingserver.callAPI(obj, function (err, rs) {
      // console.log('res', rs)
      //get text của mã lỗi
      ErrDefs.find({ ERRNUM: res.EC }).exec((err, errdefs) => {
        if (err) {
          rs.EM = "Lỗi thực hiện trên redis";
          return res.send(rs);
        }
        rs.EM = errdefs.ERRDESC;
        return res.send(rs);
      });
    });
  },
  /*giang.ngo dong tai khoan */
  closeAccount: function (req, res) {
    try {
      let data = req.body;
      data = RestfulHandler.addSessionInfo(data, req);
      data.REFLOGID = "";
      let obj = {
        funckey: "FOPKS_CF.PRC_CLOSE_ACCTNO",
        bindvar: data
      };
      processingserver.callAPI(obj, async function (err, rs) {
        if (err) {
          sails.log.error(err);
          return res.send(Ioutput.errServer(err));
        }
        return res.send(rs);
      });
    } catch (error) {
      sails.log.error(error);
      return res.send(Ioutput.errServer(error));
    }
  },

  //giang.ngo: gen so hieu tkgd
  autoGenCustodycd: function (req, res) {
    try {
      let data = req.body;
      data = RestfulHandler.addSessionInfo(data, req);
      data.ret = { dir: 3003, type: 2001 };
      data.REFLOGID = "";
      let obj = {
        funckey: "FOPKS_CF.FN_GET_CUSTODYCD",
        bindvar: data
      };
      processingserver.callAPIWithUrl("front/execFunc", obj, async function (
        err,
        rs
      ) {
        if (err) {
          sails.log.error(err);
          return res.send(Ioutput.errServer(err));
        }
        return res.send(rs);
      });
    } catch (error) {
      sails.log.error(error);
      return res.send(Ioutput.errServer(error));
    }
  },
  getCfmastOTP: function (req, res) {
    try {
      let pv_tlid = sails.config.USERONL;
      let pv_rolecode = "";
      let pv_tlname = "";
      try {
        let { TLID, ROLECODE, USERID } = req.session.userinfo;
        pv_tlid = TLID;
        pv_rolecode = ROLECODE;
        pv_tlname = USERID;
      } catch (error) { }

      let { language, custid } = req.body;
      let rest = {
        p_refcursor: { dir: 3003, type: 2004 },
        p_custid: "ALL",
        p_tlid: pv_tlid,
        p_tlname: pv_tlname,
        p_role: pv_rolecode,
        p_language: language
      };
      let obj = {
        funckey: "prc_get_cfmast_otp",
        bindvar: rest
      };
      processingserver.callAPI(obj, async function (err, rs) {
        if (err) {
          return res.send(Utils.removeException(err));
        }
        try {
          if (rs.EC == 0) {
            var result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
            let dataAll = result;
            let pv_sumRecord = result.length;
            //phan trang
            let { pagesize, page, keySearch } = req.body;
            if (keySearch)
              if (keySearch.length > 0)
                result = await Paging.find(result, keySearch);
            let numOfPages = Math.ceil(result.length / pagesize);
            result = await Paging.paginate(result, pagesize, page ? page : 1);
            delete rs.DT["p_refcursor"];
            var DT = {
              data: result,
              numOfPages: numOfPages,
              sumRecord: pv_sumRecord,
              dataAll
            };
            return res.send(Ioutput.success(DT));
          } else {
            return res.send(rs);
          }
        } catch (error) {
          rs.EM = "Lỗi client gọi api";
          rs.EC = -1000;
          return res.send(rs);
        }
      });
    } catch (error) {
      sails.log.error(error);
      return res.send(Ioutput.errServer(error));
    }
  },
  get_account_openotp: function (req, res) {
    try {
      let pv_tlid = sails.config.USERONL;
      let pv_role = "";
      try {
        let { TLID, ROLECODE } = req.session.userinfo;
        pv_tlid = TLID;
        pv_role = ROLECODE;
      } catch (error) { }
      let data = req.body;

      let rest = {
        p_refcursor: { dir: 3003, type: 2004 },
        p_custodycd: data.CUSTODYCD,
        p_tlid: pv_tlid,
        p_role: pv_role,
        p_language: data.LANG
      };

      let obj = {
        funckey: "prc_get_account_openotp",
        bindvar: rest
      };
      processingserver.callAPI(obj, async function (err, rs) {
        if (err) {
          return res.send(Utils.removeException(err));
        }
        try {
          var result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          delete rs.DT["p_refcursor"];
          return res.send(result);
        } catch (error) {
          rs.EM = "Lỗi client gọi api";
          rs.EC = -1000;
          return res.send(rs);
        }
      });
    } catch (error) {
      sails.log.error(error);
      return res.send(Ioutput.errServer(error));
    }
  },
  activeOPT: async function (req, res) {
    try {
      let pv_tlid = sails.config.USERONL;
      let pv_role = "";
      let pv_userid = "";
      try {
        let { TLID, ROLECODE, ISCUSTOMER, USERID } = req.session.userinfo;
        pv_tlid = TLID;
        pv_role = ROLECODE;
        pv_iscustomer = ISCUSTOMER;
        pv_userid = USERID ? USERID : "";
      } catch (error) {
        pv_isauth = false;
      }
      let data = req.body;
      if (data)
        if (data.OBJNAME == "CREATEACCOUNT" || data.OBJNAME == "CUSTACTIVEOTP")
          data.OBJNAME = sails.config.OBJNAMEDEFAULT;
      let rest = {
        p_newcustodycd: data.newCUSTODYCD,
        p_fullname: data.FULLNAME,
        p_idcode: data.IDCODE,
        p_otpcode: data.OTPCODE,
        p_desc: "",
        p_action: data.OTPTYPE == "EDITCF" ? "EDIT" : "ADD",
        p_tlid: pv_tlid,
        p_role: pv_role,
        p_userid: pv_userid,
        p_language: data.LANG,
        pv_objname: data.OBJNAME,
        p_keyotp: data.KEYOTP
      };

      let obj = {
        funckey: "prc_cfmast_active_otp",
        bindvar: rest
      };
      sails.log('truoc khi goi process');
      processingserver.callAPI(obj, async function (err, rs) {
        if (err) {
          return res.send(Utils.removeException(err));
        }
        try {
          rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, data.LANG);
          return res.send(rs);
        } catch (error) {
          rs.EM = "Lỗi client gọi api";
          rs.EC = -1000;
          return res.send(rs);
        }
      });
    } catch (error) {
      sails.log.error(error);
      return res.send(Ioutput.errServer(error));
    }
  },
  getCaptcha: function (req, res) {
    try {
      var captcha = svgCaptcha.create({ noise: 0 });
      req.session.captcha = captcha.text;
      return res.send(captcha.data);
    } catch (error) {
      sails.log.error(error);
      return res.send(Ioutput.errServer(error));
    }
  },

  validateCaptCha: function (req, res) {
    try {
      let data = req.body;
      let ISADMIN =
        (req.session
          && req.session.userinfo
          && req.session.userinfo.TLID
          && req.session.userinfo.TLID != '686868'
        ) ? true : false;

      // admin thi ko can check captcha
      if (!ISADMIN) {
        if (data.captcha !== req.session.captcha) {
          return res.send({ EM: "Captcha Invalid", EC: -7776 });
        }
      }
      return res.send({ EM: "OK", EC: 0 });
    } catch (error) {
      sails.log.error(error);
      return res.send(Ioutput.errServer(error));
    }
  },
  getCfmastInfo: async function (req, res) {
    try {
      let pv_tlid = sails.config.USERONL;
      let pv_role = "";
      try {
        let { TLID, ROLECODE } = req.session.userinfo;
        pv_tlid = TLID;
        pv_role = ROLECODE;
      } catch (error) { }
      let data = req.body;
      let { language, custodycd } = data;
      let rest = {
        p_refcursor: { dir: 3003, type: 2004 },
        p_cfauth: { dir: 3003, type: 2004 },
        p_cfcontact: { dir: 3003, type: 2004 },
        p_fatca: { dir: 3003, type: 2004 },
        p_custodycd: custodycd,
        p_tlid: pv_tlid,
        p_role: pv_role,
        p_language: language
      };
      let obj = {
        funckey: "prc_get_cfmast",
        bindvar: rest
      };
      processingserver.callAPI(obj, function (err, rs) {
        if (err) {
          return res.send(Utils.removeException(err));
        }
        try {
          if (rs.EC == 0) {
            var result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
            delete rs.DT["p_refcursor"];
            rs.DT.dataMain = result[0];
            if (rs.DT.dataMain) {
              rs.DT.dataMain["ISONLINE"] = rs.DT.dataMain["ISONLINE"] == "Y";
              rs.DT.dataMain["ISCONTACT"] = rs.DT.dataMain["ISCONTACT"] == "Y";
              rs.DT.dataMain["ISFATCA"] = rs.DT.dataMain["ISFATCA"] == "Y";
              //rs.DT.dataMain["ISAUTH"] = rs.DT.dataMain["ISAUTH"] == "Y";
              rs.DT.dataMain["RCV_EMAIL"] = rs.DT.dataMain["RCV_EMAIL"] == "Y";
              rs.DT.dataMain["RCV_MAIL"] = rs.DT.dataMain["RCV_MAIL"] == "Y";
              rs.DT.dataMain["RCV_SMS"] = rs.DT.dataMain["RCV_SMS"] == "Y";
            }

            var result1 = ConvertData.convert_to_Object(rs.DT.p_cfauth);
            delete rs.DT["p_cfauth"];
            rs.DT.dataAuth = result1[0];
            // if (rs.DT.dataAuth) {
            //   rs.DT.dataAuth["AUTH_ALL"] = rs.DT.dataAuth["AUTH_ALL"] == "Y";
            //   rs.DT.dataAuth["AUTH_ORDER"] =
            //     rs.DT.dataAuth["AUTH_ORDER"] == "Y";
            //   rs.DT.dataAuth["AUTH_CASH"] = rs.DT.dataAuth["AUTH_CASH"] == "Y";
            //   rs.DT.dataAuth["AUTH_INFOR"] =
            //     rs.DT.dataAuth["AUTH_INFOR"] == "Y";
            // }

            var result2 = ConvertData.convert_to_Object(rs.DT.p_cfcontact);
            delete rs.DT["p_cfcontact"];
            rs.DT.dataContact = result2[0];
            var result3 = ConvertData.convert_to_Object(rs.DT.p_fatca);
            delete rs.DT["p_fatca"];
            rs.DT.dataFatca = result3[0];
            req.session.CfmastInfo = rs.DT;
            return res.send(rs);
          } else {
            return res.send(rs);
          }
        } catch (error) {
          rs.EM = "Lỗi client gọi api";
          rs.EC = -1000;
          return res.send(rs);
        }
      });
    } catch (error) {
      sails.log.error(error);
      return res.send(Ioutput.errServer(error));
    }
  },

  /*lay care by theo tlid */
  getCareby4Tlid: function (req, res) {
    try {
      let pv_tlid = sails.config.USERONL;
      let pv_rolecode = "";
      try {
        let { TLID, ROLECODE } = req.session.userinfo;
        pv_tlid = TLID;
        pv_rolecode = ROLECODE;
      } catch (error) { }

      let { language } = req.body;
      let rest = {
        p_refcursor: { dir: 3003, type: 2004 },
        p_tlid: pv_tlid,
        p_role: pv_rolecode,
        p_language: language
      };
      let obj = {
        funckey: "prc_get_careby4tlid",
        bindvar: rest
      };
      processingserver.callAPI(obj, function (err, rs) {
        if (err) {
          return res.send(Utils.removeException(err));
        }
        try {
          if (rs.EC == 0) {
            let result,
              resultdata = ConvertData.convert_to_Object(rs.DT.p_refcursor);
            result = resultdata.map(item => {
              return {
                value: item.GRPID,
                label: item.GRPNAME
              };
            });
            return res.send(result);
          } else {
            return res.send(rs);
          }
        } catch (error) {
          rs.EM = "Lỗi client gọi api";
          rs.EC = -1000;
          return res.send(rs);
        }
      });
    } catch (error) {
      sails.log.error(error);
      return res.send(Ioutput.errServer(error));
    }
  },
  getinvesttime: function (req, res) {
    try {
      let pv_tlid = sails.config.USERONL;
      let pv_rolecode = "";
      try {
        let { TLID, ROLECODE } = req.session.userinfo;
        pv_tlid = TLID;
        pv_rolecode = ROLECODE;
      } catch (error) { }

      let { language } = req.body;
      let rest = {
        p_refcursor: { dir: 3003, type: 2004 },
        p_tlid: pv_tlid,
        p_role: pv_rolecode,
        p_language: language
      };
      let obj = {
        funckey: "prc_get_investtime",
        bindvar: rest
      };
      processingserver.callAPI(obj, function (err, rs) {
        if (err) {
          return res.send(Utils.removeException(err));
        }
        try {
          if (rs.EC == 0) {
            let result,
              resultdata = ConvertData.convert_to_Object(rs.DT.p_refcursor);
            result = resultdata.map(item => {
              return {
                value: item.VALUE,
                label: item.LABEL
              };
            });
            return res.send(result);
          } else {
            return res.send(rs);
          }
        } catch (error) {
          rs.EM = "Lỗi client gọi api";
          rs.EC = -1000;
          return res.send(rs);
        }
      });
    } catch (error) {
      sails.log.error(error);
      return res.send(Ioutput.errServer(error));
    }
  },
  getexperience: function (req, res) {
    try {
      let pv_tlid = sails.config.USERONL;
      let pv_rolecode = "";
      try {
        let { TLID, ROLECODE } = req.session.userinfo;
        pv_tlid = TLID;
        pv_rolecode = ROLECODE;
      } catch (error) { }

      let { language } = req.body;
      let rest = {
        p_refcursor: { dir: 3003, type: 2004 },
        p_tlid: pv_tlid,
        p_role: pv_rolecode,
        p_language: language
      };
      let obj = {
        funckey: "prc_get_experience",
        bindvar: rest
      };
      processingserver.callAPI(obj, function (err, rs) {
        if (err) {
          return res.send(Utils.removeException(err));
        }
        try {
          if (rs.EC == 0) {
            let result,
              resultdata = ConvertData.convert_to_Object(rs.DT.p_refcursor);
            result = resultdata.map(item => {
              return {
                value: item.VALUE,
                label: item.LABEL
              };
            });
            return res.send(result);
          } else {
            return res.send(rs);
          }
        } catch (error) {
          rs.EM = "Lỗi client gọi api";
          rs.EC = -1000;
          return res.send(rs);
        }
      });
    } catch (error) {
      sails.log.error(error);
      return res.send(Ioutput.errServer(error));
    }
  },
  getruiro: function (req, res) {
    try {
      let pv_tlid = sails.config.USERONL;
      let pv_rolecode = "";
      try {
        let { TLID, ROLECODE } = req.session.userinfo;
        pv_tlid = TLID;
        pv_rolecode = ROLECODE;
      } catch (error) { }

      let { language } = req.body;
      let rest = {
        p_refcursor: { dir: 3003, type: 2004 },
        p_tlid: pv_tlid,
        p_role: pv_rolecode,
        p_language: language
      };
      let obj = {
        funckey: "prc_get_ruiro",
        bindvar: rest
      };
      processingserver.callAPI(obj, function (err, rs) {
        if (err) {
          return res.send(Utils.removeException(err));
        }
        try {
          if (rs.EC == 0) {
            let result,
              resultdata = ConvertData.convert_to_Object(rs.DT.p_refcursor);
            result = resultdata.map(item => {
              return {
                value: item.VALUE,
                label: item.LABEL
              };
            });
            return res.send(result);
          } else {
            return res.send(rs);
          }
        } catch (error) {
          rs.EM = "Lỗi client gọi api";
          rs.EC = -1000;
          return res.send(rs);
        }
      });
    } catch (error) {
      sails.log.error(error);
      return res.send(Ioutput.errServer(error));
    }
  },
  getjob: function (req, res) {
    try {
      let pv_tlid = sails.config.USERONL;
      let pv_rolecode = "";
      try {
        let { TLID, ROLECODE } = req.session.userinfo;
        pv_tlid = TLID;
        pv_rolecode = ROLECODE;
      } catch (error) { }

      let { language } = req.body;
      let rest = {
        p_refcursor: { dir: 3003, type: 2004 },
        p_tlid: pv_tlid,
        p_role: pv_rolecode,
        p_language: language
      };
      let obj = {
        funckey: "prc_get_job",
        bindvar: rest
      };
      processingserver.callAPI(obj, function (err, rs) {
        if (err) {
          return res.send(Utils.removeException(err));
        }
        try {
          if (rs.EC == 0) {
            let result,
              resultdata = ConvertData.convert_to_Object(rs.DT.p_refcursor);
            result = resultdata.map(item => {
              return {
                value: item.VALUE,
                label: item.LABEL
              };
            });
            return res.send(result);
          } else {
            return res.send(rs);
          }
        } catch (error) {
          rs.EM = "Lỗi client gọi api";
          rs.EC = -1000;
          return res.send(rs);
        }
      });
    } catch (error) {
      sails.log.error(error);
      return res.send(Ioutput.errServer(error));
    }
  },
  cancelGeneralInfo: function (req, res) {
    try {
      let { TLID, ROLECODE } = req.session.userinfo;
      let data = req.body;
      let rest = {
        p_custid: data.CUSTID,
        p_custodycd: data.CUSTODYCD,
        p_cfmast: "",
        p_sign_img: "",
        p_ownlicense_img: "",
        p_ownlicense2_img: "",
        p_ownlicense3_img: "",
        p_ownlicense4_img: "",
        p_cfauth: "",
        p_idscan: "",
        p_idscan2: "",
        p_authscan: "",
        p_cfcontact: "",
        p_fatca: "",
        p_isotp: "Y",
        pv_tlid: TLID,
        pv_role: ROLECODE,
        pv_action: "DELETE",
        pv_language: data.language,
        pv_objname: data.OBJNAME,
        pv_presenter_email: data.pv_presenter_email ? data.pv_presenter_email : '',
        p_err_field: { dir: 3003, type: 2001 }
      };
      let obj = {
        funckey: "prc_mt_cfmast",
        bindvar: rest
      };
      processingserver.callAPI(obj, async function (err, rs) {
        if (err) {
          return res.send(Utils.removeException(err));
        }
        try {
          rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, data.language);
          return res.send(rs);
        } catch (error) {
          rs.EM = "Lỗi client gọi api";
          rs.EC = -1000;
          return res.send(rs);
        }
      });
    } catch (error) {
      sails.log.error(error);
      return res.send(Ioutput.errServer(error));
    }
  },

  getsalebycustodycd: async function (req, res) {
    let pv_tlid = ''
    let pv_role = ''
    try {
      let { TLID, ROLECODE } = req.session.userinfo;
      pv_tlid = TLID;
      pv_role = ROLECODE;
    } catch (error) {
      let rs = {}
      rs.EM = 'Lỗi lấy thông tin userinfo';
      rs.EC = -1001;
      return res.send(rs)
    }
    let data = req.body;
    sails.log('req.body:::', req.body)
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_custodycd: data.p_custodycd,
      p_tlid: pv_tlid,
      p_role: pv_role,
      p_language: data.language
    }
    sails.log("-----get prc_get_saleinfo_by_custodycd-------", rest)
    let obj =
    {
      "funckey": "prc_get_saleinfo_by_custodycd",
      bindvar: rest
    }
    processingserver.callAPI(obj, async function (err, rs) {

      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        // console.log(".......rs.", rs)

        if (rs.EC == 0) {

          let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          //phan trang

          var DT = { data: result, EC: '0' }


          return res.send(DT);

        } else {
          return res.send(rs);
        }
      } catch (error) {
        rs.EM = 'Lỗi client gọi api';
        rs.EC = -1000;
        return res.send(rs)
      }
    });
  },
  finishGeneralInfo: async function (req, res) {
    try {
      var data = req.body;
      let language = data.language
      let CfmastInfo = req.session.CfmastInfo;
      let pv_tlid = sails.config.USERONL;
      let pv_role = "";

      try {
        let { TLID, ROLECODE, ISCUSTOMER } = req.session.userinfo;
        // console.log('-----------------------req.session.userinfo', req.session.userinfo);

        pv_tlid = TLID;
        pv_role = ROLECODE;
        pv_iscustomer = ISCUSTOMER;
      } catch (error) {
        pv_isauth = false;
      }
      delete data["SIGN_IMG"];
      delete data["OWNLICENSE_IMG"];
      delete data["OWNLICENSE2_IMG"];
      delete data["OWNLICENSE3_IMG"];
      delete data["OWNLICENSE4_IMG"];
      delete data["RCV_SMS"];
      delete data["RCV_MAIL"];
      delete data["RCV_EMAIL"];
      delete data.GeneralInfoMain["SIGN_IMG"];
      delete data.GeneralInfoMain["OWNLICENSE_IMG"];
      delete data.GeneralInfoMain["OWNLICENSE2_IMG"];
      delete data.GeneralInfoMain["OWNLICENSE3_IMG"];
      delete data.GeneralInfoMain["OWNLICENSE4_IMG"];
      delete data.GeneralInfoMain["RCV_SMS"];
      delete data.GeneralInfoMain["RCV_MAIL"];
      delete data.GeneralInfoMain["RCV_EMAIL"];

      delete req.session.captcha;

      let GeneralInfoMain = data.GeneralInfoMain;
      sails.log('GeneralInfoMain on finish:', data.GeneralInfoMain)
      GeneralInfoMain.SALEID = GeneralInfoMain.SALEID != '' && GeneralInfoMain.SALEID != undefined ? GeneralInfoMain.SALEID : '';

      GeneralInfoMain.BIRTHDATE = GeneralInfoMain.CUSTTYPE == 'CN' ? GeneralInfoMain.BIRTHDATE : "01/01/0001";
      GeneralInfoMain.PASSPORTDATE = GeneralInfoMain.COUNTRY == '234' ? '01/01/0001' : GeneralInfoMain.PASSPORTDATE == null ? '01/01/0001' : GeneralInfoMain.PASSPORTDATE;
      if (data)
        if (data.OBJNAME == "CREATEACCOUNT")
          data.OBJNAME = sails.config.OBJNAMEDEFAULT;
      let isIdenticalMain = (isIdenticalAuth = isIdenticalContact = isIdenticalFatca = false);
      //tab1
      delete GeneralInfoMain["language"];
      delete GeneralInfoMain["access"];
      //kiem tra thong tin moi va cu co # nhau ko
      if (CfmastInfo)
        isIdenticalMain =
          JSON.stringify(CfmastInfo.dataMain) ===
          JSON.stringify(GeneralInfoMain);
      // let v_SIGN_IMG = GeneralInfoMain.SIGN_IMG;
      // let v_OWNLICENSE_IMG = GeneralInfoMain.OWNLICENSE_IMG;
      // let v_OWNLICENSE2_IMG = GeneralInfoMain.OWNLICENSE2_IMG;
      // let v_OWNLICENSE3_IMG = GeneralInfoMain.OWNLICENSE3_IMG;
      // let v_OWNLICENSE4_IMG = GeneralInfoMain.OWNLICENSE4_IMG;
      GeneralInfoMain.ISAUTH = GeneralInfoMain.ISAUTH == 'Y' ? "Y" : "N";
      GeneralInfoMain.ISONLINE = GeneralInfoMain.ISONLINE == 'Y' ? "Y" : "N";
      GeneralInfoMain.ISCONTACT = GeneralInfoMain.ISCONTACT == 'Y' ? "Y" : "N";
      GeneralInfoMain.ISFATCA = GeneralInfoMain.ISFATCA == 'Y' ? "Y" : "N";
      GeneralInfoMain.ISAGREESHARE = GeneralInfoMain.ISAGREESHARE == true || GeneralInfoMain.ISAGREESHARE == 'Y' ? "Y" : "N";
      //console.log(' ******* -----GeneralInfoMain.ISFATCA',GeneralInfoMain.ISFATCA)
      //console.log(' ******* -----GeneralInfoMain.ISAUTH',GeneralInfoMain.ISAUTH)

      // GeneralInfoMain.RCV_SMS = GeneralInfoMain.RCV_SMS ? "Y" : "N";
      // GeneralInfoMain.RCV_MAIL = GeneralInfoMain.RCV_MAIL ? "Y" : "N";
      // GeneralInfoMain.RCV_EMAIL = GeneralInfoMain.RCV_EMAIL ? "Y" : "N";
      delete GeneralInfoMain["SIGN_IMG"];
      delete GeneralInfoMain["OWNLICENSE_IMG"];
      delete GeneralInfoMain["OWNLICENSE2_IMG"];
      delete GeneralInfoMain["OWNLICENSE3_IMG"];
      delete GeneralInfoMain["OWNLICENSE4_IMG"];
      delete GeneralInfoMain["RCV_SMS"];
      delete GeneralInfoMain["RCV_MAIL"];
      delete GeneralInfoMain["RCV_EMAIL"];
      delete GeneralInfoMain["ISAGREE"];

      sails.log('GeneralInfoMain truoc khi parse thanh message:', GeneralInfoMain)
      let v_strinputGeneralInfoMain = buildStrinput(
        commonUtil.convertPropsNullToEmpty(GeneralInfoMain)
      );
      //tab2
      let GeneralInfoAuth = data.GeneralInfoAuth;
      GeneralInfoAuth.AUTH_ALL = GeneralInfoAuth.AUTH_ALL == true || GeneralInfoAuth.AUTH_ALL == 'Y' ? "Y" : "N";
      GeneralInfoAuth.AUTH_ORDER = GeneralInfoAuth.AUTH_ORDER == true || GeneralInfoAuth.AUTH_ORDER == 'Y' ? "Y" : "N";
      GeneralInfoAuth.AUTH_CASH = GeneralInfoAuth.AUTH_CASH == true || GeneralInfoAuth.AUTH_CASH == 'Y' ? "Y" : "N";
      GeneralInfoAuth.AUTH_INFOR = GeneralInfoAuth.AUTH_INFOR == true || GeneralInfoAuth.AUTH_INFOR == 'Y' ? "Y" : "N";
      GeneralInfoAuth.AUTH_SEND = GeneralInfoAuth.AUTH_SEND == true || GeneralInfoAuth.AUTH_SEND == 'Y' ? "Y" : "N";

      let v_IDSCAN = "";
      let v_IDSCAN2 = "";
      let v_AUTHSCAN = "";
      let v_strinputGeneralInfoAuth = "";
      if (GeneralInfoAuth) {
        delete GeneralInfoAuth["language"];
        delete GeneralInfoAuth["access"];
        //kiem tra thong tin moi va cu co # nhau ko
        if (CfmastInfo)
          isIdenticalAuth =
            JSON.stringify(CfmastInfo.dataAuth) ===
            JSON.stringify(GeneralInfoAuth);
        v_IDSCAN = GeneralInfoAuth.IDSCAN;
        v_IDSCAN2 = GeneralInfoAuth.IDSCAN2;
        v_AUTHSCAN = GeneralInfoAuth.AUTHSCAN;
        delete GeneralInfoAuth["IDSCAN"];
        delete GeneralInfoAuth["IDSCAN2"];
        delete GeneralInfoAuth["AUTHSCAN"];
        if (GeneralInfoMain.ISAUTH == "N") {
          GeneralInfoAuth.AUTH_ALL = "";
          GeneralInfoAuth.AUTH_ORDER = "";
          GeneralInfoAuth.AUTH_CASH = "";
          GeneralInfoAuth.AUTH_INFOR = "";
          GeneralInfoAuth.AUTH_SEND = "";
        }

        v_strinputGeneralInfoAuth = buildStrinput(
          commonUtil.convertPropsNullToEmpty(GeneralInfoAuth)
        );
      }
      //tab3
      let GeneralInfoContact = data.GeneralInfoContact;
      let v_strinputGeneralInfoContact = "";
      if (GeneralInfoContact) {
        delete GeneralInfoContact["language"];
        delete GeneralInfoContact["access"];
        if (CfmastInfo)
          isIdenticalContact =
            JSON.stringify(CfmastInfo.dataContact) ===
            JSON.stringify(GeneralInfoContact);
        v_strinputGeneralInfoContact = buildStrinput(
          commonUtil.convertPropsNullToEmpty(GeneralInfoContact)
        );
      }
      //tab4
      let GeneralInfoFatca = data.GeneralInfoFatca;

      if (GeneralInfoMain.ISFATCA == "N") {
        GeneralInfoFatca.ISUSCITIZEN = "";
        GeneralInfoFatca.ISUSPLACEOFBIRTH = "";
        GeneralInfoFatca.ISUSMAIL = "";
        GeneralInfoFatca.ISUSPHONE = "";
        GeneralInfoFatca.ISUSTRANFER = "";
        GeneralInfoFatca.ISAUTHRIGH = "";
        GeneralInfoFatca.ISSOLEADDRESS = "";
        GeneralInfoFatca.ISDISAGREE = "";
        GeneralInfoFatca.ISOPPOSITION = "";
        GeneralInfoFatca.ISUSSIGN = "";
        GeneralInfoFatca.ISUS = "";
      }

      let v_strinputGeneralInfoFatca = "";
      if (GeneralInfoFatca) {
        delete GeneralInfoFatca["language"];
        delete GeneralInfoFatca["access"];
        if (CfmastInfo)
          isIdenticalFatca =
            JSON.stringify(CfmastInfo.dataFatca) ===
            JSON.stringify(GeneralInfoFatca);
        v_strinputGeneralInfoFatca = buildStrinput(
          commonUtil.convertPropsNullToEmpty(GeneralInfoFatca)
        );
      }
      if (isIdenticalMain && isIdenticalAuth && isIdenticalContact && isIdenticalFatca) {
        return res.send({
          EM: "Thông tin mới phải khác thông tin cũ",
          EC: -7777
        });
      } else {
        delete req.session.CfmastInfo
      }
      let rest = {
        p_custid:
          data.access == "add"
            ? { dir: 3003, type: 2001 }
            : GeneralInfoMain["CUSTID"],
        p_custodycd:
          data.access == "add"
            ? { dir: 3003, type: 2001 }
            : GeneralInfoMain["CUSTODYCD"],
        p_cfmast: v_strinputGeneralInfoMain,
        // p_sign_img: v_SIGN_IMG,
        // p_ownlicense_img: v_OWNLICENSE_IMG,
        // p_ownlicense2_img: v_OWNLICENSE2_IMG,
        // p_ownlicense3_img: v_OWNLICENSE3_IMG,
        // p_ownlicense4_img: v_OWNLICENSE4_IMG,
        p_cfauth: v_strinputGeneralInfoAuth,
        p_idscan: v_IDSCAN,
        p_idscan2: v_IDSCAN2,
        p_authscan: v_AUTHSCAN,
        p_cfcontact: v_strinputGeneralInfoContact,
        p_fatca: v_strinputGeneralInfoFatca,
        //p_isotp: (data.OBJNAME == "CREATEACCOUNT" || ISADMIN) ? "N" : "Y", //doi voi admin va tao tk moi thi ko check otp
        p_isotp: "Y",
        pv_tlid: pv_tlid,
        pv_role: pv_role,
        pv_action: data.access == "add" ? "ADD" : "EDIT",
        pv_language: data.language,
        pv_objname: data.OBJNAME,
        pv_presenter_email: data.PRESENTER_EMAIL ? data.PRESENTER_EMAIL : '',
        p_err_field: { dir: 3003, type: 2001 }
      };
      let obj = {
        funckey: "prc_mt_cfmast",
        bindvar: rest
      };
      processingserver.callAPI(obj, async function (err, rs) {
        if (err) {
          return res.send(Utils.removeException(err));
        }
        try {
          if (rs.EC == 0) {
            rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
            return res.send(rs);
          } else {
            rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
            return res.send(rs);
          }
        } catch (error) {
          rs.EM = "Lỗi client gọi api";
          rs.EC = -1000;
          return res.send(rs);
        }
      });
    } catch (error) {
      sails.log.error(error);
      return res.send(Ioutput.errServer(error));
    }
  },
  // lay ds ctv
  getctv: function (req, res) {
    let data = req.body;
    let { TLID } = req.session.userinfo;
    //console.log('req.session.userinfo',req.session.userinfo)
    if (data)
      if (data.OBJNAME == "CREATEACCOUNT") {
        data.OBJNAME = sails.config.OBJNAMEDEFAULT
        TLID = ''
      }
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_action: data.action,
      p_custodycd: 'ALL',
      p_tlid: TLID,
      p_language: data.language,
      pv_objname: data.OBJNAME
    };
    let obj = {
      funckey: "prc_get_saleforcfmast",
      bindvar: rest
    };
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        if (rs.EC == 0) {
          let result,
            resultdata = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          //console.log('check kq: ', resultdata)
          result = resultdata.map(item => {
            return {
              value: item.TLID,
              label: item.TLNAME
            };
          });
          //console.log('result loai hinh tach value', result)
          return res.send({ resultdata, result });
        } else {
          return res.send(rs);
        }
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  checkGeneralInfoMain: function (req, res) {
    try {
      let pv_tlid = sails.config.USERONL;
      let pv_role = "";
      try {
        let { TLID, ROLECODE } = req.session.userinfo;
        pv_tlid = TLID;
        pv_role = ROLECODE;
      } catch (error) { }
      let data = req.body;

      console.log('haryphamaa check object', data);

      let access = data.access;

      let language = data.language;
      data.ISAUTH = data.ISAUTH ? "Y" : "N";
      data.ISONLINE = data.ISONLINE ? "Y" : "N";
      data.ISCONTACT = data.ISCONTACT ? "Y" : "N";
      data.ISFATCA = data.ISFATCA ? "Y" : "N";
      delete data["SIGN_IMG"];
      delete data["OWNLICENSE_IMG"];
      delete data["OWNLICENSE2_IMG"];
      delete data["OWNLICENSE3_IMG"];
      delete data["OWNLICENSE4_IMG"];
      delete data["RCV_SMS"];
      delete data["RCV_MAIL"];
      delete data["RCV_EMAIL"];
      delete data["ISAGREE"];
      delete data["language"];
      delete data["access"];

      let v_strinput = buildStrinput(data);
      let rest = {
        p_strinput: v_strinput,
        pv_tlid: pv_tlid,
        pv_role: pv_role,
        pv_action: access == "add" ? "ADD" : "EDIT",
        pv_language: language,
        p_err_field: { dir: 3003, type: 2001 }
      };
      let obj = {
        funckey: "prc_mt_cfmast_check",
        bindvar: rest
      };



      processingserver.callAPI(obj, async function (err, rs) {
        if (err) {
          return res.send(Utils.removeException(err));
        }
        try {
          rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
          return res.send(rs);
        } catch (error) {
          rs.EM = "Lỗi client gọi api";
          rs.EC = -1000;
          return res.send(rs);
        }
      });
    } catch (error) {
      sails.log.error(error);
      return res.send(Ioutput.errServer(error));
    }
  },

  checkGeneralInfoAuth: function (req, res) {
    try {
      let pv_tlid = sails.config.USERONL;
      let pv_role = "";
      try {
        let { TLID, ROLECODE } = req.session.userinfo;
        pv_tlid = TLID;
        pv_role = ROLECODE;
      } catch (error) { }
      let data = req.body;

      let access = data.access;
      let v_IDSCAN = data.IDSCAN;
      let v_IDSCAN2 = data.IDSCAN2;
      let v_AUTHSCAN = data.AUTHSCAN;
      let language = data.language;
      sails.log('data.AUTH_ALL:', data.AUTH_ALL)
      data.AUTH_ALL = data.AUTH_ALL == true || data.AUTH_ALL == 'Y' ? 'Y' : 'N';
      data.AUTH_ORDER = data.AUTH_ORDER == true || data.AUTH_ORDER == 'Y' ? 'Y' : 'N';
      data.AUTH_CASH = data.AUTH_CASH == true || data.AUTH_CASH == 'Y' ? 'Y' : 'N';
      data.AUTH_INFOR = data.AUTH_INFOR == true || data.AUTH_INFOR == 'Y' ? 'Y' : 'N';
      data.AUTH_SEND = data.AUTH_SEND == true || data.AUTH_SEND == 'Y' ? 'Y' : 'N';


      sails.log('data', data)
      delete data["IDSCAN"];
      delete data["IDSCAN2"];
      delete data["AUTHSCAN"];
      delete data["language"];
      delete data["access"];
      let v_strinput = buildStrinput(data);
      let rest = {
        p_strinput: v_strinput,
        p_idscan: v_IDSCAN,
        p_idscan2: v_IDSCAN2,
        p_authscan: v_AUTHSCAN,
        pv_tlid: pv_tlid,
        pv_role: pv_role,
        pv_action: access == "add" ? "ADD" : "EDIT",
        pv_language: language,
        p_err_field: { dir: 3003, type: 2001 }
      };
      sails.log('checkkkkkkk', rest)
      let obj = {
        funckey: "prc_mt_cfauth_check",
        bindvar: rest
      };
      processingserver.callAPI(obj, function (err, rs) {
        // console.log('checj rs tra ve ',rs)
        if (err) {
          return res.send(Utils.removeException(err));
        }
        try {
          if (rs.EC == 0) {
            return res.send(rs);
          } else {
            return res.send(rs);
          }
        } catch (error) {
          rs.EM = "Lỗi client gọi api";
          rs.EC = -1000;
          return res.send(rs);
        }
      });
    } catch (error) {
      sails.log.error(error);
      return res.send(Ioutput.errServer(error));
    }
  },
  checkGeneralInfoContact: function (req, res) {
    try {
      let pv_tlid = sails.config.USERONL;
      let pv_role = "";
      try {
        let { TLID, ROLECODE } = req.session.userinfo;
        pv_tlid = TLID;
        pv_role = ROLECODE;
      } catch (error) { }
      let data = req.body;
      let access = data.access;
      let language = data.language;
      delete data["language"];
      delete data["access"];
      let v_strinput = buildStrinput(data);
      let rest = {
        p_strinput: v_strinput,
        pv_tlid: pv_tlid,
        pv_role: pv_role,
        pv_action: access == "add" ? "ADD" : "EDIT",
        pv_language: language,
        p_err_field: { dir: 3003, type: 2001 }
      };

      let obj = {
        funckey: "prc_mt_cfcontact_check",
        bindvar: rest
      };
      processingserver.callAPI(obj, function (err, rs) {
        if (err) {
          return res.send(Utils.removeException(err));
        }
        try {
          if (rs.EC == 0) {
            return res.send(rs);
          } else {
            return res.send(rs);
          }
        } catch (error) {
          rs.EM = "Lỗi client gọi api";
          rs.EC = -1000;
          return res.send(rs);
        }
      });
    } catch (error) {
      sails.log.error(error);
      return res.send(Ioutput.errServer(error));
    }
  },
  checkGeneralInfoFatca: function (req, res) {
    try {
      let pv_tlid = sails.config.USERONL;
      let pv_role = "";
      try {
        let { TLID, ROLECODE } = req.session.userinfo;
        pv_tlid = TLID;
        pv_role = ROLECODE;
      } catch (error) { }
      let data = req.body;
      let access = data.access;
      let language = data.language;
      delete data["language"];
      delete data["access"];
      let v_strinput = buildStrinput(data);
      let rest = {
        p_strinput: v_strinput,
        pv_tlid: pv_tlid,
        pv_role: pv_role,
        pv_action: access == "add" ? "ADD" : "EDIT",
        pv_language: language,
        p_err_field: { dir: 3003, type: 2001 }
      };

      let obj = {
        funckey: "prc_mt_fatca_check",
        bindvar: rest
      };
      processingserver.callAPI(obj, function (err, rs) {
        if (err) {
          return res.send(Utils.removeException(err));
        }
        try {
          if (rs.EC == 0) {
            return res.send(rs);
          } else {
            return res.send(rs);
          }
        } catch (error) {
          rs.EM = "Lỗi client gọi api";
          rs.EC = -1000;
          return res.send(rs);
        }
      });
    } catch (error) {
      sails.log.error(error);
      return res.send(Ioutput.errServer(error));
    }
  },
  getlistaccounttoclose: function (req, res) {
    let data = req.body.data;

    let { TLID, ROLECODE } = req.session.userinfo;
    let rest = {
      p_tlid: TLID,
      p_language: data.p_language,
      p_role: ROLECODE,
      p_custodycd: data.p_custodycd,
      p_refcursor: { dir: 3003, type: 2004 }
    };

    let obj = {
      funckey: "prc_get_accounts_toclose",
      bindvar: rest
    };
    let language = rest.p_language;
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
        delete rs.DT["p_refcursor"];
        rs.DT.data = result;
        rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
        return res.send(rs);
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  req_close_account: function (req, res) {
    let data = req.body;
    data.p_tlid = req.session.userinfo.TLID;
    data.p_role = req.session.userinfo.ROLECODE;

    data.MODELNAME = "req_close_account";
    data.p_refcursor = { dir: 3003, type: 2004 };
    data = commonUtil.convertPropsNullToEmpty(data);
    let obj = { model: data };
    let language = data.p_language;
    processingserver.createmodel(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
        return res.send(rs);
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  getlistaccept_close_account: function (req, res) {
    let data = req.body.data;

    let { TLID, ROLECODE } = req.session.userinfo;
    let rest = {
      p_tlid: TLID,
      p_language: data.p_language,
      p_role: ROLECODE,
      p_custodycd: data.p_custodycd,
      p_refcursor: { dir: 3003, type: 2004 }
    };

    let obj = {
      funckey: "prc_get_close_accounts",
      bindvar: rest
    };
    let language = rest.p_language;
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
        delete rs.DT["p_refcursor"];
        rs.DT.data = result;
        rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);

        return res.send(rs);
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  accept_close_account: function (req, res) {
    let data = req.body;
    data.p_tlid = req.session.userinfo.TLID;
    data.p_role = req.session.userinfo.ROLECODE;
    data.MODELNAME = "accept_close_account";
    data.p_refcursor = { dir: 3003, type: 2004 };
    data = commonUtil.convertPropsNullToEmpty(data);
    let obj = { model: data };
    let language = data.p_language;
    processingserver.createmodel(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
        return res.send(rs);
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  CancelReqCloseAccount: function (req, res) {
    let data = req.body;
    data.p_tlid = req.session.userinfo.TLID;
    data.p_role = req.session.userinfo.ROLECODE;
    data.MODELNAME = "reject_close_account";
    data.p_refcursor = { dir: 3003, type: 2004 };
    data = commonUtil.convertPropsNullToEmpty(data);
    let obj = { model: data };
    let language = data.p_language;
    processingserver.createmodel(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
        return res.send(rs);
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  ImportAcc: async function (req, res) {
    //console.log('call ImportAcc')
    await req.file("AccFile").upload(
      {
        dirname: "Z:/abc.txt"
      },
      function (err, uploadedFiles) {
        if (err) return res.serverError(err);

        return res.json({
          message: uploadedFiles.length + " file(s) uploaded successfully!"
        });
      }
    );

    return res.send("ImportAcc");
  },
  getListChangeInfoCus: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language
    };
    //console.log("get listchange info cus", rest)
    let obj = {
      funckey: "prc_get_change_account_vsd",
      bindvar: rest
    };
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        //console.log(".....", rs)

        if (rs.EC == 0) {
          let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          let resultAll = result;
          let pv_sumRecord = result.length;
          //phan trang
          let { pagesize, page, keySearch, sortSearch } = req.body;

          if (keySearch)
            if (keySearch.length > 0)
              result = await Paging.find(result, keySearch);

          let numOfPages = Math.ceil(result.length / pagesize);

          // search theo tung cot
          if (sortSearch)
            if (sortSearch.length > 0)
              result = await Paging.orderby(result, sortSearch);
          result = await Paging.paginate(result, pagesize, page ? page : 1);
          delete rs.DT["p_refcursor"];
          var DT = {
            data: result,
            numOfPages: numOfPages,
            sumRecord: pv_sumRecord,
            resultAll
          };

          return res.send(Ioutput.success(DT));
        } else {
          return res.send(rs);
        }
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  getChangeAcctVsd: function (req, res) {
    try {
      let datainput = req.body;
      let { TLID, ROLECODE } = req.session.userinfo;
      let data = {
        p_refcursor: { dir: 3003, type: 2004 },
        p_tlid: TLID,
        p_role: ROLECODE,
        p_language: datainput.language
      };
      //console.log('checking ', data)
      let obj = {
        funckey: "prc_get_change_account_vsd",
        bindvar: data
      };
      processingserver.callAPI(obj, async function (err, rs) {
        let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
        rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, datainput.language);
        //console.log('checking rs: ',result)
        return res.send(result);
      });
    } catch (error) {
      rs.EM = "Lỗi client gọi api";
      rs.EC = -1000;
      return res.send(rs);
    }
  },
  processChangeInfoCus: function (req, res) {
    try {
      let datainput = req.body;
      let { TLID, ROLECODE } = req.session.userinfo;
      let data = {
        p_txdate: datainput.txdate,
        p_txnum: datainput.txnum,
        p_custodycd: datainput.custodycd,
        p_old_idcode: datainput.old_idcode,
        p_new_idcode: datainput.new_idcode,
        p_old_iddate: datainput.old_iddate,
        p_new_iddate: datainput.new_iddate,
        p_old_idplace: datainput.old_idplace,
        p_new_idplace: datainput.new_idplace,
        p_old_bankcode: datainput.old_bankcode,
        p_new_bankcode: datainput.new_bankcode,
        p_old_bankacct: datainput.old_bankacct,
        p_new_bankacct: datainput.new_bankacct,
        p_old_citybank: datainput.old_citybank,
        p_new_citybank: datainput.new_citybank,

        p_old_fullname: datainput.old_fullname,
        p_new_fullname: datainput.new_fullname,
        p_old_sex: datainput.old_sex,
        p_new_sex: datainput.new_sex,
        p_old_birthdate: datainput.old_birthdate,
        p_new_birthdate: datainput.new_birthdate,
        p_old_idtype: datainput.old_idtype,
        p_new_idtype: datainput.new_idtype,
        p_old_mobile: datainput.old_mobile,
        p_new_mobile: datainput.new_mobile,
        p_old_email: datainput.old_email,
        p_new_email: datainput.new_email,
        p_old_sonha: datainput.old_sonha,
        p_new_sonha: datainput.new_sonha,
        p_old_phothonxom: datainput.old_phothonxom,
        p_new_phothonxom: datainput.new_phothonxom,
        p_old_phuongxa: datainput.old_phuongxa,
        p_new_phuongxa: datainput.new_phuongxa,
        p_old_thanhpho: datainput.old_thanhpho,
        p_new_thanhpho: datainput.new_thanhpho,
        p_old_address: datainput.old_address,
        p_new_address: datainput.new_address,
        p_desc: datainput.desc,
        p_tlid: TLID,
        p_role: ROLECODE,
        p_language: datainput.language,
        pv_objname: datainput.objname

      };
      let obj = {
        funckey: "prc_change_account_vsd_complete",
        bindvar: data
      };
      processingserver.callAPI(obj, async function (err, rs) {
        rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, datainput.language);
        return res.send(rs);
      });
    } catch (error) {
      rs.EM = "Lỗi client gọi api";
      rs.EC = -1000;
      return res.send(rs);
    }
  },
  gettradingdate: function (req, res) {
    try {
      let obj = {
        funckey: "gettradingdate",
        bindvar: {}
      };
      processingserver.callAPI(obj, function (err, rs) {
        if (err) {
          return res.send(Utils.removeException(err));
        }
        try {
          return res.send(rs);
        } catch (error) {
          rs.EM = "Lỗi client gọi api";
          rs.EC = -1000;
          return res.send(rs);
        }
      });
    } catch (error) {
      sails.log.error(error);
      return res.send(Ioutput.errServer(error));
    }
  },
  checkOldAccount(req, res) {
    try {
      let data = req.body;
      data = {
        pv_idtype: data.idtype,
        pv_idcode: data.idcode
      };
      //console.log('check nhap:', data)
      let obj = {
        funckey: "fn_check_oldaccount",
        bindvar: data
      };
      processingserver.callAPI(obj, function (err, rs) {
        //console.log('check old acc', rs)
        if (err) {
          return res.send(Utils.removeException(err));
        }
        try {
          return res.send(rs);
        } catch (error) {
          rs.EM = "Lỗi client gọi api";
          rs.EC = -1000;
          return res.send(rs);
        }
      });
    } catch (error) {
      sails.log.error(error);
      return res.send(Ioutput.errServer(error));
    }
  },
  // lay loai giay to
  getIdType: async function (req, res) {
    let data = req.body;
    if (data.country == '234') {
      data.grinvestor = 'TN';
    }
    else {
      data.grinvestor = 'NN';
    }
    sails.log('data:', data);
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_action: data.action,
      p_custtype: data.custtype,
      p_grinvestor: data.grinvestor,
      p_language: data.language
    };
    let obj = {
      funckey: "prc_get_idtype",
      bindvar: rest
    };
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        if (rs.EC == 0) {
          let result,
            resultdata = ConvertData.convert_to_Object(rs.DT.p_refcursor);

          result = resultdata.map(item => {
            return {
              value: item.VALUE,
              label: item.DISPLAY
            };
          });
          return res.send({ result });
        } else {
          return res.send(rs);
        }
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  // *+*+*+*+*+*+*+*+*+*+*+* send email *+*+*+*+*+*+*+*+*+*+*+*
  sendEmail: function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    rest = {
      p_emailtype: data.emailtype,
      p_shortcontent: data.shortcontent,
      p_maincontent: data.maincontent,
      p_frdate: data.frdate,
      p_todate: data.todate,
      p_retradingdate: data.retradingdate,
      p_list: data.list,
      pv_action: "ADD",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language,
      pv_objname: data.objname,
      MODELNAME: "sendemail"
    };
    //console.log('data ne sendEmail: ', rest)
    let obj = { model: rest };
    processingserver.createmodel(obj, async function (err, rs) {
      //console.log('rs ne ----- ',rs)

      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, data.language);
        return res.send(rs);
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  getListSendEmail: async function (req, res) {
    let data = req.body.data;
    let { TLID, ROLECODE } = req.session.userinfo;
    //console.log('hehehehehehhe')

    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_autoid: "",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.p_language
    };
    //console.log('getListSendEmail',rest)

    let obj = {
      funckey: "prc_get_sendemail",
      bindvar: rest
    };
    let language = rest.p_language;
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
        //console.log('getListSendEmail  result'   ,result)
        delete rs.DT["p_refcursor"];
        rs.DT.data = result;
        rs.DT.sumRecord = result.length;
        rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
        return res.send(rs);
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  //quan li trang thai email
  getEmailListManager: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_autoid: "",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.p_language
    };
    //console.log('getEmailListManager', rest)

    let obj = {
      funckey: "prc_get_email_list",
      bindvar: rest
    };
    let language = rest.p_language;
    processingserver.callAPI(obj, async function (err, rs) {
      //console.log('>>>>>>>>>>>>rs', rs)

      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
        let sumRecord = result.length;
        //phan trang
        let { pagesize, page, keySearch, sortSearch } = req.body;

        if (keySearch)
          if (keySearch.length > 0)
            result = await Paging.find(result, keySearch);

        let numOfPages = Math.ceil(result.length / pagesize);

        if (sortSearch)
          if (sortSearch.length > 0)
            result = await Paging.orderby(result, sortSearch);
        result = await Paging.paginate(result, pagesize, page ? page : 1);
        delete rs.DT["p_refcursor"];
        var DT = { data: result, numOfPages: numOfPages, sumRecord: sumRecord };

        return res.send(Ioutput.success(DT));
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  managementEmail: function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    rest = {
      p_autoid: data.autoid,
      p_templateid: data.templateid,
      pv_action: "ADD",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language,
      pv_objname: data.objname,
      MODELNAME: "managementemail"
    };
    //console.log('managementEmail  ---- ', rest)
    let obj = { model: rest };
    processingserver.createmodel(obj, async function (err, rs) {
      //console.log('rs ne ----- ',rs)

      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, data.language);
        return res.send(rs);
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  //lay ds cac tai khoan dc gui mail
  getSendEmailList: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_templateid: data.templateid,
      p_senddate: data.senddate,
      p_txnum: data.txnum,
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language
    };

    //console.log("CHECK  ", rest)
    let obj = {
      funckey: "prc_get_sendemail_list",
      bindvar: rest
    };
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        if (rs.EC == 0) {
          //result tach ra 2 gia tri, redata tra ve chuoi object
          let result,
            resultdata = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          //console.log(".....", resultdata)
          result = resultdata.map(item => {
            return {
              value: item.CUSTODYCD,
              label: item.CUSTODYCD
            };
          });
          return res.send({ result, resultdata });
        } else {
          return res.send(rs);
        }
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  //xu li them email
  sendOtherEmail: function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    rest = {
      p_emailtype: data.emailtype,
      pv_action: "ADD",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language,
      pv_objname: data.objname,
      MODELNAME: "send_otheremail"
    };
    //console.log('sendOtherEmail  ---- ', rest)
    let obj = { model: rest };
    processingserver.createmodel(obj, async function (err, rs) {
      // console.log('rs sendOtherEmailne ----- ', rs)

      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, data.language);
        return res.send(rs);
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  // lay ds all email/sms
  getEmailListManagerAll: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_autoid: "",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.p_language
    };
    //console.log('getEmailListManagerAll', rest)

    let obj = {
      funckey: "prc_get_sendemail_history",
      bindvar: rest
    };
    let language = rest.p_language;
    processingserver.callAPI(obj, async function (err, rs) {
      //console.log('>>>>>>>>>>>>rs', rs)

      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
        let sumRecord = result.length;
        //phan trang
        let { pagesize, page, keySearch, sortSearch } = req.body;

        if (keySearch)
          if (keySearch.length > 0)
            result = await Paging.find(result, keySearch);

        let numOfPages = Math.ceil(result.length / pagesize);

        if (sortSearch)
          if (sortSearch.length > 0)
            result = await Paging.orderby(result, sortSearch);
        result = await Paging.paginate(result, pagesize, page ? page : 1);
        delete rs.DT["p_refcursor"];
        var DT = { data: result, numOfPages: numOfPages, sumRecord: sumRecord };

        return res.send(Ioutput.success(DT));
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  //   ---------  CRM  ---------
  getListCRM: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_custodycd: "",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language
    };
    // console.log("get LIST", rest)
    let obj = {
      funckey: "prc_get_crmintegration",
      bindvar: rest
    };
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        //console.log(".....", rs)
        if (rs.EC == 0) {
          let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          let dataAll = result;
          let pv_sumRecord = result.length;
          // console.log("..........", result)
          //phan trang
          let { pagesize, page, keySearch, sortSearch } = req.body;
          if (keySearch)
            if (keySearch.length > 0)
              result = await Paging.find(result, keySearch);

          let numOfPages = Math.ceil(result.length / pagesize);

          // search theo tung cot
          if (sortSearch)
            if (sortSearch.length > 0)
              result = await Paging.orderby(result, sortSearch);
          result = await Paging.paginate(result, pagesize, page ? page : 1);
          delete rs.DT["p_refcursor"];
          var DT = {
            data: result,
            numOfPages: numOfPages,
            sumRecord: pv_sumRecord,
            dataAll
          };

          return res.send(Ioutput.success(DT));
        } else {
          return res.send(rs);
        }
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  checkCRM: function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    rest = {
      p_custodycd: data.custodycd,
      p_iscflead: data.iscflead,
      p_note: "",
      pv_action: "ADD",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language,
      pv_objname: data.objname,
      MODELNAME: "crmintegration"
    };

    //console.log('data ne: ',rest)
    let obj = { model: rest };
    processingserver.createmodel(obj, async function (err, rs) {
      //console.log('rs checkkkkkkkk: ',rs)

      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, data.language);
        return res.send(rs);
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  getlistusergroup: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language,
    };
    let obj = {
      funckey: "prc_get_list_user_group",
      bindvar: rest
    };
    sails.log('obj:', obj)
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        sails.log('err:', err)
        return res.send(Utils.removeException(err));
      }
      try {
        if (rs.EC == 0) {
          sails.log('rs.DT:', rs.DT)
          let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          let dataAll = result;
          let pv_sumRecord = result.length;
          // console.log("..........", result)
          //phan trang
          let { pagesize, page, keySearch, sortSearch } = req.body;
          if (keySearch)
            if (keySearch.length > 0)
              result = await Paging.find(result, keySearch);
          let numOfPages = Math.ceil(result.length / pagesize);
          // search theo tung cot
          if (sortSearch)
            if (sortSearch.length > 0)
              result = await Paging.orderby(result, sortSearch);
          result = await Paging.paginate(result, pagesize, page ? page : 1);
          delete rs.DT["p_refcursor"];
          var DT = {
            data: result,
            numOfPages: numOfPages,
            sumRecord: pv_sumRecord,
            dataAll
          };
          return res.send(Ioutput.success(DT));
        } else {
          sails.log('rs:', rs)
          return res.send(rs);
        }
      } catch (error) {
        sails.log('error:', error)
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  // duyet tk
  getListDuyetTK: async function (req, res) {
    let { TLID } = req.session.userinfo;
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_custodycd: "ALL",
      p_tlid: TLID

      //p_tlid: '000001'
    };
    let obj = {
      funckey: "prc_get_cfmast_approve",
      bindvar: rest
    };
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        if (rs.EC == 0) {
          let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          let dataAll = result;
          let pv_sumRecord = result.length;
          // console.log("..........", result)
          //phan trang
          let { pagesize, page, keySearch, sortSearch } = req.body;
          if (keySearch)
            if (keySearch.length > 0)
              result = await Paging.find(result, keySearch);
          let numOfPages = Math.ceil(result.length / pagesize);
          // search theo tung cot
          if (sortSearch)
            if (sortSearch.length > 0)
              result = await Paging.orderby(result, sortSearch);
          result = await Paging.paginate(result, pagesize, page ? page : 1);
          delete rs.DT["p_refcursor"];
          var DT = {
            data: result,
            numOfPages: numOfPages,
            sumRecord: pv_sumRecord,
            dataAll
          };
          return res.send(Ioutput.success(DT));
        } else {
          return res.send(rs);
        }
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  getListDuyetTKDetail: async function (req, res) {
    let data = req.body;
    let { TLID } = req.session.userinfo;
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_custid: data.custid,
      p_tlid: TLID,
      p_language: data.language
    };
    let obj = {
      funckey: "prc_get_cfmast_approvedtl",
      bindvar: rest
    };
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        if (rs.EC == 0) {
          let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          sails.log('result prc_get_cfmast_approvedtl:', result)
          //phan trang
          let { pagesize, page, keySearch, sortSearch } = req.body;
          if (keySearch)
            if (keySearch.length > 0)
              result = await Paging.find(result, keySearch);
          let numOfPages = Math.ceil(result.length / pagesize);
          // search theo tung cot
          if (sortSearch)
            if (sortSearch.length > 0)
              result = await Paging.orderby(result, sortSearch);
          result = await Paging.paginate(result, pagesize, page ? page : 1);
          delete rs.DT["p_refcursor"];
          var DT = { data: result, numOfPages: numOfPages };
          return res.send(Ioutput.success(DT));
        } else {
          return res.send(rs);
        }
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  approveManaAcc: function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    rest = {
      p_custid: data.custid,
      p_custodycd: data.custodycd,
      p_fullname: data.fullname,
      p_status: data.status,
      p_action: "APPROVE",
      p_desc: data.desc,
      pv_action: "ADD",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language,
      pv_objname: data.objname,
      MODELNAME: "cfmast_approve_2023"
    };
    let obj = { model: rest };
    processingserver.createmodel(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, data.language);
        return res.send(rs);
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  rejectManaAcc: function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    rest = {
      p_custid: data.custid,
      p_custodycd: data.custodycd,
      p_fullname: data.fullname,
      p_status: data.status,
      p_action: "REJECT",
      p_desc: data.desc,
      pv_action: "ADD",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language,
      pv_objname: data.objname,
      MODELNAME: "cfmast_approve_2023"
    };
    //console.log('data ne: ',rest)
    let obj = { model: rest };
    processingserver.createmodel(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, data.language);
        return res.send(rs);
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  createReportRequest_manageracct: function (req, res) {
    try {
      var data = {};
      let pv_tlid = sails.config.USERONL;
      let pv_role = "";
      let pv_userid = req.body.p_reflogid;
      try {
        let { TLID, ROLECODE, USERID } = req.session.userinfo;
        pv_tlid = TLID;
        pv_role = ROLECODE;
        pv_userid = USERID;
      } catch (error) { }

      // data = RestfulHandler.addSessionInfo(data, req);
      data.p_reqid = '';
      //  data.p_rptparam = '';
      // data.p_exptype = 'PDF';
      data.p_reflogid = '';
      // data.p_rptid = '';
      data.p_priority = 0;
      data.p_export_path = '';
      data.p_refrptlogs = '';
      data.p_refrptauto = '';
      data.p_isauto = '';
      data.p_export_path = '';
      data.p_tlid = pv_tlid;
      data.p_tlname = pv_userid;
      data.p_role = pv_role;
      // data.p_refcursor={ dir: 3003, type: 2004 }
      data = { ...data, ...req.body };

      //data.p_rptparam = '(:l_refcursor,PV_TLID=>\'' + data.p_tlid + '\',PV_BRID=>\'' + data.DBCODE + '\',PV_ROLECODE=>\'' + data.p_role + '\',' + data.p_rptparam + ')';

      let obj =
      {
        "funckey": "prc_report_create_rpt_request_manageracct",
        bindvar: data
      }
      processingserver.callAPI(obj, async function (err, rs) {
        return res.send(rs);
      });
    } catch (error) {
      sails.log.error(error);
      return res.send(Ioutput.errServer(error));
    }
  },
  get_rptfile_bycustodycd: function (req, res) {
    let data = req.body;
    //console.log('data', data)



    let rest = {
      p_custodycd: data.p_custodycd,
      p_rptid: data.p_rptid,
      p_refcursor: { dir: 3003, type: 2004 },
      p_autoid: data.p_autoid

    }

    let obj =
    {
      "funckey": "prc_get_rptfile_bycustodycd_manageracct",
      bindvar: rest
    }
    let language = rest.p_language
    processingserver.callAPI(obj, async function (err, rs) {

      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {

        let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
        delete rs.DT["p_refcursor"];
        rs.DT.data = result;
        rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
        return res.send(rs);

      } catch (error) {
        rs.EM = 'Lỗi client gọi api';
        rs.EC = -1000;
        return res.send(rs)
      }
    });
  },
  get_last_txnum_edit: function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE, USERID } = req.session.userinfo;

    //console.log('data', data)
    let rest = {

      p_refcursor: { dir: 3003, type: 2004 },
      p_custodycd: data.p_custodycd,
      p_date: data.p_date,
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language
    }

    let obj =
    {
      "funckey": "prc_get_last_txnum_edit",
      bindvar: rest
    }

    processingserver.callAPI(obj, async function (err, rs) {

      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        // console.log(".....", rs)

        if (rs.EC == 0) {

          let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);

          var DT = { data: result }


          return res.send(Ioutput.success(DT));

        } else {
          return res.send(rs);
        }
      } catch (error) {
        rs.EM = 'Lỗi client gọi api';
        rs.EC = -1000;
        return res.send(rs)
      }
    });
  },
  downloadReport: function (req, res) {
    try {
      var extension = req.query.extension;
      let pv_tlid = sails.config.USERONL;
      let pv_role = "";
      let pv_userid = req.query.custodycd;
      try {
        let { TLID, ROLECODE, USERID } = req.session.userinfo;
        pv_tlid = TLID;
        pv_role = ROLECODE;
        pv_userid = USERID;
      } catch (error) { }


      var data = {};
      data.p_refcursor = { dir: 3003, type: 2004 };
      data.p_tlid = pv_tlid;
      data.p_tlname = pv_userid;
      data.p_role = pv_role;
      data.p_reflogid = '';
      //  data = { ...data, ...req.body }
      data.p_autoid = req.query.AUTOID;
      data.p_type = req.query.TYPE;
      data.p_rptid = req.query.RPTID
      data.p_codeid = ''
      data.p_tradingdate = ''


      let obj =
      {
        "funckey": "prc_report_get_rpt_request",
        bindvar: data
      }
      processingserver.callAPI(obj, async function (err, rs) {
        //console.log('dawdaw',rs)
        try {
          if (err) {
            sails.log.error(err);
            return res.send(Ioutput.errServer(err));
          } else {
            var result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
            if (result.length == 1) {
              if (!result[0].REFRPTFILE) {
                return res.send(Ioutput.errMessage("Chưa có dữ liệu báo cáo " + result[0].RPTID, null));
              }
              var arrLink = result[0].REFRPTFILE.split('$#');
              var link = null;
              for (var item of arrLink) {
                if (path.extname(item) == extension) {
                  link = item;
                }
              }
              //  link = sails.config.WEBUSER_REPORT_PATH + link.replace(/\\/g, '/');

              //    link = sails.config.MAP_DRIVE + ':' + '\\' + link

              sails.log.info('downloadReport: arrLink', arrLink, 'link', link);
              if (link) {
                //   if (result[0].CMDTYPE == 'E') {  //bao cao dc gen ra tren webuser
                //     var link = sails.config.WEBUSER_REPORT_PATH + link.replace(/\\/g, '/');
                //     res.download(link, function (err) {

                //       if (err) {
                //         return res.serverError(err);
                //       } else {
                //         return res.ok();
                //       }
                //     })
                //   } else { //bao cao dc gen ra bang service mix tren server app
                var link = link.replace(/\\/g, '/');
                //     request({
                //       url: sails.config.URL_BPS + 'Report/downloadReport',
                //       method: 'POST',
                //       json: { link: link }
                //     }).pipe(res);
                serviceTest.pipeRequest({
                  action: 'Report/downloadReport',
                  method: 'POST',
                  json: { link: link }
                }, res);
                // }
              } else {
                sails.log.error('downloadReport error: not found link :result[0].REFRPTFILE', result[0].REFRPTFILE);
                return res.send(Ioutput.errMessage("Không tìm thấy file " + result[0].RPTID, null));
              }


            } else {
              sails.log.error('downloadReport error: not found autoid :req.query.AUTOID', req.query.AUTOID, 'data.AUTOID', data.AUTOID, ' result.length', result.length, 'result', result);
              return res.send(Ioutput.errMessage("Không tìm thấy dữ liệu báo cáo", null));
            }
          }
        } catch (error) {
          sails.log.error('downloadReport: error', error);
          return res.send(Ioutput.errServer(error));
        }
      });
    } catch (error) {
      sails.log.error(error);
      return res.send(Ioutput.errServer(error));
    }
  },
  //tuan.nguyenquang: Quan ly upload file
  prc_sy_mt_cfsign: function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    let datasubmit = {
      p_action: data.ACTION,
      p_autoid: data.AUTOID ? data.AUTOID : "",
      p_custodycd: data.CUSTODYCD,
      p_type: data.TYPE,
      p_imgsign: data.IMGSIGN,
      p_note: data.NOTE,
      p_tlid: TLID,
      p_role: ROLECODE,
      pv_objname: data.OBJNAME,
      p_language: data.language,
      // MODELNAME: "sy_mt_cfsign"
    };
    // sails.log("prc_sy_mt_cfsign.:Begin.:", datasubmit)
    datasubmit = commonUtil.convertPropsNullToEmpty(datasubmit);
    let language = datasubmit.p_language
    let obj =
    {
      "funckey": "prc_sy_mt_cfsign",
      bindvar: datasubmit
    }
    // sails.log.info("prc_sy_mt_cfsign.Start:", datasubmit)
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
        sails.log.info("prc_sy_mt_cfsign.RS:", rs.EM)
        return res.send(rs);
      } catch (error) {
        rs.EM = 'Lỗi client gọi api';
        rs.EC = -1000;
        sails.log.error("prc_sy_mt_cfsign.Error:", rs.EM)
        return res.send(rs)
      }
    })
  },

  //tuan.nguyenquang: Lay danh sach upload theo custodycd, status
  get_list_cfsign: function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    let datasubmit = {
      p_custodycd: data.CUSTODYCD,
      p_status: data.STATUS,
      p_tlid: TLID,
      p_role: ROLECODE,
      pv_objname: data.OBJNAME,
      p_language: data.language,
      p_refcursor: { dir: 3003, type: 2004 },
      // MODELNAME: "sy_mt_cfsign"
    };
    // sails.log("prc_sy_mt_cfsign.:Begin.:", datasubmit)
    datasubmit = commonUtil.convertPropsNullToEmpty(datasubmit);
    let obj =
    {
      "funckey": "prc_get_sy_mt_cfsign",
      bindvar: datasubmit
    }
    // sails.log.info("get_list_cfsign.Start:", datasubmit)
    let language = datasubmit.p_language
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        if (rs.EC == 0) {
          let result = ConvertData.convert_to_Object(rs.DT.p_refcursor)
          delete rs.DT["p_refcursor"]
          rs.DT.data = result;
          rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language)
          return res.send(rs);
        } else {
          rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
          sails.log.error("get_list_cfsign.Error:", rs.EM)
          return res.send(rs);
        }
      } catch (error) {
        rs.EM = 'Lỗi client gọi api';
        rs.EC = -1000;
        sails.log.error("get_list_cfsign.Error:", rs.EM)
        return res.send(rs)
      }
    })
  },

  prc_internal_account: function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    let datasubmit = {
      p_action: data.p_action,
      p_autoid: data.p_autoid,
      p_custodycd: data.p_custodycd,
      p_fullname: data.p_fullname,
      p_idcode: data.p_idcode,
      p_idtype: data.p_idtype,
      p_positions: data.p_positions,
      p_codeid: data.p_codeid,
      p_description: data.p_description,
      pv_tlid: TLID,
      // p_role: ROLECODE,
      pv_language: data.pv_language,
      pv_objname: data.pv_objname
    }
    datasubmit = commonUtil.convertPropsNullToEmpty(datasubmit);
    let language = datasubmit.p_language
    let obj =
    {
      "funckey": "prc_internal_account",
      bindvar: datasubmit
    }
    sails.log.info("prc_internal_account.Start:", datasubmit)
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
        sails.log.info("prc_internal_account.RS:", rs.EM)
        return res.send(rs);
      } catch (error) {
        rs.EM = 'Lỗi client gọi api';
        rs.EC = -1000;
        sails.log.error("prc_internal_account.Error:", rs.EM)
        return res.send(rs)
      }
    })
  },
  prc_get_internal_account: async function (req, res) {
    let { TLID, ROLECODE } = req.session.userinfo;
    let data = req.body.data;
    let rest = {
      p_tlid: TLID,
      p_custodycd: "ALL",
      p_language: data.p_language,
      p_role: ROLECODE,
      p_refcursor: { dir: 3003, type: 2004 }
    };

    let obj = {
      funckey: "prc_get_internal_account",
      bindvar: rest
    };
    processingserver.callAPI(obj, function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        if (rs.EC == 0) {
          let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          delete rs.DT["p_refcursor"];
          rs.DT.data = result;
          return res.send(rs);
        } else {
          return res.send(rs);
        }
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },



  prc_company_account: function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    let datasubmit = {
      p_action: data.p_action,
      p_autoid: data.p_autoid,
      p_custodycd: data.p_custodycd,
      p_fullname: data.p_fullname,
      p_idcode: data.p_idcode,
      p_idtype: data.p_idtype,
      p_description: data.p_description,
      pv_tlid: TLID,
      // p_role: ROLECODE,
      pv_language: data.pv_language,
      pv_objname: data.pv_objname
    }
    datasubmit = commonUtil.convertPropsNullToEmpty(datasubmit);
    let language = datasubmit.p_language
    let obj =
    {
      "funckey": "prc_company_account",
      bindvar: datasubmit
    }
    sails.log.info("prc_company_account.Start:", datasubmit)
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
        sails.log.info("prc_company_account.RS:", rs.EM)
        return res.send(rs);
      } catch (error) {
        rs.EM = 'Lỗi client gọi api';
        rs.EC = -1000;
        sails.log.error("prc_company_account.Error:", rs.EM)
        return res.send(rs)
      }
    })
  },
  prc_get_company_account: async function (req, res) {
    let { TLID, ROLECODE } = req.session.userinfo;
    let data = req.body.data;
    let rest = {
      p_tlid: TLID,
      p_custodycd: "ALL",
      p_language: data.p_language,
      p_role: ROLECODE,
      p_refcursor: { dir: 3003, type: 2004 }
    };

    let obj = {
      funckey: "prc_get_company_account",
      bindvar: rest
    };
    processingserver.callAPI(obj, function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        if (rs.EC == 0) {
          let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          delete rs.DT["p_refcursor"];
          rs.DT.data = result;
          return res.send(rs);
        } else {
          return res.send(rs);
        }
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },

  // duyet ho so goc
  getlistDuyetHoSoGoc: async function (req, res) {
    let { TLID } = req.session.userinfo;
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_custodycd: "ALL",
      p_tlid: TLID
    };
    let obj = {
      funckey: "prc_get_cfmast_approve_original_file",
      bindvar: rest
    };
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        if (rs.EC == 0) {
          let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          let dataAll = result;
          let pv_sumRecord = result.length;
          // console.log("..........", result)
          //phan trang
          let { pagesize, page, keySearch, sortSearch } = req.body;
          if (keySearch)
            if (keySearch.length > 0)
              result = await Paging.find(result, keySearch);
          let numOfPages = Math.ceil(result.length / pagesize);
          // search theo tung cot
          if (sortSearch)
            if (sortSearch.length > 0)
              result = await Paging.orderby(result, sortSearch);
          result = await Paging.paginate(result, pagesize, page ? page : 1);
          delete rs.DT["p_refcursor"];
          var DT = {
            data: result,
            numOfPages: numOfPages,
            sumRecord: pv_sumRecord,
            dataAll
          };
          return res.send(Ioutput.success(DT));
        } else {
          return res.send(rs);
        }
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  getListDuyetHoSoGocDetail: async function (req, res) {
    let data = req.body;
    let { TLID } = req.session.userinfo;
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_custid: data.custid,
      p_custodycd: data.custodycd,
      p_tlid: TLID,
      p_language: data.language
    };
    let obj = {
      funckey: "prc_get_cfmast_approve_original_file",
      bindvar: rest
    };
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        sails.log('er not remove:', err)
        sails.log('Utils.removeException(err):', Utils.removeException(err))
        return res.send(Utils.removeException(err));
      }
      try {
        if (rs.EC == 0) {
          let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          sails.log('result prc_get_cfmast_approvedtl_original_file:', result)
          //phan trang
          let { pagesize, page, keySearch, sortSearch } = req.body;
          if (keySearch)
            if (keySearch.length > 0)
              result = await Paging.find(result, keySearch);
          let numOfPages = Math.ceil(result.length / pagesize);
          // search theo tung cot
          if (sortSearch)
            if (sortSearch.length > 0)
              result = await Paging.orderby(result, sortSearch);
          result = await Paging.paginate(result, pagesize, page ? page : 1);
          delete rs.DT["p_refcursor"];
          var DT = { data: result, numOfPages: numOfPages };
          return res.send(Ioutput.success(DT));
        } else {
          return res.send(rs);
        }
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  approveoriginalfile: function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    rest = {
      p_custid: data.custid,
      p_custodycd: data.custodycd,
      p_statusfile: 'A',
      pv_action: "ADD",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language,
      pv_objname: data.objname,
      MODELNAME: "txprocess5046"
    };
    let obj = { model: rest };
    processingserver.createmodel(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, data.language);
        return res.send(rs);
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(error);
      }
    });
  },
  // rejectoriginalfile: function (req, res) {
  //   let data = req.body;
  //   let { TLID, ROLECODE } = req.session.userinfo;
  //   rest = {
  //     p_custid: data.custid,
  //     p_custodycd: data.custodycd,
  //     p_fullname: data.fullname,
  //     p_status: data.status,
  //     p_action: "REJECT",
  //     p_desc: data.desc,
  //     pv_action: "ADD",
  //     p_tlid: TLID,
  //     p_role: ROLECODE,
  //     p_language: data.language,
  //     pv_objname: data.objname,
  //     MODELNAME: "cfmast_approve_original_file"
  //   };
  //   //console.log('data ne: ',rest)
  //   let obj = { model: rest };
  //   processingserver.createmodel(obj, async function (err, rs) {
  //     if (err) {
  //       return res.send(Utils.removeException(err));
  //     }
  //     try {
  //       rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, data.language);
  //       return res.send(rs);
  //     } catch (error) {
  //       rs.EM = "Lỗi client gọi api";
  //       rs.EC = -1000;
  //       return res.send(rs);
  //     }
  //   });
  // },
};
