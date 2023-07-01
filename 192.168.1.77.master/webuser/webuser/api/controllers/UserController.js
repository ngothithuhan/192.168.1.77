var path = require("path");

//var data = require('../datafake/Account.json')
var processingserver = require("../commonwebuser/ProcessingServer");
var commonUtil = require("../common/CommonUtil");
var Ioutput = require(path.resolve(__dirname, "../common/OutputInterface.js"));
//var RestfulHandler = require('../common/RestfulHandler');
var ConvertData = require("../services/ConvertData");

function buildStrinput(obj) {
  delete obj["_csrf"]
  try {
    let v_return = "";
    for (var property in obj) {
      v_return += obj[property] + "#";
    }
    v_return.slice(0, v_return.length - 1);
    return v_return;
  } catch (error) {
    sails.log.error(error);
    return "";
  }
}
function buildStrinputarray(obj) {
  delete obj["_csrf"]
  try {
    let v_return = "";
    for (var property in obj) {
      v_return += obj[property] + "|";
    }
    v_return.slice(0, v_return.length - 1);
    return v_return;
  } catch (error) {
    sails.log.error(error);
    return "";
  }
}
module.exports = {
  getlistuser: async function (req, res) {
    let data = req.body;
    let temp = [];
    let { TLID, ROLECODE } = req.session.userinfo;
    let tmpKeySearch = [];
    let tmpKeySearch2 = [];
    let isTLFULLNAME = 'N';
    let rest = {
      p_tlid: TLID,
      p_brid: data.p_brid,
      p_language: data.p_language,
      p_role: ROLECODE,
      p_objname: data.OBJNAME,
      p_refcursor: { dir: 3003, type: 2004 }
    };

    let obj = {
      funckey: "prc_get_tlprofiles",
      bindvar: rest
    };
    let language = rest.p_language;
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        // console.log(".....", rs)

        if (rs.EC == 0) {
          let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          let dataAll = result;
          let pv_sumRecord = result.length;
          //phan trang
          let { pagesize, page, keySearch, sortSearch } = req.body;

          if (keySearch) {
            if (keySearch.length > 0) {
              for (let x = 0; x < keySearch.length; x++) {
                if (keySearch[x].id == 'TLFULLNAME') {
                  isTLFULLNAME = 'Y'
                }
              }
              //--------------------sắp xếp lại keysearch----------
              if (isTLFULLNAME == 'Y') {
                for (let k = 0; k < keySearch.length; k++) {
                  if (keySearch[k].id == 'TLFULLNAME') {
                    tmpKeySearch2.push(keySearch[k])
                    for (let g = 0; g < keySearch.length; g++) {
                      if (keySearch[g].id != 'TLFULLNAME') {
                        tmpKeySearch2.push(keySearch[g])
                      }
                    }
                  }
                }
              }
              else {
                tmpKeySearch2 = keySearch
              }
              sails.log('tmpKeySearch2:', tmpKeySearch2)
              //--------------------------------------------------
              if (isTLFULLNAME == 'Y') {
                for (let i = 0; i < tmpKeySearch2.length; i++) {
                  sails.log('keySearch :-----------', tmpKeySearch2)

                  if (tmpKeySearch2[i].id == 'TLFULLNAME') {
                    for (let j = 0; j < result.length; j++) {
                      //---------------------------tìm những bản ghi có upper TLFULLNAME có chứa upper của giá trị TLFULLNAME nhập vào
                      if ((result[j].TLFULLNAME).toUpperCase().includes(
                        tmpKeySearch2[i].value.toUpperCase())) {
                        temp.push(result[j])
                      }
                    }
                  }
                  else if (tmpKeySearch2[i].id != 'TLFULLNAME') {
                    //------------ nếu keysearch khác TLFULLNAME thì tạo ra bộ keysearch mới không có id = TLFULLNAME, lọc bộ giá trị temp đẩy ra ở trên theo bộ keysearch mới đó

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
              temp = dataAll;
              result = temp;
            }
          }

          let numOfPages = Math.ceil(result.length / pagesize);

          //search theo tung cot
          if (sortSearch)
            if (sortSearch.length > 0)
              result = await Paging.orderby(result, sortSearch);
          result = await Paging.paginate(result, pagesize, page ? page : 1);
          delete rs.DT["p_refcursor"];
          var DT = {
            data: result,
            numOfPages: numOfPages,
            sumRecord: pv_sumRecord,
            dataAll: dataAll
          };

          return res.send(Ioutput.success(DT));
        } else {
          return res.send(rs);
        }
        // let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
        // delete rs.DT["p_refcursor"];
        // rs.DT.data = result;
        // rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
        // return res.send(rs);
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },

  add: function (req, res) {
    let data = {};
    data.p_tlid = '';
    data = { ...data, ...req.body };

    data.pv_tlid = req.session.userinfo.TLID;
    data.pv_role = req.session.userinfo.ROLECODE;
    data.MODELNAME = "mt_tlprofiles";

    data = commonUtil.convertPropsNullToEmpty(data);

    let obj = { model: data };

    let language = data.pv_language;
    processingserver.createmodel(obj, async function (err, rs) {
      // console.log(rs)
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

  update: function (req, res) {
    let data = req.body;
    data.p_tlid = data.p_edittlid;
    delete data["p_edittlid"];
    data.pv_tlid = req.session.userinfo.TLID;
    data.pv_role = req.session.userinfo.ROLECODE;
    data.MODELNAME = "mt_tlprofiles";

    data = commonUtil.convertPropsNullToEmpty(data);

    let obj = { model: data };
    let language = data.pv_language;
    processingserver.updatemodel(obj, async function (err, rs) {
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
  approve: function (req, res) {
    let data = {
      p_tlid: req.body.TLID,
      p_active: "",
      p_brid: "",
      p_department: "",
      p_description: "",
      p_email: "",
      p_idcode: "",
      p_mbid: "",
      p_mobile: "",
      p_tlfullname: "",
      p_tlname: "",
      p_tltitle: "",
      p_iddate: "",
      p_idplace: "",
      p_mbcode: "",
      p_bankacc: "",
      p_bankbranch: "",
      p_bankbranchuser: "",
      p_address: "",
      p_taxcode: "",
      p_isrm: "",
      pv_language: "vie",
      pv_tlid: req.session.userinfo.TLID,
      pv_role: req.session.userinfo.ROLECODE
    };

    data.MODELNAME = "mt_tlprofiles";
    data = commonUtil.convertPropsNullToEmpty(data);
    let obj = { model: data };
    let language = data.pv_language;
    processingserver.approvemodel(obj, async function (err, rs) {
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
    // }
  },
  delete: function (req, res) {
    let data = {
      p_tlid: req.body.data.TLID,
      p_active: "",
      p_brid: "",
      p_department: "",
      p_description: "",
      p_vsdsaleid: "",
      p_email: "",
      p_idcode: "",
      p_mbid: "",
      p_mobile: "",
      p_tlfullname: "",
      p_tlname: "",
      p_tltitle: "",
      p_birthdate: "",
      p_iddate: "",
      p_idplace: "",
      p_mbcode: "",
      p_bankacc: "",
      p_bankbranch: "",
      p_bankbranchuser: "",
      p_address: "",
      p_taxcode: "",
      p_isrm: "",
      pv_language: req.body.p_language,
      pv_tlid: req.session.userinfo.TLID,
      pv_role: req.session.userinfo.ROLECODE,
      pv_objname: req.body.pv_objname
    };

    data.MODELNAME = "mt_tlprofiles";
    data = commonUtil.convertPropsNullToEmpty(data);
    let obj = { model: data };
    let language = data.pv_language;
    processingserver.deletemodel(obj, async function (err, rs) {
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
    // }
  },

  getlistcfmastvip: async function (req, res) {
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
      funckey: "prc_get_cfmastvip",
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

  addcfmastvip: function (req, res) {
    let data = req.body;
    data.pv_tlid = req.session.userinfo.TLID;
    data.pv_role = req.session.userinfo.ROLECODE;
    data.pv_action = "ADD";

    data.MODELNAME = "mt_cfmastvip";

    data = commonUtil.convertPropsNullToEmpty(data);

    let obj = { model: data };

    let language = data.pv_language;
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

  updatecfmastvip: function (req, res) {
    let data = req.body;
    data.pv_tlid = req.session.userinfo.TLID;
    data.pv_role = req.session.userinfo.ROLECODE;
    data.MODELNAME = "mt_cfmastvip";
    data.pv_action = "EDIT";
    data = commonUtil.convertPropsNullToEmpty(data);
    sails.log("data cfmastvip:", data);
    let obj = { model: data };

    let language = data.pv_language;
    processingserver.updatemodel(obj, async function (err, rs) {
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

  deletecfmastvip: function (req, res) {
    let data = {
      p_newcustodycd: req.body.data.CUSTODYCD,
      p_fullname: "",
      p_idtype: "",
      p_idcode: "",
      p_status: "",
      p_txdate: "",
      p_grinvestor: "",
      p_custtype: "",
      pv_action: "DELETE",
      pv_tlid: req.session.userinfo.TLID,
      pv_role: req.session.userinfo.ROLECODE,
      pv_language: req.body.p_language,
      pv_objname: req.body.pv_objname
    };
    data.MODELNAME = "mt_cfmastvip";

    data = commonUtil.convertPropsNullToEmpty(data);
    let obj = { model: data };
    let language = req.body.p_language;
    processingserver.deletemodel(obj, async function (err, rs) {
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
  rejectcfmastvip: function (req, res) {
    let data = {
      p_tlid: req.session.userinfo.TLID,
      p_role: req.session.userinfo.ROLECODE,
      pv_action: 'REJECT',
      MODELNAME: "TXPROCESS",
      p_custodycd: req.body.CUSTODYCD,
      p_idtype: req.body.IDTYPE,
      p_idcode: req.body.IDCODE,
      p_fullname: req.body.FULLNAME,
      p_desc: req.body.DESC_STATUS,
      p_language: "VN"
    };

    data = commonUtil.convertPropsNullToEmpty(data);
    let obj = { model: data };
    processingserver.rejectmodel(obj, function (err, rs) {
      ErrDefs.findOne({ ERRNUM: rs.EC }).exec((err, errdefs) => {
        if (err) {
          rs.EM = "Lỗi thực hiện trên redis";
          return res.send(rs);
        }
        if (errdefs) rs.EM = errdefs.ERRDESC;

        return res.send(rs);
      });
    });
  },
  getListSaleRoles: async function (req, res) {
    let data = req.body;

    let temp = [];
    let { TLID, ROLECODE } = req.session.userinfo;
    let tmpKeySearch = [];
    let tmpKeySearch2 = [];
    let isTLFULLNAME = 'N';
    //console.log('req.session.userinfo',req.session.userinfo)
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_saleid: "ALL",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language
    };
    //console.log("get sale role  ", rest)
    let obj = {
      funckey: "prc_get_sale_roles",
      bindvar: rest
    };
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        // console.log(".....", rs)

        if (rs.EC == 0) {
          let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          let dataAll = result;
          let pv_sumRecord = result.length;
          //phan trang
          let { pagesize, page, keySearch, sortSearch } = req.body;

          if (keySearch) {
            if (keySearch.length > 0) {
              for (let x = 0; x < keySearch.length; x++) {
                if (keySearch[x].id == 'TLFULLNAME') {
                  isTLFULLNAME = 'Y'
                }
              }
              //--------------------sắp xếp lại keysearch----------
              if (isTLFULLNAME == 'Y') {
                for (let k = 0; k < keySearch.length; k++) {
                  if (keySearch[k].id == 'TLFULLNAME') {
                    tmpKeySearch2.push(keySearch[k])
                    for (let g = 0; g < keySearch.length; g++) {
                      if (keySearch[g].id != 'TLFULLNAME') {
                        tmpKeySearch2.push(keySearch[g])
                      }
                    }
                  }
                }
              }
              else {
                tmpKeySearch2 = keySearch
              }
              sails.log('tmpKeySearch2:', tmpKeySearch2)
              //--------------------------------------------------
              if (isTLFULLNAME == 'Y') {
                for (let i = 0; i < tmpKeySearch2.length; i++) {
                  sails.log('keySearch :-----------', tmpKeySearch2)

                  if (tmpKeySearch2[i].id == 'TLFULLNAME') {
                    for (let j = 0; j < result.length; j++) {
                      //---------------------------tìm những bản ghi có upper TLFULLNAME có chứa upper của giá trị TLFULLNAME nhập vào
                      if ((result[j].TLFULLNAME).toUpperCase().includes(
                        tmpKeySearch2[i].value.toUpperCase())) {
                        temp.push(result[j])
                      }
                    }
                  }
                  else if (tmpKeySearch2[i].id != 'TLFULLNAME') {
                    //------------ nếu keysearch khác TLFULLNAME thì tạo ra bộ keysearch mới không có id = TLFULLNAME, lọc bộ giá trị temp đẩy ra ở trên theo bộ keysearch mới đó

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
              temp = dataAll;
              result = temp;
            }
          }

          let numOfPages = Math.ceil(result.length / pagesize);

          //search theo tung cot
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

  getTLProfiles: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language
    };

    let obj = {
      funckey: "prc_get_tlprofiles_active",
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
          result = resultdata.map(item => {
            return {
              value: item.TLID,
              label: item.TLNAME
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

  getSaleRetype: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_autoid: "ALL",
      p_rerole: data.rerole,
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language
    };
    //console.log("get sale role  ", rest)
    let obj = {
      funckey: "prc_get_sale_retype",
      bindvar: rest
    };
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        // console.log(".....", rs)

        if (rs.EC == 0) {
          let result,
            resultdata = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          //console.log('result loai hinh', resultdata)

          result = resultdata.map(item => {
            return {
              value: item.AUTOID,
              label: item.TYPECD,
              status: item.STATUS
            };
          });
          //console.log('result loai hinh tach value', result)
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
  addListSaleRoles: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    let rest = {
      p_autoid: "",
      p_retype: data.retype,
      p_saleid: data.saleid,
      p_effdate: data.effdate,
      p_expdate: data.expdate,
      p_saleacctno: data.saleacctno,
      p_threshold: data.threshold,
      p_iscomm: data.iscomm,
      p_contractno: data.p_contractno,
      p_contractdate: data.p_contractdate ? data.p_contractdate : '01/01/0001',
      p_trangthai: data.trangthai,
      pv_tlid: TLID,
      pv_role: ROLECODE,
      pv_action: "ADD",
      pv_language: data.language,
      pv_objname: data.objname,
      p_refcursor: { dir: 3003, type: 2004 },
      p_err_code: '',
      p_err_param: ''
    };
    sails.log('rest', rest)
    let obj = {
      funckey: "prc_mt_sale_roles",
      bindvar: rest
    };
    processingserver.callAPI(obj, async function (err, rs) {
      sails.log('rs', rs)
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        //sails.log('rs:==========',rs)

        //console.log('xxx',rs)
        //rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, data.language);
        return res.send(rs);
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  // addListSaleRoles: async function (req, res) {
  //   let data = req.body;
  //   let { TLID, ROLECODE } = req.session.userinfo;
  //   sails.log('data',data)
  //   let rest = {
  //     p_autoid: "",
  //     p_retype: req.body.retype,
  //     p_saleid: req.body.saleid,
  //     p_effdate: req.body.effdate,
  //     p_expdate: req.body.expdate,
  //     p_threshold: req.body.threshold,
  //     p_iscomm: req.body.iscomm,
  //     p_saleacctno: req.body.saleacctno,
  //     pv_tlid: TLID,
  //     p_refcursor: { dir: 3003, type: 2004 },
  //     pv_role: ROLECODE,
  //     pv_language: req.body.language,
  //     pv_objname: req.body.objname,
  //     pv_action : "ADD",
  //     MODELNAME: "mt_sale_roles"
  //   };
  //   //console.log("get add role  ", rest)
  //   let obj = {
  //     funckey: "prc_mt_sale_roles",
  //     model: rest
  //   };
  //   processingserver.callAPI(obj, async function (err, rs) {
  //     sails.log('rs:==========',rs)
  //     sails.log('err:==========',err)
  //     if (err) {
  //       return res.send(Utils.removeException(err));
  //     }
  //     try {
  //       //sails.log('rs:==========',rs)

  //       //console.log('xxx',rs)
  //       rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, data.language);
  //       return res.send(rs);
  //     } catch (error) {
  //       rs.EM = "Lỗi client gọi api";
  //       rs.EC = -1000;
  //       return res.send(rs);
  //     }
  //   });
  // },
  updateListSaleRoles: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    //console.log('req.session.userinfo',req.session.userinfo)
    let rest = {
      p_autoid: data.autoid,
      p_retype: data.retype,
      p_saleid: data.saleid,
      p_effdate: data.effdate,
      p_expdate: data.expdate,
      p_saleacctno: data.saleacctno,
      p_threshold: data.threshold,
      p_iscomm: data.iscomm,
      p_contractno: data.p_contractno,
      p_contractdate: data.p_contractdate ? data.p_contractdate : '01/01/0001',
      p_trangthai: data.trangthai,
      pv_tlid: TLID,
      p_refcursor: { dir: 3003, type: 2004 },
      pv_role: ROLECODE,
      pv_action: "EDIT",
      pv_language: data.language,
      pv_objname: data.objname,
      MODELNAME: "mt_sale_roles"
    };
    //console.log("hihi update role  ", rest)
    let obj = {
      model: rest
    };
    processingserver.updatemodel(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        //console.log('xxx',rs)
        rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, data.language);
        return res.send(rs);
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  deleteListSaleRoles: function (req, res) {
    let data = req.body;
    //console.log('data delete dung: ', data)
    let { TLID, ROLECODE } = req.session.userinfo;
    data = {
      // p_autoid: data.AUTOID,
      // p_retype: "",
      // p_saleid: "",
      // p_effdate: "",
      // p_expdate: "",
      // p_saleacctno: "",
      p_autoid: data.AUTOID,
      p_retype: data.RETYPE,
      p_saleid: data.SALEID,
      p_effdate: data.EFFDATE,
      p_expdate: data.EXPDATE,
      p_saleacctno: data.SALEACCTNO,
      p_threshold: data.threshold,
      p_contractno: data.CONTRACTNO,
      p_contractdate: data.CONTRACTDATE ? data.CONTRACTDATE : '01/01/0001',
      p_trangthai: data.TRANGTHAI,
      p_iscomm: data.iscomm,
      pv_tlid: TLID,
      pv_role: ROLECODE,
      pv_language: data.language,
      pv_objname: data.objname
    };

    data.MODELNAME = "mt_sale_roles";
    data = commonUtil.convertPropsNullToEmpty(data);
    let obj = { model: data };
    let language = data.pv_language;
    processingserver.deletemodel(obj, async function (err, rs) {
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
  //-----------------Gan khach hang vao mo gioi - RE004---------------
  getListSaleCustomers: async function (req, res) {
    let data = req.body;

    let temp = [];
    let { TLID, ROLECODE } = req.session.userinfo;
    let tmpKeySearch = [];
    let tmpKeySearch2 = [];
    let isTLFULLNAME = 'N';
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_saleid: "ALL",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language
    };
    //console.log("-----get listchange info cus-------", rest)
    let obj = {
      funckey: "prc_get_sale_customers",
      bindvar: rest
    };
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        // console.log(".....", rs)

        if (rs.EC == 0) {
          let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          let dataAll = result;
          let pv_sumRecord = result.length;
          //phan trang
          sails.log('pv_sumRecord::', pv_sumRecord)
          let { pagesize, page, keySearch, sortSearch } = req.body;

          if (keySearch) {
            if (keySearch.length > 0) {
              for (let x = 0; x < keySearch.length; x++) {
                if (keySearch[x].id == 'FULLNAME') {
                  isTLFULLNAME = 'Y'
                }
              }
              sails.log('isTLFULLNAME::', isTLFULLNAME)
              //--------------------sắp xếp lại keysearch----------
              if (isTLFULLNAME == 'Y') {
                for (let k = 0; k < keySearch.length; k++) {
                  if (keySearch[k].id == 'FULLNAME') {
                    tmpKeySearch2.push(keySearch[k])
                    for (let g = 0; g < keySearch.length; g++) {
                      if (keySearch[g].id != 'FULLNAME') {
                        tmpKeySearch2.push(keySearch[g])
                      }
                    }
                  }
                }
              }
              else {
                tmpKeySearch2 = keySearch
              }
              sails.log('tmpKeySearch2:', tmpKeySearch2)
              //--------------------------------------------------
              if (isTLFULLNAME == 'Y') {
                for (let i = 0; i < tmpKeySearch2.length; i++) {
                  sails.log('keySearch :-----------', tmpKeySearch2)

                  if (tmpKeySearch2[i].id == 'FULLNAME') {
                    for (let j = 0; j < result.length; j++) {
                      //---------------------------tìm những bản ghi có upper FULLNAME có chứa upper của giá trị FULLNAME nhập vào
                      if ((result[j].FULLNAME).toUpperCase().includes(
                        tmpKeySearch2[i].value.toUpperCase())) {
                        temp.push(result[j])
                      }
                    }
                  }
                  else if (tmpKeySearch2[i].id != 'FULLNAME') {
                    //------------ nếu keysearch khác FULLNAME thì tạo ra bộ keysearch mới không có id = FULLNAME, lọc bộ giá trị temp đẩy ra ở trên theo bộ keysearch mới đó

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
              temp = dataAll;
              result = temp;
            }
          }

          let numOfPages = Math.ceil(result.length / pagesize);

          //search theo tung cot
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
        // let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
        // delete rs.DT["p_refcursor"];
        // rs.DT.data = result;
        // rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
        // return res.send(rs);
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(error);
      }
    });
  },

  addListSaleCustomers: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    //console.log('req.session.userinfo',req.session.userinfo)
    let rest = {
      p_refacctno: data.refacctno, //so hieu tk giao dich
      p_reftype: data.retype,
      p_saleid: data.saleid,
      p_saleacctno: data.saleacctno,
      p_rerole: data.rerole,
      p_reproduct: data.reproduct,
      p_fullname: data.fullname,
      pv_action: "ADD",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language,
      pv_objname: data.objname,
      MODELNAME: "sale_customers"
    };
    //console.log("get checking  ", rest)
    let obj = {
      model: rest
    };
    processingserver.createmodel(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        // console.log('xxx', rs)
        rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, data.language);
        return res.send(rs);
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  getRetypeBySaleid: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    //console.log('req.session.userinfo',req.session.userinfo)
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_saleid: data.saleid,
      p_retype: "D",
      p_rerole: "ALL",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language
    };
    //console.log("getRetypeBySaleid  ", rest)
    let obj = {
      funckey: "prc_get_retype_by_saleid",
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
              value: item.AUTOID,
              label: item.TYPENAME
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
  getRetypeBySaleidalt: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    //console.log('req.session.userinfo',req.session.userinfo)
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_saleid: data.saleid,
      p_retype: "D",
      p_rerole: "ALL",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language
    };
    //console.log("getRetypeBySaleid  ", rest)
    let obj = {
      funckey: "prc_get_retype_by_saleid_alt",
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
              value: item.AUTOID,
              label: item.TYPENAME
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
  //lay mo gioi cho man hinh gan kh vao  mo gioi
  getListSaleid: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;

    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_retype: "D",
      p_rerole: "ALL",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language
    };

    //console.log("getListSaleid  ", rest)
    let obj = {
      funckey: "prc_get_saleintlprofiles",
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
              value: item.TLID,
              label: item.TLNAME
            };
          });
          // console.log('result loai hinh tach value', resultdata)
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
  getListSaleidByTLID: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;

    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language
    };

    //console.log("getListSaleid  ", rest)
    let obj = {
      funckey: "prc_get_sale_by_tlid",
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
              value: item.TLID,
              // label: item.TLNAME
              label: `${item.TLID}-${item.TLFULLNAME}`
            };
          });
          sails.log('result length', result.length)
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
  syncuser: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;

    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language
    };

    //console.log("getListSaleid  ", rest)
    let obj = {
      funckey: "prc_sync_user_careby",
      bindvar: rest
    };
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        if (rs.EC == 0) {
          let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          // console.log('result loai hinh tach value', resultdata)
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
  updateSaleCustomers: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    //console.log('req.session.userinfo',req.session.userinfo)
    let rest = {
      p_refacctno: data.refacctno, //???
      p_reftype: data.retype,
      p_saleid: data.saleid,
      p_saleid_old: data.saleid_old,
      p_saleacctno: data.saleacctno,
      p_rerole: data.rerole,
      p_reproduct: data.reproduct,
      p_fullname: data.fullname,
      pv_action: "EDIT",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language,
      pv_objname: data.objname,
      MODELNAME: "move_sale_customers_approve"
    };
    //console.log("hihi update role  ", rest)
    let obj = {
      model: rest
    };
    processingserver.updatemodel(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        //console.log('xxx',rs)
        rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, data.language);
        return res.send(rs);
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  deletecustomerregsale: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    //console.log('req.session.userinfo',req.session.userinfo)
    let rest = {
      p_refacctno: data.refacctno, //???
      p_saleacctno: data.saleacctno,
      p_saleid: data.saleid,
      p_fullname: data.fullname,
      pv_action: "C",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language,
      pv_objname: data.objname,
      MODELNAME: "delete_customerregsale"
    };
    //console.log("hihi update role  ", rest)
    let obj = {
      model: rest
    };
    processingserver.updatemodel(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        //console.log('xxx',rs)
        rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, data.language);
        return res.send(rs);
      } catch (error) {
        rs.EM = "Lỗi client gọi api";
        rs.EC = -1000;
        return res.send(rs);
      }
    });
  },
  // updateSaleCustomers: async function (req, res) {
  //   let data = req.body;
  //   let { TLID, ROLECODE } = req.session.userinfo;
  //   //console.log('req.session.userinfo',req.session.userinfo)
  //   let rest = {
  //     p_refacctno: data.refacctno, //???
  //     p_reftype: data.retype,
  //     p_saleid: data.saleid,
  //     p_saleacctno: data.saleacctno,
  //     p_rerole: data.rerole,
  //     p_reproduct: data.reproduct,      
  //     p_fullname: data.fullname,
  //     pv_action: "EDIT",
  //     p_tlid: TLID,
  //     p_role: ROLECODE,
  //     p_language: data.language,
  //     pv_objname: data.objname,
  //     MODELNAME: "move_sale_customers"
  //   };
  //   //console.log("hihi update role  ", rest)
  //   let obj = {
  //     model: rest
  //   };
  //   processingserver.updatemodel(obj, async function (err, rs) {
  //     if (err) {
  //       return res.send(Utils.removeException(err));
  //     }
  //     try {
  //       //console.log('xxx',rs)
  //       rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, data.language);
  //       return res.send(rs);
  //     } catch (error) {
  //       rs.EM = "Lỗi client gọi api";
  //       rs.EC = -1000;
  //       return res.send(rs);
  //     }
  //   });
  // },
  deleteSaleCustomers: function (req, res) {
    let data = req.body;
    //console.log('data delete: ', data)
    let { TLID, ROLECODE } = req.session.userinfo;
    data = {
      p_refacctno: "",
      p_reftype: data.retype,
      p_saleid: data.saleid,
      p_saleacctno: data.saleacctno,
      p_rerole: data.rerole,
      p_reproduct: data.reproduct,
      pv_action: "ADD",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language,
      pv_objname: data.objname
    };

    data.MODELNAME = "sale_customers";
    data = commonUtil.convertPropsNullToEmpty(data);
    let obj = { model: data };
    let language = data.pv_language;
    processingserver.deletemodel(obj, async function (err, rs) {
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
  //-----------------Gan sale - RE003-------------------
  //lay ma mo gioi
  getsaleacctno: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;

    //console.log('req.session.userinfo',req.session.userinfo)
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_retype: "D",
      p_rerole: "ALL",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language
    };
    //console.log("getBrgrpBymbidAreaid  ", rest)
    let obj = {
      funckey: "prc_get_saleintlprofiles",
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
              label: item.TLFULLNAME_DESC
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
  //lay chi nhanh theo to chuc
  getBranchsBymbid: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;

    //console.log('req.session.userinfo',req.session.userinfo)
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_mbid: data.mbid,
      p_language: data.language
    };
    //console.log("getBrgrpBymbidAreaid  ", rest)
    let obj = {
      funckey: "prc_get_brgrp_bymbid",
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
  getListSaleBranchs: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_autoid: "",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language
    };

    let obj = {
      funckey: "prc_get_sale_members",
      bindvar: rest
    };
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        if (rs.EC == 0) {
          let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          let pv_sumRecord = result.length;
          let dataAll = result;
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
  //lay khu vuc theo to chuc
  getListUserByName: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    let rest = {
      p_fullname: data.p_fullname,
      p_idcode: data.p_idcode,
      p_refcursor: { dir: 3003, type: 2004 },
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language
    };

    let obj = {
      funckey: "prc_get_cfmast_by_fullname",
      bindvar: rest
    };
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        sails.log('prc_get_cfmast_by_fullname err :::', err)
        return res.send(Utils.removeException(err));
      }
      try {
        if (rs.EC == 0) {
          let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          let pv_sumRecord = result.length;
          let dataAll = result;
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
  getAreassBymbid: async function (req, res) {
    let data = req.body;

    //console.log('req.session.userinfo',req.session.userinfo)
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_mbid: data.mbid,
      p_type: "N",
      p_language: data.language
    };
    //console.log("getBrgrpBymbidAreaid  ", rest)
    let obj = {
      funckey: "prc_get_areas_bymbid",
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
              value: item.AREAID,
              label: item.AREANAME
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
  addListSaleBranchs: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    //console.log('req.session.userinfo',req.session.userinfo)
    let rest = {
      p_autoid: "", //so hieu tk giao dich
      p_saleacctno: data.saleacctno,
      p_mbcode: data.mbcode,
      p_areaid: data.areaid,
      p_brid: data.brid,
      p_ratecomm: data.ratecomm,
      p_ratealoc: data.ratealoc,
      p_effdate: data.effdate,
      p_expdate: data.expdate,
      p_description: "",
      pv_tlid: TLID,
      pv_role: ROLECODE,
      pv_action: "ADD",
      pv_language: data.language,
      pv_objname: data.objname,
      MODELNAME: "mt_sale_members"
    };
    let obj = {
      model: rest
    };
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
  // deleteListSaleGroups: function (req, res) {
  //   let data = req.body;
  //   sails.log('req.body::',req.body)
  //   let { TLID, ROLECODE } = req.session.userinfo;
  //   let datasubmit = {
  //     p_autoid: data.AUTOID,
  //     p_grllevel: data.GRLLEVEL,
  //     p_prgrpid: data.PRGRPID,
  //     p_fullname: data.FULLNAME,
  //     p_managerid: data.MANAGERID,

  //     // p_rateamt: data.RATEAMT,
  //     p_ratecomm: data.RATECOMM,
  //     p_effdate: data.EFFDATE,
  //     p_expdate: data.EXPDATE,
  //     p_groupthreshold: data.groupthreshold,
  //     p_issalesofself: data.issalesofself,
  //     pv_tlid: TLID,
  //     pv_role: ROLECODE,
  //     pv_action: "ADD",
  //     pv_language: data.language,
  //     pv_objname: data.objname,
  //     MODELNAME: "mt_sale_groups"
  //   };
  //   sails.log('datasubmit::',datasubmit)
  //   data = commonUtil.convertPropsNullToEmpty(data);
  //   let obj = { model: datasubmit };
  //   let language = datasubmit.pv_language;
  //   processingserver.deletemodel(obj, async function (err, rs) {
  //     sails.log('datasubmit::',datasubmit)
  //     if (err) {
  //       return res.send(Utils.removeException(err));
  //     }
  //     try {
  //       rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
  //       return res.send(rs);
  //     } catch (error) {
  //       rs.EM = "Lỗi client gọi api";
  //       rs.EC = -1000;
  //       return res.send(rs);
  //     }
  //   });
  // },
  updateListSaleBranchs: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    //console.log('req.session.userinfo',req.session.userinfo)
    let rest = {
      p_autoid: data.autoid, //so hieu tk giao dich
      p_saleacctno: data.saleacctno,
      p_mbcode: data.mbcode,
      p_areaid: data.areaid,
      p_brid: data.brid,
      p_ratecomm: data.ratecomm,
      p_ratealoc: data.ratealoc,
      p_effdate: data.effdate,
      p_expdate: data.expdate,
      p_description: "",
      pv_tlid: TLID,
      pv_role: ROLECODE,
      pv_action: "EDIT",
      pv_language: data.language,
      pv_objname: data.objname,
      MODELNAME: "mt_sale_members"
    };
    let obj = {
      model: rest
    };
    processingserver.updatemodel(obj, async function (err, rs) {
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

  deleteListSaleBranchs: function (req, res) {
    let data = req.body;

    let { TLID, ROLECODE } = req.session.userinfo;
    data = {
      p_autoid: data.AUTOID, //so hieu tk giao dich
      p_saleacctno: data.SALEACCTNO,
      p_mbcode: data.MBCODE,
      p_areaid: data.AREAID,
      p_brid: data.BRID,
      p_ratecomm: data.RATECOMM,
      p_ratealoc: data.RATEALOC,
      p_effdate: data.EFFDATE,
      p_expdate: data.EXPDATE,
      p_description: "",
      pv_tlid: TLID,
      pv_role: ROLECODE,
      pv_action: "DELETE",
      pv_language: data.language,
      pv_objname: data.objname,
      MODELNAME: "mt_sale_members"
    };

    data = commonUtil.convertPropsNullToEmpty(data);
    let obj = { model: data };
    let language = data.pv_language;
    processingserver.deletemodel(obj, async function (err, rs) {
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
  //lay chi nhanh theo khu vuc & to chuc
  getBrgrpBymbidAreaid: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    //console.log('req.session.userinfo',req.session.userinfo)
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_mbid: data.mbid,
      p_areaid: data.areaid,
      p_language: data.language
    };
    //console.log("getBrgrpBymbidAreaid  ", rest)
    let obj = {
      funckey: "prc_get_brgrp_bymbid_areaid",
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
  //-----------------gan mo gioi vao nhom - RE007 ------------------
  getListSaleManagers: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_saleid: "ALL",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language
    };

    let obj = {
      funckey: "prc_get_sale_managers",
      bindvar: rest
    };
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        // console.log(".....", rs)

        if (rs.EC == 0) {
          let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          let dataAll = result;
          let pv_sumRecord = result.length;
          //phan trang
          let { pagesize, page, keySearch, sortSearch } = req.body;
          //console.log(".....kq ", result)

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
  //ham thuc hien khi chuyen mo gioi vao nhom
  addSaleidToGroup: function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    rest = {
      p_grpid: data.grpid,
      p_saleid: data.saleid,
      p_saleacctno: data.saleacctno,
      pv_action: "ADD",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language,
      pv_objname: data.objname,
      MODELNAME: "sale_managers"
    };
    // console.log('obj  ', data.objname)
    // console.log('data ne: ',rest)
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

  // ------------------ quan li nhom - RE001 --------------------
  //lay truong nhom , lay mo gioi ben sale
  getLeader: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    //console.log('req.session.userinfo',req.session.userinfo)
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_tlidprofile: "ALL",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language
    };
    //console.log("truong nhom  ", rest)
    let obj = {
      funckey: "prc_get_infoname_sale_groups",
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
              value: item.TLID,
              label: item.TLNAME
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
  getListSaleGroups: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_autoid: "ALL",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language
    };
    //console.log("get listchange info cus", rest)
    let obj = {
      funckey: "prc_get_sale_groups",
      bindvar: rest
    };
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        // console.log(".....", rs)

        if (rs.EC == 0) {
          let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          let dataAll = result;
          let pv_sumRecord = result.length;
          //phan trang
          let { pagesize, page, keySearch, sortSearch } = req.body;

          if (keySearch)
            if (keySearch.length > 0)
              result = await Paging.find(result, keySearch);

          let numOfPages = Math.ceil(result.length / pagesize);

          //search theo tung cot
          if (sortSearch)
            if (sortSearch.length > 0)
              result = await Paging.orderby(result, sortSearch);
          result = await Paging.paginate(result, pagesize, page ? page : 1);
          delete rs.DT["p_refcursor"];
          var DT = {
            data: result,
            numOfPages: numOfPages,
            sumRecord: pv_sumRecord,
            dataAll: dataAll
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
  // addListSaleGroups: async function(req, res) {
  //   let data = req.body;
  //   let { TLID, ROLECODE } = req.session.userinfo;
  //   //console.log('req.session.userinfo',req.session.userinfo)
  //   let rest = {
  //     p_autoid: "",
  //     p_grllevel: data.grllevel,
  //     p_prgrpid: data.prgrpid,
  //     p_fullname: data.fullname,
  //     p_managerid: data.managerid,
  //     p_mindrevamt:"",
  //     p_minirevamt:"",
  //     p_rateamttyp:"",
  //     p_rateamt: data.rateamt,
  //     p_ratecomm: data.ratecomm,
  //     p_effdate: data.effdate,
  //     p_expdate: data.expdate,
  //     p_groupthreshold: data.groupthreshold,    
  //     pv_tlid: TLID,
  //     pv_role: ROLECODE,
  //     pv_action: "ADD",
  //     pv_language: data.language,
  //     pv_objname: data.objname,   

  //     MODELNAME: "mt_sale_groups"       
  //   };


  //   let obj = {
  //     model: rest
  //   };
  //   processingserver.createmodel(obj, async function(err, rs) {
  //     sails.log('rs:============',rs)
  //     if (err) {
  //       return res.send(Utils.removeException(err));
  //     }
  //     try {
  //       rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, data.language);
  //       //console.log("get checking rs  ", rs)
  //       return res.send(rs);
  //     } catch (error) {
  //       sails.log('error:======',error)
  //       rs.EM = "Lỗi client gọi api";
  //       rs.EC = -1000;
  //       return res.send(rs);
  //     }
  //   });
  // },
  addListSaleGroups: async function (req, res) {
    let data = {}
    let body = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;

    // console.log('req.session.userinfo',req.session.userinfo)   

    data.p_autoid = '0',
      data.p_grllevel = body.grllevel,
      data.p_prgrpid = body.prgrpid,
      data.p_fullname = body.fullname,
      data.p_branchid = body.branchid,
      data.p_managerid = body.managerid,
      data.p_issalesofself = body.issalesofself,
      data.p_mindrevamt = '0',
      data.p_minirevamt = '0',
      data.p_rateamttyp = '0',
      // data.p_rateamt = body.rateamt,
      data.p_ratecomm = body.ratecomm,
      data.p_effdate = body.effdate,
      data.p_expdate = body.expdate,
      data.p_groupthreshold = body.groupthreshold,
      p_issalesofself = data.issalesofself,
      data.pv_tlid = TLID,
      data.pv_role = ROLECODE,
      data.pv_action = "ADD",
      data.pv_language = body.language,
      data.pv_objname = body.objname,
      data.MODELNAME = "mt_sale_groups",
      data.p_refcursor = { dir: 3003, type: 2004 }
    let obj = {
      funckey: "prc_mt_sale_groups",
      bindvar: data
    }
    sails.log(data)
      ;
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        if (rs.EC == 0) {
          resultdata = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          return res.send({ resultdata });
        } else {
          sails.log('result error', rs)
          return res.send(rs);
        }
      } catch (error) {
        sails.log('error', error)
        return res.send(rs);
      }
    });
  },
  //lay thong tin ma nhom cap tren
  getInfolevelSaleGroups: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    //console.log('req.session.userinfo',req.session.userinfo)
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_cdval: data.cdval,
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language
    };
    //console.log("get  ", rest)
    let obj = {
      funckey: "prc_get_infolevel_sale_groups",
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
              value: item.AUTOID,
              label: item.FULLNAME
            };
          });
          //console.log('result loai hinh tach value - ktach', result, resultdata)
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
  updateListSaleGroups: async function (req, res) {
    let data = req.body;
    data.mindrevamt = "";
    data.minirevamt = "";
    data.rateamttyp = "";
    let { TLID, ROLECODE } = req.session.userinfo;
    //console.log('req.session.userinfo',req.session.userinfo)
    let rest = {
      p_autoid: data.autoid,
      p_grllevel: data.grllevel,
      p_prgrpid: data.prgrpid,
      p_fullname: data.fullname,
      p_managerid: data.managerid,
      p_branchid: data.branchid,
      p_mindrevamt: "0",
      p_minirevamt: "0",
      p_rateamttyp: "0",
      // p_rateamt: data.rateamt,
      p_ratecomm: data.ratecomm,
      p_effdate: data.effdate,
      p_expdate: data.expdate,
      p_groupthreshold: data.groupthreshold,
      p_issalesofself: data.issalesofself,
      pv_tlid: TLID,
      pv_role: ROLECODE,
      pv_action: "EDIT",
      pv_language: data.language,
      pv_objname: data.objname,
      MODELNAME: "mt_sale_groups"
    };
    //console.log("hihi update role  ", rest)
    let obj = {
      funckey: "prc_mt_sale_groups",
      bindvar: rest
    };
    processingserver.callAPI(obj, async function (err, rs) {
      sails.log(rs)
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        if (rs.EC == 0) {
          resultdata = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          return res.send({ resultdata });
        } else {
          return res.send(rs);
        }
      } catch (error) {
        return res.send(rs);
      }
    });
  },

  deleteListSaleGroups: function (req, res) {
    let data = req.body;

    let { TLID, ROLECODE } = req.session.userinfo;
    data = {
      p_autoid: data.AUTOID,
      p_grllevel: data.GRLLEVEL,
      p_prgrpid: data.PRGRPID,
      p_fullname: data.FULLNAME,
      p_managerid: data.MANAGERID,
      p_mindrevamt: "",
      p_minirevamt: "",
      p_rateamttyp: "",
      // p_rateamt: data.RATEAMT,
      p_ratecomm: data.RATECOMM,
      p_effdate: data.EFFDATE,
      p_expdate: data.EXPDATE,
      p_groupthreshold: data.groupthreshold,
      p_issalesofself: data.issalesofself,
      p_branchid: data.BRANCHID,
      pv_tlid: TLID,
      pv_role: ROLECODE,
      pv_action: "ADD",
      pv_language: data.language,
      pv_objname: data.objname,
      MODELNAME: "mt_sale_groups"
    };

    data = commonUtil.convertPropsNullToEmpty(data);
    let obj = { model: data };
    let language = data.pv_language;
    processingserver.deletemodel(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        if (rs.EC == 0) {
          resultdata = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          return res.send({ resultdata });
        } else {
          return res.send(rs);
        }
      } catch (error) {
        return res.send(rs);
      }
    });
  },
  // -----SIPs --------------

  getListTasip: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_spid: "ALL",
      p_custodycd: "ALL",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language
    };
    let obj = {
      funckey: "prc_get_tasip",
      bindvar: rest
    };
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        if (rs.EC == 0) {
          let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          let pv_sumRecord = result.length;
          let sum = result;
          //phan trang

          let { pagesize, page, keySearch, sortSearch } = req.body;

          if (keySearch)
            if (keySearch.length > 0)
              result = await Paging.find(result, keySearch);

          let numOfPages = Math.ceil(result.length / pagesize);

          //search theo tung cot
          if (sortSearch)
            if (sortSearch.length > 0)
              result = await Paging.orderby(result, sortSearch);
          result = await Paging.paginate(result, pagesize, page ? page : 1);
          delete rs.DT["p_refcursor"];
          var DT = {
            data: result,
            numOfPages: numOfPages,
            sumRecord: pv_sumRecord,
            sum
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

  //ham thuc hien khi chap nhan

  acceptSIPs: function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    rest = {
      p_spid: data.spid,
      p_codeid: data.codeid,
      p_actiontype: "ADD",
      p_custodycd: data.custodycd,
      p_fullname: data.fullname,
      p_amt: data.amt,
      p_symbol: data.symbol,
      pv_action: "ADD",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language,
      pv_objname: data.objname,
      MODELNAME: "tasip"
    };
    //console.log('obj  ', data.objname)
    // console.log('data ne accept: ',rest)
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
  denySIPs: function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    rest = {
      p_spid: data.spid,
      p_codeid: data.codeid,
      p_actiontype: "DELETE",
      p_custodycd: data.custodycd,
      p_fullname: data.fullname,
      p_amt: data.amt,
      p_symbol: data.symbol,
      pv_action: "DELETE",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language,
      pv_objname: data.objname,
      MODELNAME: "tasip"
    };
    //console.log('obj  ', data.objname)
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
  //quan li user theo nhom nsd

  getListGrUser: async function (req, res) {
    let data = req.body;
    let { TLID, ROLECODE } = req.session.userinfo;
    let rest = {
      p_refcursor: { dir: 3003, type: 2004 },
      p_grpid: "ALL",
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language
    };
    let obj = {
      funckey: "prc_get_tlgrpusers",
      bindvar: rest
    };
    processingserver.callAPI(obj, async function (err, rs) {
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        if (rs.EC == 0) {
          let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          let pv_sumRecord = result.length;
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
          var DT = {
            data: result,
            numOfPages: numOfPages,
            sumRecord: pv_sumRecord
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
  withdraw_brocker_0008: async function (req, res) {
    let data = req.body;
    data.mindrevamt = "";
    data.minirevamt = "";
    data.rateamttyp = "";
    let { TLID, ROLECODE } = req.session.userinfo;
    //console.log('req.session.userinfo',req.session.userinfo)
    let rest = {
      p_oldgrpid: data.grpid,
      p_saleid: data.saleid,
      p_desc: '',
      p_saleacctno: data.saleacctno,
      pv_action: 'ADD',
      p_tlid: TLID,
      p_role: ROLECODE,
      p_language: data.language,
      pv_objname: data.objname,
      MODELNAME: "withdraw_brocker_0008"
    };
    //console.log("hihi update role  ", rest)
    let obj = {
      funckey: "prc_withdraw_brocker_0008",
      bindvar: rest
    };
    processingserver.callAPI(obj, async function (err, rs) {
      sails.log(rs)
      if (err) {
        return res.send(Utils.removeException(err));
      }
      try {
        if (rs.EC == 0) {
          //resultdata = ConvertData.convert_to_Object(rs.DT.p_refcursor);
          return res.send({ rs });
        } else {
          return res.send(rs);
        }
      } catch (error) {
        return res.send(rs);
      }
    });
  },
};
