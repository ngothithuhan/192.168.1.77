/**
 * ReportController
 *
 * @description :: Server-side logic for managing Reports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var ConvertData = require('../services/ConvertData');
var processingserver = require('../commonwebuser/ProcessingServer');
var RestfulHandler = require('../common/RestfulHandler')
var Ioutput = require('../common/OutputInterface.js');
var path = require('path');
var LogHelper = require(path.resolve(__dirname, "../common/LogHelper"));
var fs = require('fs');
// var XLSX = require('xlsx');
// const key = 'fundserv-giang.ngo-author';
// var request = require('request');
// Create an encryptor:
// var Encryptor = require('simple-encryptor');
// import encryptor from 'simple-encryptor'
// const encryptor = new Encryptor(key);
// function Workbook() {
//     if (!(this instanceof Workbook))
//         return new Workbook()

//     this.SheetNames = []

//     this.Sheets = {}
// }

// Create the directory if it does not exist
// var fs = require('fs');
// if (!fs.existsSync(sails.config.WEBUSER_REPORT_PATH)) {
//     fs.mkdirSync(sails.config.WEBUSER_REPORT_PATH);
// }
// if (!fs.existsSync(sails.config.WEBUSER_REPORT_PATH + '/Reports')) {
//     fs.mkdirSync(sails.config.WEBUSER_REPORT_PATH + '/Reports');
// }
module.exports = {
    getListReport: function (req, res) {
        let data = req.body;
        let result1 = {}
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlname: data.p_tlname,
            p_reflogid: data.p_reflogid,
            p_objname: data.p_objname,
            p_tlid: TLID,
            p_language: data.language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_report_focmdcode4report",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    delete rs.DT["p_refcursor"];

                    rs.DT.data = result;
                    for (let i = 0; i < data.AllKeyLang.length; i++) {
                        result1["result" + data.AllKeyLang[i]] = result.map((item) => {
                            let label = item['DESCRIPTION_' + data.AllKeyLang[i].toUpperCase()] ? item['DESCRIPTION_' + data.AllKeyLang[i].toUpperCase()] : item['DESCRIPTION']
                            return {
                                value: item.RPTID,
                                label: item.RPTID + '-' + label,
                                type: item.EXPDATATYPE,
                                cmdtype: item.CMDTYPE
                            }
                        })
                    }
                    return res.send(result1);
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
    getReportParams: async function (req, res) {
        try {
            var reportParams = await RPTFIELDS.find({ OBJNAME: req.body.RPTID });
            res.send(Ioutput.success(reportParams));
        } catch (error) {
            sails.log.error(error);
            return res.send(Ioutput.errServer(error));
        }
    },
    createReportRequest: function (req, res) {
        try {
            var data = {};
            let { TLID, ROLECODE, USERID } = req.session.userinfo;
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
            data.p_tlid = TLID;
            data.p_tlname = USERID;
            data.p_role = ROLECODE;
            data = { ...data, ...req.body };

            //data.p_rptparam = '(:l_refcursor,PV_TLID=>\'' + data.p_tlid + '\',PV_BRID=>\'' + data.DBCODE + '\',PV_ROLECODE=>\'' + data.p_role + '\',' + data.p_rptparam + ')';

            let obj =
            {
                "funckey": "prc_report_create_rpt_request",
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
    getReportRequest: function (req, res) {
        try {
            var data = {};
            let { TLID, ROLECODE, USERID } = req.session.userinfo;


            data.p_refcursor = { dir: 3003, type: 2004 };
            data.p_tlid = TLID;
            data.p_tlname = USERID;
            data.p_role = ROLECODE;
            // data.AUTOID = '';
            //  data = RestfulHandler.addSessionInfo(data, req);
            data.p_reflogid = '';
            // data.CODEID = '';
            // data.TRADINGDATE = '';
            //  data.RPTID = '';
            data = { ...data, ...req.body }
            // sails.log.info('getReportRequest: encryptor', encryptor.toString());

            let obj =
            {
                "funckey": "prc_report_get_rpt_request",
                bindvar: data
            }

            processingserver.callAPI(obj, async function (err, rs) {

                if (err) {
                    return res.send(Utils.removeException(err));
                }
                try {

                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    delete rs.DT["p_refcursor"];

                    rs.DT.data = result;

                    rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, 'Vie');
                    return res.send(rs);

                } catch (error) {
                    rs.EM = 'Lỗi client gọi api';
                    rs.EC = -1000;
                    return res.send(rs)
                }
            });
        } catch (error) {
            sails.log.error(error);
            return res.send(Ioutput.errServer(error));
        }
    },

    getDropdownDataField: async function (req, res) {
        try {

            let { TLID, ROLECODE, USERID } = req.session.userinfo;
            let dataResult = {}
            var DEFNAME = req.body.DEFNAME;
            var OBJNAME = req.body.OBJNAME;
            var input = req.body.valueall;
            var rptfield = await RPTFIELDS.findOne({ DEFNAME, OBJNAME })
            var data = { ...rptfield };

            var Gettagfields = ''


            if (!rptfield) {
                return res.send([]);
            }
            if (rptfield.TAGFIELD && rptfield.TAGFIELD != '') Gettagfields = rptfield.TAGFIELD
            var searchcode = rptfield.LLIST;
            var defval = rptfield.DEFVAL
            if (input) {
                Object.keys(input).map(function (node, index) {

                    if (node != 'undefined' && node != '') {

                        searchcode = searchcode.split('$' + node).join(input[node] == 'ALL' ? '%' : input[node]);

                    }
                })
            }
            var KEYFILTER = req.body.KEYFILTER ? req.body.KEYFILTER : "";
            var VALUEFILTER = req.body.KEYFILTER ? req.body.VALUEFILTER : "";
            var PV_KEYFILTER = KEYFILTER.split(',');
            var PV_VALUEFILTER = VALUEFILTER.split(',');
            let pv_searchcode = searchcode;
            // sails.log.debug("getDropdownDataField.:p_querry.old=", pv_searchcode)
            if (PV_KEYFILTER && PV_KEYFILTER != "" && PV_KEYFILTER.length > 0) {
                for (var i = 0; i < PV_KEYFILTER.length; i++) {
                    var temp_VALUEFILTER = PV_VALUEFILTER[i] ? PV_VALUEFILTER[i] : ""
                    // temp_VALUEFILTER = "VCB0115032019"
                    data[PV_KEYFILTER[i]] = temp_VALUEFILTER
                    var re = new RegExp((':' + PV_KEYFILTER[i]), 'g');
                    if (temp_VALUEFILTER.toUpperCase() == "ALL") temp_VALUEFILTER = ''
                    // sails.log.debug("getDropdownDataField.:PV_KEYFILTER.re===", i, PV_KEYFILTER[i], re, temp_VALUEFILTER)
                    pv_searchcode = pv_searchcode.replace(re, temp_VALUEFILTER);
                    re = new RegExp((':date_' + PV_KEYFILTER[i]), 'g');
                    pv_searchcode = pv_searchcode.replace(re, "'" + temp_VALUEFILTER + "'");
                    // sails.log.debug("getDropdownDataField0.:pv_searchcode===",i, pv_searchcode)
                    //let str = ':' + PV_KEYFILTER[i]
                    //searchcode = searchcode.split(str).join(temp_VALUEFILTER);
                }
            }
            sails.log.debug("getDropdownDataField.:p_querry.new=", pv_searchcode)
            if (pv_searchcode && pv_searchcode != "") {
                pv_searchcode = pv_searchcode.split('$TELLERID').join(TLID);
                pv_searchcode = pv_searchcode.split('$USERNAME').join(USERID);
            }
            // var searchcode = searchcode.replace('$' + input.type, input.conditionvalue);
            data.p_refcursor = { dir: 3003, type: 2004 };
            //data = RestfulHandler.addSessionInfo(data, req);
            data.p_querry = pv_searchcode;
            data.p_tlid = TLID
            data.p_tlname = req.body.TLNAME
            data.p_role = ROLECODE
            data.p_reflogid = ''

            let obj =
            {
                "funckey": "prc_report_get_llist_data",
                bindvar: data
            }
            processingserver.callAPI(obj, function (err, rs) {

                if (err) {
                    return res.send(Utils.removeException(err));
                }
                try {
                    if (rs.EC == 0) {
                        let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                        for (let i = 0; i < req.body.AllKeyLang.length; i++) {
                            dataResult["result" + req.body.AllKeyLang[i]] = result.map((item) => {
                                return {
                                    value: item.VALUE,
                                    label: item[req.body.AllKeyLang[i].toUpperCase() + "_DISPLAY"] ? item[req.body.AllKeyLang[i].toUpperCase() + "_DISPLAY"] : item["DISPLAY"]
                                }
                            })

                        }


                        return res.send({ dataResult, defval, Gettagfields });
                    } else {
                        return res.send(rs);
                    }
                } catch (error) {

                    rs.EM = 'Lỗi client gọi api';
                    rs.EC = -1000;
                    return res.send(rs)
                }
            });
        } catch (error) {
            sails.log.error(error);
            return res.send([]);
        }
    },
    searchOrder: function (req, res) {
        try {
            var data = {};
            data.ret = { dir: 3003, type: 2004 };
            data = RestfulHandler.addSessionInfo(data, req);
            data.TRADINGID = '';
            data.REFlOGID = '';
            data.RPTID = '';
            data = { ...data, ...req.body }
            let obj =
            {
                "funckey": "FOPKS_REPORT.PRC_GET_REPORT",
                bindvar: data
            }
            processingserver.callAPI(obj, async function (err, rs) {
                if (rs.EC === 0) {
                    var result = ConvertData.convert_to_Object(rs.DT.ret);
                    // await ReportOrder.destroy({TLID:data.TLID});
                    // await ReportOrder.create(result);

                    // let length = await ReportOrder.count({TLID:data.TLID});
                    // let { pagesize, page } = req.body;
                    // pagesize = parseInt(pagesize);
                    // let numOfPages = Math.ceil(length / pagesize);
                    // let resultfilter = await ReportOrder.find({ TLID: data.TLID }).paginate({ limit: pagesize, page })
                    // let resultFromat = resultfilter.map((item)=>{
                    //      delete item['id']
                    //      delete item['createdAt']
                    //      delete item['updatedAt']
                    //      return(item)


                    // })
                    rs.DT = result
                }
                return res.send(rs);
            });
        } catch (error) {
            sails.log.error(error);
            return res.send(Ioutput.errServer(error));
        }
    },
    filterOrder: async function (req, res) {
        try {
            var data = {};
            data = RestfulHandler.addSessionInfo(data, req);
            var keySearch = Paging.generate_keySearch(req.body)
            let dataCount = { ...keySearch }
            // chèn thêm điều kiện find dữ liệu theo trường SPID
            dataCount.where.TLID = data.TLID;
            // tính số  bản ghi để  phân trang
            let length = await ReportOrder.count(dataCount)
            let { pagesize, page } = req.body;
            pagesize = parseInt(pagesize);
            let numOfPages = Math.ceil(length / pagesize);
            let resultfilter = await ReportOrder.find(keySearch).where({ TLID: data.TLID }).paginate({ limit: pagesize, page: req.body.page })
            res.send(Ioutput.success({ data: resultfilter, numOfPages: numOfPages }));
        } catch (error) {
            return res.send(Ioutput.errServer(error));

        }
    },

    downloadReport: function (req, res) {
        try {
            var extension = req.query.extension;
            let { TLID, ROLECODE, USERID } = req.session.userinfo;

            var data = {};
            data.p_refcursor = { dir: 3003, type: 2004 };
            data.p_tlid = TLID;
            data.p_tlname = USERID;
            data.p_role = ROLECODE;
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

                try {
                    if (err) {
                        sails.log.error("downloadReport.:Error", obj, err);
                        return res.send(Ioutput.errServer(err));
                    } else {
                        if (!rs || !rs.DT) {
                            sails.log.error("downloadReport.:Error", obj, "Cannot got result from BPS or null DT", rs);
                            return res.send(Ioutput.errServer({ EC: -2, EM: "Empty data" }));
                        }
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

                            sails.log.info('downloadReport: arrLink', arrLink, 'link', link);

                            if (link) {
                                // if (result[0].CMDTYPE == 'E') {  //bao cao dc gen ra tren webuser
                                //     var link = sails.config.WEBUSER_REPORT_PATH + link.replace(/\\/g, '/');
                                //     res.download(link, function (err) {
                                //         if (err) {
                                //             return res.serverError(err);
                                //         } else {
                                //             return res.ok();
                                //         }
                                //     })
                                // } else { //bao cao dc gen ra bang service mix tren server app
                                var link = link.replace(/\\/g, '/');
                                // request({
                                //     url: sails.config.URL_BPS + 'Report/downloadReport',
                                //     method: 'POST',
                                //     json: { link: link }
                                // }).pipe(res);
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
    submitCA: function (req, res) {
        try {
            let data = req.body;
            data = RestfulHandler.addSessionInfo(data, req);
            // data.AUTOID = encryptor.decrypt(req.body.AUTOID);
            data.AUTOID = req.body.AUTOID;
            data.TYPE = req.body.RPTID;
            data.DESC = '';
            data.ACTION = req.body.ACTION;
            // data.REFLOGID = '';
            let obj =
            {
                "funckey": "FOPKS_SR.PRC_CONFIRM",
                bindvar: data
            }
            processingserver.callAPI(obj, async function (err, rs) {
                if (err) {
                    sails.log.error(err);
                    return res.send(Ioutput.errServer(err));
                }
                return res.send(rs);
            })
        } catch (error) {
            sails.log.error(error);
            return res.send(Ioutput.errServer(error));
        }
    },
    createReportEP0001: function (req, res) {
        try {
            var data = {};
            let { TLID } = req.session.userinfo;
            var data = req.body;
            data.pv_tlid = TLID;
            data.pv_tlname = '';
            data.ret = { dir: 3003, type: 2004 }

            let obj =
            {
                "funckey": "prc_report_ep0001",
                bindvar: data
            }
            processingserver.callAPI(obj, async function (err, rs) {

                let result = ConvertData.convert_to_Object(rs.DT.ret);
                delete rs.DT["ret"];
                rs.DT.data = result;

                return res.send(rs);
            });
        } catch (error) {
            sails.log.error(error);
            return res.send(Ioutput.errServer(error));
        }
    },
    createReportSpecial: function (req, res) {
        try {

            var data = req.body.outParams;
            var funcname = "prc_report_" + req.body.RPTID.toLowerCase()
            let { TLID, USERID } = req.session.userinfo;
            data.pv_tlid = TLID;
            data.pv_tlname = USERID;
            data.ret = { dir: 3003, type: 2004 }
            data.ret1 = { dir: 3003, type: 2004 }

            let obj = {
                ...req.body,
                "funckey": funcname,
                bindvar: data
            }
            serviceTest.requsetPost(obj, 'Report/createReportSpecial', function (err, rs) {
                if (err) {
                    sails.log(err)
                    res.send(Ioutput.errServer(err));
                }
                try {
                    //     let result = ConvertData.convert_to_Object(rs.DT.ret);
                    //     let result1 = ConvertData.convert_to_Object(rs.DT.ret1);

                    //     var arraySpecial = req.body.arraySpecial
                    //     result.map(function (node, index) {
                    //         Object.keys(node).map(function (node1, index) {
                    //             if (isNaN(node[node1]) == false && node[node1] != null && arraySpecial.includes(node1) == false && node[node1] != '') {
                    //                 node[node1] = parseFloat(node[node1])
                    //             }
                    //         })
                    //     })
                    //     const wb = new Workbook()

                    //     const ws = XLSX.utils.json_to_sheet(result)
                    //     wb.SheetNames = [req.body.RPTID + '_' + result1[0].FILEID]
                    //     // wb.Sheets[''] = ws
                    //     wb.Sheets[req.body.RPTID + '_' + result1[0].FILEID] = ws;
                    //     const wbout = XLSX.write(wb, { raw: true, header: 1, bookType: 'xlsx', bookSST: true, type: 'binary', Props: { Author: "Fss" } })
                    //     fs.writeFileSync(path.join(sails.config.WEBUSER_REPORT_PATH + 'Reports', req.body.RPTID + '_' + result1[0].FILEID + '.' + req.body.EXPTYPE), wbout, 'binary')
                    //     return res.send(rs);
                    // } catch (error1) {
                    //     sails.log.error(error1);
                    //     return res.send(Ioutput.errServer(error1));
                    sails.log.info(LogHelper.End("createReportSpecial:::", obj, rs));
                    res.send(rs);
                } catch (error) {
                    sails.log.error(LogHelper.End("createReportSpecial:error::", obj, error));
                    res.send(Ioutput.errServer(error));
                }


            });
        } catch (error) {
            sails.log.error(LogHelper.End("createReportSpecial:error::",obj,error));
            return res.send(Ioutput.errServer(error));
        }
    },
    createReportRequest_manageracct: function (req, res) {
        try {
            var data = {};
            let { TLID, ROLECODE, USERID } = req.session.userinfo;
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
            data.p_tlid = TLID;
            data.p_tlname = USERID;
            data.p_role = ROLECODE;
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
    getReportRequestVSD: function (req, res) {
        try {
            var data = {};
            let { TLID, ROLECODE, USERID } = req.session.userinfo;

            data.p_refcursor = { dir: 3003, type: 2004 };
            data.p_tlid = TLID;
            data.p_tlname = USERID;
            data.p_role = ROLECODE;
            data.p_reflogid = '';
            data.msgid = '';
            data = { ...data, ...req.body }

            let obj =
            {
                "funckey": "prc_report_vsd",
                bindvar: data
            }

            processingserver.callAPI(obj, async function (err, rs) {

                if (err) {
                    return res.send(err);
                }
                try {

                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    delete rs.DT["p_refcursor"];

                    rs.DT.data = result;

                    rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, 'Vie');
                    return res.send(rs);

                } catch (error) {
                    sails.log('error :::', error)
                    rs.EM = 'Lỗi client gọi api';
                    rs.EC = -1000;
                    return res.send(rs)
                }
            });
        } catch (error) {
            sails.log.error(error);
            return res.send(Ioutput.errServer(error));
        }
    },
    downloadreportvsd: function (req, res) {
        try {
            var extension = req.query.extension;
            let { TLID, ROLECODE, USERID } = req.session.userinfo;

            var data = {};
            data.p_refcursor = { dir: 3003, type: 2004 };
            data.p_tlid = TLID;
            data.p_tlname = USERID;
            data.p_role = ROLECODE;
            data.p_reflogid = '';
            //  data = { ...data, ...req.body }
            data.msgid = req.query.AUTOID;

            let obj =
            {
                "funckey": "prc_report_vsd",
                bindvar: data
            }
            processingserver.callAPI(obj, async function (err, rs) {

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
                            var link = result[0].DOWNLOADPATH;
                            sails.log('link after : ', link);
                            sails.log('link after 2 : ', sails.config.URL_BPS + 'Report/downloadReport');
                            // request({
                            //     url: sails.config.URL_BPS + 'Report/downloadReport',
                            //     method: 'POST',
                            //     json: { link: link }
                            // }).pipe(res);
                            serviceTest.pipeRequest({
                                action: 'Report/downloadReport',
                                method: 'POST',
                                json: { link: link }
                            }, res);

                        } else {
                            sails.log.error('downloadReport error: not found link :result[0].REFRPTFILE', result[0].REFRPTFILE);
                            return res.send(Ioutput.errMessage("Không tìm thấy file " + result[0].MSGID, null));
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
    }
};

