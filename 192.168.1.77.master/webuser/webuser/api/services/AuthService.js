const SpecOBJ = ["/nav/getlistnavprice", "/account/gettradingdate", "/fund/getlistnav", "/fund/getlistexpectnav", "/fund/deletemarketinfo", "/fund/addnav", "/fund/updatenav",
    "/fund/getsoduccqexpectnav", "/userfunc/getmenu", "/nav/getcompanycontact", "/account/search_all",
    "/allcode/getlist", "/allcode/search_all_funds", "/allcode/search_all_funds_with_all", "/allcode/get_swsymbol",
    "/order/gettradingdate_bycodeid", "/order/getfacctnobysymbol", "/account/getexperience", "/account/getruiro", "/account/getjob", "/account/getinvesttime",
    "/account/getidtype", "/account/getbankbranch", "/fund/get_rptfile_bycustodycd", "/account/getcaptcha",
    "/account/getcareby4tlid", "/account/checkoldaccount", "/report/createreportrequest_manageracct",
    "/account/checkgeneralinfomain", "/account/checkgeneralinfoauth", "/account/checkgeneralinfocontact",
    "/account/checkgeneralinfofatca", "/fund/getlistrefundbyorderadd", "/account/search_all_fullname", "/fund/update_sale_calculator",
    "/fund/getlistclasscd", "/fund/getnav", "/user/getsaleretype", "/fund/getlistrole_byretype",
    "/user/getinfolevelsalegroups", "/user/getleader", "/user/getretypebysaleid", "/user/getareassbymbid",
    "/user/getbrgrpbymbidareaid", "/user/gettlprofiles", "/fund/getlistsale_groups", "/user/getretypebysaleid", "/user/getlistsaleid",
    "/fund/getlistsale_roles", "/fund/getlistsaleintlprofiles", "/fund/getlistretype_by_saleid", "/fund/getlistobjectkpi",
    "/transactions/rejrectsysprocess", "/transactions/search", "/transactions/approvesysprocess", "/fund/getlisttx", "/fund/getlistmt",
    "/fund/getlistbrgrp_bymbid_areaid", "/fund/getlistareas_bymbid", "/fund/getlistmember_bytlid", "/fund/getlistbrgrp_bymbid",
    "/fund/getlisttlprofiles_notin_grp", "/fund/getlisttlprofiles_in_grp", "/allcode/search_all_mb", "/fund/getlisttraddingsession",
    "/fund/getlistfeeassignfeeid", "/fund/getlistobjecttype", "/fund/getlistobject", "/report/", "/fund/get_tlprofiles_bytlname", "/order/getSessionInfo",
    "/fund/getlistscopekpi", "/fund/getlistalert4account", "/fund/getlisttxhistory", "/fund/getlistmthistory",
    "/accountinfo/changecustomerpassword", "/accountinfo/changecustomerusername",
    "/account/get_rptfile_bycustodycd", "/account/createreportrequest_manageracct", "/account/downloadreport",
    "/account/getAccountIdsByUsername", "/accountinfo/getaccountinfo_by_username",
    "/fund/move_sale_managers", "/user/withdraw_brocker_0008", "/user/getListSaleidByTLID", "/account/getcfmastbycustid",
    "/session/setLanguage", "/session/getLanguage", "/account/prc_internal_account", "/account/prc_get_internal_account",
    "/allcode/search_all_salemember", "/account/approveoriginalfile", "/user/getretypebysaleidalt",
    "/account/prc_company_account", "/account/prc_get_company_account", "/fund/getlistfeetypeid",
    "/fund/search_all_show_fullname", "/account/get_last_txnum_edit", "/user/syncuser",
    "/group/getlistgroup2", "/fund/get_listgrp_notin", "/fund/get_listgrp_in", "/fund/addtlgrpusers_list_foruser", "/session/logOut", "/user/getListUserByName", "/account/getsalebycustodycd", "/fund/getbankinfo",
    "/fund/getlistoderfromBank", "/order/getlistsip",


    "/account/getlist",

    "/otp/gettimeotp",
    "/account/validateCaptCha",
    "/accountinfo/changeAuthenticationMethod",
];
const OBJMAP = {
    //dat lenh thuong
    "/user/getListUserByName/PLACEORDER": "PLACEORDER",
    "/fund/getbankinfo/PLACEORDER": "PLACEORDER",
    //import file
    "/file/uploadtest/CCQIMP": "CCQIMP",
    "/file/getfilemaster/CCQIMP": "CCQIMP",
    "/file/pre_check_upload/CCQIMP": "CCQIMP",
    "/file/after_check_upload/CCQIMP": "CCQIMP",
    "/file/getimportdata/CCQIMP": "CCQIMP",
    "/file/check_fileimport/CCQIMP": "CCQIMP",
    //import nguoi su dung
    "/file/getfilemaster/IMPUSERS": "IMPUSERS",
    "/file/check_fileimport/IMPUSERS": "IMPUSERS",
    "/file/pre_check_upload/IMPUSERS": "IMPUSERS",
    "/file/after_check_upload/IMPUSERS": "IMPUSERS",
    "/file/uploadtest/IMPUSERS": "IMPUSERS",
    "/file/getimportdata/IMPUSERS": "IMPUSERS",

    "/file/uploadtest/IVCASHBACK": "IVCASHBACK",
    "/file/getfilemaster/IVCASHBACK": "IVCASHBACK",
    "/file/pre_check_upload/IVCASHBACK": "IVCASHBACK",
    "/file/after_check_upload/IVCASHBACK": "IVCASHBACK",
    "/file/getimportdata/IVCASHBACK": "IVCASHBACK",
    "/file/check_fileimport/IVCASHBACK": "IVCASHBACK",

    "/file/uploadtest/CUSTOMERIMP": "CUSTOMERIMP",
    "/file/getfilemaster/CUSTOMERIMP": "CUSTOMERIMP",
    "/file/pre_check_upload/CUSTOMERIMP": "CUSTOMERIMP",
    "/file/after_check_upload/CUSTOMERIMP": "CUSTOMERIMP",
    "/file/getimportdata/CUSTOMERIMP": "CUSTOMERIMP",
    "/file/check_fileimport/CUSTOMERIMP": "CUSTOMERIMP",

    "/order/preadd/PLACEORDER": "PLACEORDER",
    "/order/add/PLACEORDER": "PLACEORDER",
    "/order/update/PLACEORDER": "PLACEORDER",
    "/order/cancel/PLACEORDER": "PLACEORDER",
    "/balance/getfundbalance/PLACEORDER": "PLACEORDER",
    "/balance/getfundbalancedetails/PLACEORDER": "PLACEORDER",
    "/account/get_generalinfor/PLACEORDER": "PLACEORDER",
    "/account/sync_cfauth/PLACEORDER": "PLACEORDER",
    "/order/getidcodeimg/PLACEORDER": "PLACEORDER",
    "/order/getlist/PLACEORDER": "PLACEORDER",
    "/balance/searchfundbalance/PLACEORDER": "PLACEORDER",
    "/account/get_cfauthinfor/PLACEORDER": "PLACEORDER",
    "/fund/get_sodu_datlenh/PLACEORDER": "PLACEORDER",
    "/fund/get_tradingid/PLACEORDER": "PLACEORDER",
    "/fund/getlistsaleid/PLACEORDER": "PLACEORDER",
    "/order/getOrderSellInfo/PLACEORDER": "PLACEORDER",

    //dat lenh admin
    "/order/preadd/PLACEORDEREX": "PLACEORDEREX",
    "/order/add/PLACEORDEREX": "PLACEORDEREX",
    "/order/update/PLACEORDEREX": "PLACEORDEREX",
    "/order/cancel/PLACEORDEREX": "PLACEORDEREX",
    "/balance/getfundbalance/PLACEORDEREX": "PLACEORDEREX",
    "/balance/getfundbalancedetails/PLACEORDEREX": "PLACEORDEREX",
    "/account/get_generalinfor/PLACEORDEREX": "PLACEORDEREX",
    "/account/sync_cfauth/PLACEORDEREX": "PLACEORDEREX",
    "/order/getidcodeimg/PLACEORDEREX": "PLACEORDEREX",
    "/order/getlist/PLACEORDEREX": "PLACEORDEREX",
    "/balance/searchfundbalance/PLACEORDEREX": "PLACEORDEREX",
    "/account/get_cfauthinfor/PLACEORDEREX": "PLACEORDEREX",


    //dau tu dinh ky
    "/fund/getbankinfo/PLACEORDERSIP": "PLACEORDERSIP",
    "/balance/getfundbalance/PLACEORDERSIP": "PLACEORDERSIP",
    "/balance/getfundbalancedetails/PLACEORDERSIP": "PLACEORDERSIP",
    "/order/preadd/PLACEORDERSIP": "PLACEORDERSIP",
    "/order/preplacesip/PLACEORDERSIP": "PLACEORDERSIP",
    "/order/add/PLACEORDERSIP": "PLACEORDERSIP",
    "/order/update/PLACEORDERSIP": "PLACEORDERSIP",
    "/order/cancel/PLACEORDERSIP": "PLACEORDERSIP",
    "/order/placesip/PLACEORDERSIP": "PLACEORDERSIP",
    "/account/get_generalinfor/PLACEORDERSIP": "PLACEORDERSIP",
    "/account/sync_cfauth/PLACEORDERSIP": "PLACEORDERSIP",
    "/order/getidcodeimg/PLACEORDERSIP": "PLACEORDERSIP",
    "/srreconcile/getlistsrreconciledetail/PLACEORDERSIP": "PLACEORDERSIP",
    "/srreconcile/getlistsrreconcile/PLACEORDERSIP": "PLACEORDERSIP",
    "/account/get_cfauthinfor/PLACEORDERSIP": "PLACEORDERSIP",
    "/order/getlist/PLACEORDERSIP": "PLACEORDERSIP",
    "/balance/searchfundbalance/PLACEORDERSIP": "PLACEORDERSIP",
    "/srreconcile/getlistorderdbookbysipid/PLACEORDERSIP": "PLACEORDERSIP",
    "/fund/get_sodu_datlenh/PLACEORDERSIP": "PLACEORDERSIP",
    "/fund/get_tradingid/PLACEORDERSIP": "PLACEORDERSIP",
    "/fund/getlistproduct/PLACEORDERSIP": "PLACEORDERSIP",
    "/fund/getListTradingCycle/PLACEORDERSIP": "PLACEORDERSIP",
    "/fund/getlistsaleid/PLACEORDERSIP": "PLACEORDERSIP",
    "/order/getOrderSellInfo/PLACEORDERSIP": "PLACEORDERSIP",

    //dau tu dinh ky admin
    "/balance/getfundbalance/PLACEORDERSIPEX": "PLACEORDERSIPEX",
    "/balance/getfundbalancedetails/PLACEORDERSIPEX": "PLACEORDERSIPEX",
    "/order/preadd/PLACEORDERSIPEX": "PLACEORDERSIPEX",
    "/order/preplacesip/PLACEORDERSIPEX": "PLACEORDERSIPEX",
    "/order/add/PLACEORDERSIPEX": "PLACEORDERSIPEX",
    "/order/update/PLACEORDERSIPEX": "PLACEORDERSIPEX",
    "/order/cancel/PLACEORDERSIPEX": "PLACEORDERSIPEX",
    "/order/placesip/PLACEORDERSIPEX": "PLACEORDERSIPEX",
    "/account/get_generalinfor/PLACEORDERSIPEX": "PLACEORDERSIPEX",
    "/account/sync_cfauth/PLACEORDERSIPEX": "PLACEORDERSIPEX",
    "/order/getidcodeimg/PLACEORDERSIPEX": "PLACEORDERSIPEX",
    "/srreconcile/getlistsrreconciledetail/PLACEORDERSIPEX": "PLACEORDERSIPEX",
    "/srreconcile/getlistsrreconcile/PLACEORDERSIPEX": "PLACEORDERSIPEX",
    "/account/get_cfauthinfor/PLACEORDERSIPEX": "PLACEORDERSIPEX",
    "/order/getlist/PLACEORDERSIPEX": "PLACEORDERSIPEX",
    "/balance/searchfundbalance/PLACEORDERSIPEX": "PLACEORDERSIPEX",
    "/srreconcile/getlistorderdbookbysipid/PLACEORDERSIPEX": "PLACEORDERSIPEX",

    //ds lenh chua nhap otp
    "/order/confirmorder": "OTPCONFIRMOD",
    "/order/getotpconfirmorder": "OTPCONFIRMOD",

    "/otp/gettimeotp": "GETTIMEOTP",
    "/account/validateCaptCha": "MANAGERACCT",

    //QLTK
    "/account/getlist/MANAGERACCT": "MANAGERACCT",
    "/account/cancelgeneralinfo/MANAGERACCT": "MANAGERACCT",
    "/account/activeopt/MANAGERACCT": "MANAGERACCT",
    "/account/get_account_openotp/MANAGERACCT": "MANAGERACCT",
    "/account/finishgeneralinfo/MANAGERACCT": "MANAGERACCT",
    "/account/getcfmastinfo/MANAGERACCT": "MANAGERACCT",
    "/account/getctv/MANAGERACCT": "MANAGERACCT",
    "/account/prc_internal_account/INTERNALACCOUNT": "INTERNALACCOUNT",
    "/account/prc_company_account/COMPANYACCOUNT": "COMPANYACCOUNT",
    "/account/get_last_txnum_edit/MANAGERACCT": "MANAGERACCT",
    //QLTK admin
    "/account/getlist/MANAGERACCTEX": "MANAGERACCTEX",
    "/account/cancelgeneralinfo/MANAGERACCTEX": "MANAGERACCTEX",
    "/account/activeopt/MANAGERACCTEX": "MANAGERACCTEX",
    "/account/get_account_openotp/MANAGERACCTEX": "MANAGERACCTEX",
    "/account/finishgeneralinfo/MANAGERACCTEX": "MANAGERACCTEX",
    "/account/getcfmastinfo/MANAGERACCTEX": "MANAGERACCTEX",
    "/account/getctv/MANAGERACCTEX": "MANAGERACCTEX",

    //Hoan tien theo tung lenh
    "/fund/getlistrefundbyorder/REFUNDCASHBYORDER": "REFUNDCASHBYORDER",
    "/fund/addrefundbyorder/REFUNDCASHBYORDER": "REFUNDCASHBYORDER",
    "/fund/updaterefundbyorder/REFUNDCASHBYORDER": "REFUNDCASHBYORDER",

    //Hoan tien theo tai khoan
    "/fund/getlistrefundbyaccount/REFUNDCASH": "REFUNDCASH",
    "/fund/addrefundbyaccount/REFUNDCASH": "REFUNDCASH",
    "/fund/updaterefundbyaccount/REFUNDCASH": "REFUNDCASH",

    //QL TT lenh
    "/fund/getlistorder4changerstatus/ODSTSMANAGER": "ODSTSMANAGER",
    "/fund/process_tx5021/ODSTSMANAGER": "ODSTSMANAGER",

    //Khop lenh manual
    "/fund/getlistorder2execute/MATCHINGOD": "MATCHINGOD",
    "/fund/process_tx5017/MATCHINGOD": "MATCHINGOD",

    //dong so lenh
    "/order/getlistcloseorder/CLOSEORDERBOOK": "CLOSEORDERBOOK",
    "/order/processcloseorder/CLOSEORDERBOOK": "CLOSEORDERBOOK",
    //dong phien
    "/order/getlistCloseOrderManual/CLOSETRADINGSESSION": "CLOSETRADINGSESSION",
    "/order/processcloseorderManual/CLOSETRADINGSESSION": "CLOSETRADINGSESSION",
    //ghi nhan lenh da thanh toan tien
    "/fund/getlistorder4cfchangerstatus/ODCASHCOMPLETE": "ODCASHCOMPLETE",
    "/fund/process_tx5026/ODCASHCOMPLETE": "ODCASHCOMPLETE",

    //import lenh dat
    "/file/check_fileimport/IMPORTORDERS": "IMPORTORDERS",
    "/file/uploadtest/IMPORTORDERS": "IMPORTORDERS",
    "/file/getfilemaster/IMPORTORDERS": "IMPORTORDERS",
    "/file/pre_check_upload/IMPORTORDERS": "IMPORTORDERS",
    "/file/after_check_upload/IMPORTORDERS": "IMPORTORDERS",
    "/file/getimportdata/IMPORTORDERS": "IMPORTORDERS",

    //import lenh dat admin
    "/file/check_fileimport/IMPORTORDERSEX": "IMPORTORDERSEX",
    "/file/uploadtest/IMPORTORDERSEX": "IMPORTORDERSEX",
    "/file/getfilemaster/IMPORTORDERSEX": "IMPORTORDERSEX",
    "/file/pre_check_upload/IMPORTORDERSEX": "IMPORTORDERSEX",
    "/file/after_check_upload/IMPORTORDERSEX": "IMPORTORDERSEX",
    "/file/getimportdata/IMPORTORDERSEX": "IMPORTORDERSEX",

    //import va doi chieu
    "/file/check_fileimport/IMPANDCOMPARE": "IMPANDCOMPARE",
    "/file/uploadtest/IMPANDCOMPARE": "IMPANDCOMPARE",
    "/file/getfilemaster/IMPANDCOMPARE": "IMPANDCOMPARE",
    "/file/pre_check_upload/IMPANDCOMPARE": "IMPANDCOMPARE",
    "/file/after_check_upload/IMPANDCOMPARE": "IMPANDCOMPARE",
    "/file/getimportdata/IMPANDCOMPARE": "IMPANDCOMPARE",
    "/fund/file_compare/IMPANDCOMPARE": "IMPANDCOMPARE",
    "/fund/file_compare_confirm/IMPANDCOMPARE": "IMPANDCOMPARE",
    "/fund/getlistfile_getdatacompare/IMPANDCOMPARE": "IMPANDCOMPARE",
    //import mo tkkh
    "/file/check_fileimport/IMPORTOPNACC": "IMPORTOPNACC",
    "/file/uploadtest/IMPORTOPNACC": "IMPORTOPNACC",
    "/file/getfilemaster/IMPORTOPNACC": "IMPORTOPNACC",
    "/file/pre_check_upload/IMPORTOPNACC": "IMPORTOPNACC",
    "/file/after_check_upload/IMPORTOPNACC": "IMPORTOPNACC",
    "/file/getimportdata/IMPORTOPNACC": "IMPORTOPNACC",

    //import tkkh cho moi gioi
    "/file/check_fileimport/CUSIMPSALE": "CUSIMPSALE",
    "/file/uploadtest/CUSIMPSALE": "CUSIMPSALE",
    "/file/getfilemaster/CUSIMPSALE": "CUSIMPSALE",
    "/file/pre_check_upload/CUSIMPSALE": "CUSIMPSALE",
    "/file/after_check_upload/CUSIMPSALE": "CUSIMPSALE",
    "/file/getimportdata/CUSIMPSALE": "CUSIMPSALE",
    //import mo tkkh admin
    "/file/check_fileimport/IMPORTOPNACCEX": "IMPORTOPNACCEX",
    "/file/uploadtest/IMPORTOPNACCEX": "IMPORTOPNACCEX",
    "/file/getfilemaster/IMPORTOPNACCEX": "IMPORTOPNACCEX",
    "/file/pre_check_upload/IMPORTOPNACCEX": "IMPORTOPNACCEX",
    "/file/after_check_upload/IMPORTOPNACCEX": "IMPORTOPNACCEX",
    "/file/getimportdata/IMPORTOPNACCEX": "IMPORTOPNACCEX",


    //import tien
    "/file/check_fileimport/IVIMP": "IVIMP",
    "/file/uploadtest/IVIMP": "IVIMP",
    "/file/getfilemaster/IVIMP": "IVIMP",
    "/file/pre_check_upload/IVIMP": "IVIMP",
    "/file/after_check_upload/IVIMP": "IVIMP",
    "/file/getimportdata/IVIMP": "IVIMP",

    //import tien
    "/file/check_fileimport/IMPORTCAREBY": "IMPORTCAREBY",
    "/file/uploadtest/IMPORTCAREBY": "IMPORTCAREBY",
    "/file/getfilemaster/IMPORTCAREBY": "IMPORTCAREBY",
    "/file/pre_check_upload/IMPORTCAREBY": "IMPORTCAREBY",
    "/file/after_check_upload/IMPORTCAREBY": "IMPORTCAREBY",
    "/file/getimportdata/IMPORTCAREBY": "IMPORTCAREBY",

    //hoan tat dang ky goi dau tu dinh ky
    "/user/getlisttasip/SIPSTSMANAGER": "SIPSTSMANAGER",
    "/user/acceptsips/SIPSTSMANAGER": "SIPSTSMANAGER",
    "/user/denysips/SIPSTSMANAGER": "SIPSTSMANAGER",

    //danh muc dau tu
    "/fund/getlisportfolio/PORTFOLIO": "PORTFOLIO",
    "/fund/getExpectedSellOrder/PORTFOLIO": "PORTFOLIO",
    "/fund/precheckCalcExpectedSellOrder/PORTFOLIO": "PORTFOLIO",
    "/fund/getlisportfolioexpectnav/PORTFOLIONAV": "PORTFOLIONAV",

    //huy danh sach thuc hien quyen
    "/fund/getlistcamastcancel/CANCLECALIST": "CANCLECALIST",
    "/fund/cancel_camast/CANCLECALIST": "CANCLECALIST",

    //chot ds thuc hien quyen
    "/fund/getlistcamastblock/CREATCALIST": "CREATCALIST",
    "/fund/approve_camast/CREATCALIST": "CREATCALIST",
    "/fund/getorderdbookall/ODTRANSHIST": "ODTRANSHIST",
    "/vcbf/getAgentsList/ODTRANSHIST": "ODTRANSHIST",

    //in UNC
    "/srreconcile/getlistprintso/PAYMENTORDER": "PAYMENTORDER",

    //Duyet thong tin TK
    "/account/getlistduyettk/APPROVEACCT": "APPROVEACCT",
    "/account/approvemanaacc/APPROVEACCT": "APPROVEACCT",
    "/account/rejectmanaacc/APPROVEACCT": "APPROVEACCT",
    "/account/getlistduyettkdetail/APPROVEACCT": "APPROVEACCT",

    //Duyet ho so goc
    "/account/getlistDuyetHoSoGoc/APPROVEORIGINALFILE": "APPROVEORIGINALFILE",
    "/account/approveoriginalfile/APPROVEORIGINALFILE": "APPROVEORIGINALFILE",
    "/account/rejectoriginalfile/APPROVEORIGINALFILE": "APPROVEORIGINALFILE",
    "/account/getListDuyetHoSoGocDetail/APPROVEORIGINALFILE": "APPROVEORIGINALFILE",

    //crm
    "/account/getlistcrm/CRM": "CRM",
    "/account/checkcrm/CRM": "CRM",

    //ds tk can xac nhan otp
    "/account/getcfmastotp/OTPCONFIRMCF": "OTPCONFIRMCF",
    "/account/activeopt/OTPCONFIRMCF": "OTPCONFIRMCF",
    "/account/get_account_openotp/OTPCONFIRMCF": "OTPCONFIRMCF",

    //phong toa tai khoan
    "/account/get_generalinfor/BLOCKACCT": "BLOCKACCT",
    "/fund/blockafmast/BLOCKACCT": "BLOCKACCT",

    //giai toa tai khoan
    "/fund/getlistblockafmast/UNBLOCKACCT": "UNBLOCKACCT",
    "/fund/unblockafmast/UNBLOCKACCT": "UNBLOCKACCT",

    //yeu cau dong tai khoan
    "/account/getlistaccounttoclose/REQCLSACCT": "REQCLSACCT",
    "/account/req_close_account/REQCLSACCT": "REQCLSACCT",

    //tu choi dong tai khoan
    "/account/getlistaccept_close_account/CANCELREQCLSACCT": "CANCELREQCLSACCT",
    "/account/cancelreqcloseaccount/CANCELREQCLSACCT": "CANCELREQCLSACCT",

    //hoan tat dong tai khoan
    "/account/getlistaccept_close_account/COMPLETECLSACCT": "COMPLETECLSACCT",
    "/account/accept_close_account/COMPLETECLSACCT": "COMPLETECLSACCT",

    //QLDS TK mo cho VSD xac nhan
    "/fund/getlistvsdstatus/CFWVSDCONFIRM": "CFWVSDCONFIRM",
    "/fund/cf_account_opening_request/CFWVSDCONFIRM": "CFWVSDCONFIRM",

    //hoan tat thay doi thong tin KH
    "/account/getlistchangeinfocus/CFCOMPLETEEDIT": "CFCOMPLETEEDIT",
    "/account/getchangeacctvsd/CFCOMPLETEEDIT": "CFCOMPLETEEDIT",
    "/account/processchangeinfocus/CFCOMPLETEEDIT": "CFCOMPLETEEDIT",

    //phan loai kh
    "/fund/getlistchangecustomertype/CLASSCUSTOMER": "CLASSCUSTOMER",
    "/fund/changecfmastclass/CLASSCUSTOMER": "CLASSCUSTOMER",

    //gui email theo ds va noi dung dinh kem
    "/account/getlistsendemail/SENDEMAIL": "SENDEMAIL",
    "/account/sendemail/SENDEMAIL": "SENDEMAIL",
    "/account/getsendemaillist/SENDEMAIL": "SENDEMAIL",

    //ls gui email/sms trong ngay
    "/account/getemaillistmanager/MANAGEREMAIL": "MANAGEREMAIL",
    "/account/managementemail/MANAGEREMAIL": "MANAGEREMAIL",

    //ls gui email/sms
    "/account/getemaillistmanagerall/MANAGEREMAILHIST": "MANAGEREMAILHIST",
    "/account/managementemail/MANAGEREMAILHIST": "MANAGEREMAILHIST",

    //gui email/sms chuc mung
    "/account/sendotheremail/EMAIL2CUST": "EMAIL2CUST",


    //cap lai mk cho ndt
    "/accountinfo/resetpasscustomer/RESETCUSTPASS": "RESETCUSTPASS",

    //y/c chuyen khoan ccq
    "/fund/getlistsemast_totransf/REQTRANFERFUND": "REQTRANFERFUND",
    "/fund/setranfer_req/REQTRANFERFUND": "REQTRANFERFUND",
    "/fund/getvsdspcodebycodeid/REQTRANFERFUND": "REQTRANFERFUND",

    //tu choi y/c chuyen khoan ccq
    "/fund/getlistsetranfer_req/REJECTREQTRANFERFUND": "REJECTREQTRANFERFUND",
    "/fund/setranfer_reject/REJECTREQTRANFERFUND": "REJECTREQTRANFERFUND",

    //xac nhan y/c chuyen khoan ccq
    "/fund/getlistsetranfer_req/COMPLETEREQTRANFERFUND": "COMPLETEREQTRANFERFUND",
    "/fund/setranfer_confirm/COMPLETEREQTRANFERFUND": "COMPLETEREQTRANFERFUND",

    //nhan chuyen khoan ccq
    "/account/get_generalinfor/RECEIVINGFUND": "RECEIVINGFUND",
    "/fund/sereceive_req/RECEIVINGFUND": "RECEIVINGFUND",
    //tinh phi lenh
    "/order/caculate_fee/FEECACULATE": "FEECACULATE",
    "/order/getlistcloseorder/FEECACULATE": "FEECACULATE",
    "/order/getlisttradingsession_feecaculate/FEECACULATE": "FEECACULATE",

    //
    //Phi quan ly
    "/order/update_managerfee/MANAGERFEE": "MANAGERFEE",
    "/order/getlistmanagerfee/MANAGERFEE": "MANAGERFEE",
    //QL thong tin MG
    "/user/getlistsaleroles/SALESMANEGER": "SALESMANEGER",
    "/user/deletelistsaleroles/SALESMANEGER": "SALESMANEGER",
    "/user/addlistsaleroles/SALESMANEGER": "SALESMANEGER",
    "/user/updatelistsaleroles/SALESMANEGER": "SALESMANEGER",
    "/user/gettlprofiles/SALESMANEGER": "SALESMANEGER",

    //QL loai hinh MG
    "/fund/getlistsalestype/SALESPRODUCTS": "SALESPRODUCTS",
    "/fund/deletesale_retype/SALESPRODUCTS": "SALESPRODUCTS",
    "/fund/addsale_retype/SALESPRODUCTS": "SALESPRODUCTS",
    "/fund/updatesale_retype/SALESPRODUCTS": "SALESPRODUCTS",

    //QL thong tin nhom MG
    "/user/getlistsalegroups/SALESGROUP": "SALESGROUP",
    "/user/deletelistsalegroups/SALESGROUP": "SALESGROUP",
    "/user/addlistsalegroups/SALESGROUP": "SALESGROUP",
    "/user/updatelistsalegroups/SALESGROUP": "SALESGROUP",

    //gan chi nhanh cho sale QL
    "/user/getlistsalebranchs/ASSIGNBRANCH4SALES": "ASSIGNBRANCH4SALES",
    "/user/deletelistsalebranchs/ASSIGNBRANCH4SALES": "ASSIGNBRANCH4SALES",
    "/user/addlistsalebranchs/ASSIGNBRANCH4SALES": "ASSIGNBRANCH4SALES",
    "/user/updatelistsalebranchs/ASSIGNBRANCH4SALES": "ASSIGNBRANCH4SALES",

    //gan mg vao nhom
    "/user/getlistsalemanagers/ASSIGNSALE4GROUP": "ASSIGNSALE4GROUP",
    "/user/addsaleidtogroup/ASSIGNSALE4GROUP": "ASSIGNSALE4GROUP",
    "/fund/getlistsale_groups/ASSIGNSALE4GROUP": "ASSIGNSALE4GROUP",

    //gan kh vao moi gioi
    "/user/getlistsalecustomers/ASSIGNCUSTOMER4SALES": "ASSIGNCUSTOMER4SALES",
    "/user/deletesalecustomers/ASSIGNCUSTOMER4SALES": "ASSIGNCUSTOMER4SALES",
    "/user/addlistsalecustomers/ASSIGNCUSTOMER4SALES": "ASSIGNCUSTOMER4SALES",
    "/user/updatesalecustomers/ASSIGNCUSTOMER4SALES": "ASSIGNCUSTOMER4SALES",
    "/account/get_generalinfor/ASSIGNCUSTOMER4SALES": "ASSIGNCUSTOMER4SALES",
    "/user/deletecustomerregsale/ASSIGNCUSTOMER4SALES": "ASSIGNCUSTOMER4SALES",

    //chuyen MG cham soc TK
    "/fund/getlistsale_customers/MOVESALES": "MOVESALES",
    "/fund/move_sale_customers/MOVESALES": "MOVESALES",

    //chuyen MG tren tung lenh
    "/fund/getlistsale_ordersmap/MOVESALES4ORDER": "MOVESALES4ORDER",
    "/fund/prc_sale_ordersmap/MOVESALES4ORDER": "MOVESALES4ORDER",

    //chuyen nhom MG
    "/fund/getlistmove_sale_managers/MOVEGROUPSALES": "MOVEGROUPSALES",
    "/fund/move_sale_managers/MOVEGROUPSALES": "MOVEGROUPSALES",

    //QL KPI
    "/fund/getlistkpiparam/KPI": "KPI",
    "/fund/deletekpiparam/KPI": "KPI",
    "/fund/addkpiparam/KPI": "KPI",
    "/fund/updatekpiparam/KPI": "KPI",

    //QL user
    "/user/getlistuser/USERS": "USERS",
    "/user/delete/USERS": "USERS",
    "/user/add/USERS": "USERS",
    "/user/update/USERS": "USERS",

    //QL nhom user
    "/group/getlistgroup/GROUPS": "GROUPS",
    "/group/delete/GROUPS": "GROUPS",
    "/group/add/GROUPS": "GROUPS",
    "/group/update/GROUPS": "GROUPS",
    "/fund/getlistfocmdmenu_rights/GROUPS": "GROUPS",
    "/fund/assign_rights_group/GROUPS": "GROUPS",
    "/fund/addtlgrpusers_list/GROUPS": "GROUPS",

    //QL to chuc NH
    "/fund/getlistmember/MEMBERS": "MEMBERS",
    "/fund/deletemember/MEMBERS": "MEMBERS",
    "/fund/addmember/MEMBERS": "MEMBERS",
    "/fund/updatemember/MEMBERS": "MEMBERS",
    "/fund/getlistroles/MEMBERS": "MEMBERS",

    //QL chi nhanh
    "/fund/getlistbrp/BRANCH": "BRANCH",
    "/fund/deletegrp/BRANCH": "BRANCH",
    "/fund/addgrp/BRANCH": "BRANCH",
    "/fund/updategrp/BRANCH": "BRANCH",

    //QL khu vuc
    "/fund/getlistarea/AREA": "AREA",
    "/fund/deletearea/AREA": "AREA",
    "/fund/addarea/AREA": "AREA",
    "/fund/updatearea/AREA": "AREA",

    //QL DM quy
    "/fund/getlist/FUNDPRODUCT": "FUNDPRODUCT",
    "/fund/delete/FUNDPRODUCT": "FUNDPRODUCT",
    "/fund/add/FUNDPRODUCT": "FUNDPRODUCT",
    "/fund/update/FUNDPRODUCT": "FUNDPRODUCT",

    //QL thông tin sản phẩm
    "/fund/getlist/PRODUCTINFO": "PRODUCTINFO",
    "/fund/getlistproduct/PRODUCTINFO": "PRODUCTINFO",
    "/fund/deleteproduct/PRODUCTINFO": "PRODUCTINFO",
    "/fund/addproduct/PRODUCTINFO": "PRODUCTINFO",
    "/fund/updateproduct/PRODUCTINFO": "PRODUCTINFO",
    "/vcbf/getAgentsList/PRODUCTINFO": "PRODUCTINFO",

    //QL ds NH 
    "/fund/getlistfmacctno/BANK4FUND": "BANK4FUND",
    "/fund/deletefnaccno/BANK4FUND": "BANK4FUND",
    "/fund/addfnaccno/BANK4FUND": "BANK4FUND",
    "/fund/updatefnaccno/BANK4FUND": "BANK4FUND",

    //QL bieu phi
    "/fund/getlistfee/FEETYPE": "FEETYPE",
    "/fund/deletefeetype/FEETYPE": "FEETYPE",
    "/fund/addFeetype/FEETYPE": "FEETYPE",
    "/fund/updateFeetype/FEETYPE": "FEETYPE",
    "/fund/getlistproduct/FEETYPE": "FEETYPE",


    //TK so dep
    "/user/getlistcfmastvip/CFVIP": "CFVIP",
    "/user/deletecfmastvip/CFVIP": "CFVIP",
    "/user/addcfmastvip/CFVIP": "CFVIP",
    "/user/updatecfmastvip/CFVIP": "CFVIP",

    //chi so thi truong
    "/fund/getlistmarketinfo/MARKET": "MARKET",
    "/fund/deletemarketinfo/MARKET": "MARKET",
    "/fund/addmarketinfo/MARKET": "MARKET",
    "/fund/updatemarketinfo/MARKET": "MARKET",

    //QL nav
    "/fund/getlistnav/NAV": "NAV",
    "/fund/deletemarketinfo/NAV": "NAV",
    "/fund/addnav/NAV": "NAV",
    "/fund/updatenav/NAV": "NAV",

    //QL thong bao
    "/fund/getlistnoti/ALERT": "ALERT",
    "/fund/deletenoti/ALERT": "ALERT",
    "/fund/getalertdetail/ALERT": "ALERT",
    "/fund/addnoti/ALERT": "ALERT",
    "/fund/updatenoti/ALERT": "ALERT",

    //QL tien thanh toan
    "/fund/getlistreceivemoney/RECEIVEMONEY": "RECEIVEMONEY",

    //lich he thong
    "/celendar/setlistcelendar/CALENDAR": "CALENDAR",
    "/celendar/getlistcelendar/CALENDAR": "CALENDAR",

    //lich sip
    "/celendar/getlist_sip_calendar/CALENDARSIP": "CALENDARSIP",
    "/celendar/setlist_sip_calendar/CALENDARSIP": "CALENDARSIP",

    //tham so review PLKH
    "/fund/getlisttermreview/PARAMCUSTOMER": "PARAMCUSTOMER",
    "/fund/deletereviewterm/PARAMCUSTOMER": "PARAMCUSTOMER",
    "/fund/addreviewterm/PARAMCUSTOMER": "PARAMCUSTOMER",
    "/fund/updatereviewterm/PARAMCUSTOMER": "PARAMCUSTOMER",
    "/fund/getlistreviewparam/PARAMCUSTOMER": "PARAMCUSTOMER",
    "/fund/deletereviewparam/PARAMCUSTOMER": "PARAMCUSTOMER",
    "/fund/updatereviewparam/PARAMCUSTOMER": "PARAMCUSTOMER",
    "/fund/addreviewparam/PARAMCUSTOMER": "PARAMCUSTOMER",
    "/fund/getframt/PARAMCUSTOMER": "PARAMCUSTOMER",

    //QL dai hoi co dong
    "/fund/deletecamast/CAMAST": "CAMAST",
    "/fund/getlistcamast/CAMAST": "CAMAST",
    "/fund/addcamast/CAMAST": "CAMAST",
    "/fund/updatecamast/CAMAST": "CAMAST",

    //gan bieu phi
    "/fund/deletefeeassign/FEEASSIGN": "FEEASSIGN",
    "/fund/getlistfeeassign/FEEASSIGN": "FEEASSIGN",
    "/fund/addfeeassign/FEEASSIGN": "FEEASSIGN",
    "/fund/updatefeeassign/FEEASSIGN": "FEEASSIGN",

    //batch
    "/fund/getlistbatcheod_success/BATCHEOD": "BATCHEOD",
    "/fund/getlistbatcheod/BATCHEOD": "BATCHEOD",
    "/fund/batch_pr_batch/BATCHEOD": "BATCHEOD",

    //tra cuu user theo nhom nguoi su dung
    "/user/getlistgruser/USERINGROUP": "USERINGROUP",
    "/user/addlistsalebranchs/USERINGROUP": "USERINGROUP",

    //LSGD
    "/fund/getlisttranshistory/TRANSHIST": "TRANSHIST",

    //cap mk cho user
    "/fund/resetpassuser/RESETUSERPASS": "RESETUSERPASS",

    //Duyet qltk
    "/account/getlistduyettk/APPROVEACCT": "APPROVEACCT",
    "/account/getlistduyettkdetail": "APPROVEACCT",
    "/account/approvemanaacc": "APPROVEACCT",
    "/account/rejectmanaacc": "APPROVEACCT",
    // Doi Chieu giao dich lẹnh
    "/srreconcile/fetchListreconcile/SRRECONCILE": "SRRECONCILE",
    "/vcbf/getAgentsList/SRRECONCILE": "SRRECONCILE",
    // Truy van so du tien va CCQ
    "/fund/fetchAccountList/BALANCE": "BALANCE",
    "/fund/fetchBalanceInfo/BALANCE": "BALANCE",
    "/fund/fetchOrderAmtInfo/BALANCE": "BALANCE",
    "/fund/getSoDuCCQ/BALANCE": "BALANCE",
    "/account/getcarebygroupbytlid/BALANCE": "BALANCE",
    //QLGD LSGD report de o special
    //DUYET LENH CHUA DUYET
    "/fund/fetchUnconfirmOrder/ODCONFIRM": "ODCONFIRM",
    "/fund/getoriginalorderimage/ODCONFIRM": "ODCONFIRM",
    "/vcbf/Order_Reject/ODCONFIRM": "ODCONFIRM",
    //sua dien giai nop tien
    "/vcbf/get_cashimp_4edit/MODCASH": "MODCASH",
    "/vcbf/prc_iv_delete_cash_3013/MODCASH": "MODCASH",
    "/vcbf/prc_iv_mod_cash_3012/MODCASH": "MODCASH",
    //sua tham so he thong
    "/vcbf/get_sysvar_4edit/PARAMSYSVAR": "PARAMSYSVAR",
    "/vcbf/prc_sy_update_sysvar/PARAMSYSVAR": "PARAMSYSVAR",
    //chuyen nhom careby
    "/vcbf/getlistcfmast4careby/CHANGEGROUPCAREBY": "CHANGEGROUPCAREBY",
    "/vcbf/getcareby/CHANGEGROUPCAREBY": "CHANGEGROUPCAREBY",
    "/vcbf/cf_changegroupcareby/CHANGEGROUPCAREBY": "CHANGEGROUPCAREBY",
    "/fund/approveOrder/ODCONFIRM": "ODCONFIRM",
    "/balance/withdraw/IVWITHDRAW": "IVWITHDRAW",
    "/account/search_all_fullname2/IVWITHDRAW": "IVWITHDRAW",
    "/balance/getbalanceavail/IVWITHDRAW": "IVWITHDRAW",
    "/balance/sqlgetsipcode/IVWITHDRAW": "IVWITHDRAW",
    "/account/getcarebygroupbytlid/IVWITHDRAW": "IVWITHDRAW",

    "/account/search_all_fullname2/ENDMONTHNAV": "ENDMONTHNAV",
    "/fund/insert_endmonth_nav/ENDMONTHNAV": "ENDMONTHNAV",
    "/fund/getlistnavcuoithang/ENDMONTHNAV": "ENDMONTHNAV",
    "/fund/update_endmonth_nav/ENDMONTHNAV": "ENDMONTHNAV",


    "/account/search_all_fullname2/ENDMONTHFEE": "ENDMONTHFEE",
    "/fund/insert_endmonthfee/ENDMONTHFEE": "ENDMONTHFEE",
    "/fund/getlistfeecuoithang/ENDMONTHFEE": "ENDMONTHFEE",
    "/fund/update_endmonthfee/ENDMONTHFEE": "ENDMONTHFEE",

    //tra tien thua
    "/vcbf/getlistcashback/IVCASHBACK": "IVCASHBACK",
    "/vcbf/cashback/IVCASHBACK": "IVCASHBACK",
    "/vcbf/pre_check_3007/IVCASHBACK": "IVCASHBACK",


    //xac nhan tra tien thua

    "/vcbf/getlistcashback_confirm/IVCASHBACKCONFIRM": "IVCASHBACKCONFIRM",
    "/vcbf/cashback_confirm/IVCASHBACKCONFIRM": "IVCASHBACKCONFIRM",



    "/user/getlistsalecustomers/CUSTOMER4SALE": "CUSTOMER4SALE",
    "/user/deletesalecustomers/CUSTOMER4SALE": "CUSTOMER4SALE",
    "/user/addlistsalecustomers/CUSTOMER4SALE": "CUSTOMER4SALE",
    "/user/updatesalecustomers/CUSTOMER4SALE": "CUSTOMER4SALE",
    "/user/deletecustomerregsale/CUSTOMER4SALE": "CUSTOMER4SALE",
    "/account/get_generalinfor/CUSTOMER4SALE": "CUSTOMER4SALE",
    "/fund/fetchAccountList/CUSTOMER4SALE": "CUSTOMER4SALE",
    "/fund/get_all_sale_rm/CUSTOMER4SALE": "CUSTOMER4SALE",
    "/fund/get_current_sale/CUSTOMER4SALE": "CUSTOMER4SALE",
    "/fund/insert_customerreg/CUSTOMER4SALE": "CUSTOMER4SALE",
    //xac nhan bang ke thanh toan tien ban

    "/vcbf/getlisteciving_sell_money_confirm/SELLMONEYCONFIRM": "SELLMONEYCONFIRM",
    "/vcbf/sr_reciving_sell_money/SELLMONEYCONFIRM": "SELLMONEYCONFIRM",
    // Phong toa CCQ
    "/balance/getlistsemastblock/SEBLOCKED": "SEBLOCKED",
    "/balance/actionblockccq/SEBLOCKED": "SEBLOCKED",
    // Giai toa CCQ
    "/balance/getlistsemastunblock/SEUNBLOCKED": "SEUNBLOCKED",
    "/balance/actionunblockccq/SEUNBLOCKED": "SEUNBLOCKED",


    // duyet dang ky moi gioi tu NDT
    "/user/getlistsalecustomers/CONFIRMCUSTOMERREGISTERSALE": "CONFIRMCUSTOMERREGISTERSALE",
    "/user/deletesalecustomers/CONFIRMCUSTOMERREGISTERSALE": "CONFIRMCUSTOMERREGISTERSALE",
    "/user/addlistsalecustomers/CONFIRMCUSTOMERREGISTERSALE": "CONFIRMCUSTOMERREGISTERSALE",
    "/user/updatesalecustomers/CONFIRMCUSTOMERREGISTERSALE": "CONFIRMCUSTOMERREGISTERSALE",
    "/user/deletecustomerregsale/CONFIRMCUSTOMERREGISTERSALE": "CONFIRMCUSTOMERREGISTERSALE",
    "/account/get_generalinfor/CONFIRMCUSTOMERREGISTERSALE": "CONFIRMCUSTOMERREGISTERSALE",
    "/fund/get_list_customer_reg_changesale/CONFIRMCUSTOMERREGISTERSALE": "CONFIRMCUSTOMERREGISTERSALE",

    //lsgd tien
    "/cashmanual/fetchListCashTransHis/CASHTRANSACTIONHIS": "CASHTRANSACTIONHIS",
    "/fund/fetchAccountList/CASHTRANSACTIONHIS": "CASHTRANSACTIONHIS",
    "/fund/prc_get_fixed_ordertype/CASHTRANSACTIONHIS": "CASHTRANSACTIONHIS",
    "/account/getcarebygroupbytlid/CASHTRANSACTIONHIS": "CASHTRANSACTIONHIS",
    // Xac nhan lenh dat ho
    '/vcbf/getlistordersconfirm/CFORDERCONFIRM': 'CFORDERCONFIRM',
    '/vcbf/submitconfirmorder/CFORDERCONFIRM': 'CFORDERCONFIRM',
    //sao ke CCQ
    "/cashmanual/fetchListFundTransHis/FUNDTRANSACTIONHIST": "FUNDTRANSACTIONHIST",
    "/fund/fetchAccountList/FUNDTRANSACTIONHIST": "FUNDTRANSACTIONHIST",
    "/fund/prc_get_fixed_ordertype/FUNDTRANSACTIONHIST": "FUNDTRANSACTIONHIST",
    "/account/getcarebygroupbytlid/FUNDTRANSACTIONHIST": "FUNDTRANSACTIONHIST",
    //import trả lại và giữ lại tiền thừa
    "/file/check_fileimport/IVCASHBACK": "IVCASHBACK",
    "/file/uploadtest/IVCASHBACK": "IVCASHBACK",
    "/file/getfilemaster/IVCASHBACK": "IVCASHBACK",
    "/file/pre_check_upload/IVCASHBACK": "IVCASHBACK",
    "/file/after_check_upload/IVCASHBACK": "IVCASHBACK",
    "/file/getimportdata/IVCASHBACK": "IVCASHBACK",
    //import fund
    "/file/check_fileimport/CCQIMP": "CCQIMP",
    "/file/uploadtest/CCQIMP": "CCQIMP",
    "/file/getfilemaster/CCQIMP": "CCQIMP",
    "/file/pre_check_upload/CCQIMP": "CCQIMP",
    "/file/after_check_upload/CCQIMP": "CCQIMP",
    "/file/getimportdata/CCQIMP": "CCQIMP",
    //hoa hong
    "/fund/getsalescalculator/COMISSION": "COMISSION",
    //rut MG
    "/fund/getlistmove_sale_managers/WITHDRAWBROCKER": "WITHDRAWBROCKER",
    "/fund/move_sale_managers/WITHDRAWBROCKER": "WITHDRAWBROCKER",
    //upload thong tin tai khoan
    "/account/get_generalinfor/UPLOADMANAGER": "UPLOADMANAGER",
    "/account/prc_sy_mt_cfsign/UPLOADMANAGER": "UPLOADMANAGER",
    "/account/get_list_cfsign/UPLOADMANAGER": "UPLOADMANAGER",

    //upload anh phieu lenh goc
    "/account/get_generalinfor/ORIGINALORDER": "ORIGINALORDER",
    "/order/prc_sy_mt_originalorder/ORIGINALORDER": "ORIGINALORDER",
    "/order/get_list_originalorder/ORIGINALORDER": "ORIGINALORDER",

    //upload anh phieu lenh goc
    "/account/get_generalinfor/MANAGERORIGINALORDER": "MANAGERORIGINALORDER",
    "/order/prc_mt_download_originalorder/MANAGERORIGINALORDER": "MANAGERORIGINALORDER",
    "/order/get_list_manager_originalorder/MANAGERORIGINALORDER": "MANAGERORIGINALORDER",


    "/account/getlistusergroup/ADDUSERTOGROUP": "ADDUSERTOGROUP",
    //sync user careby
    "/user/syncuser/SYNCCAREBY": "SYNCCAREBY",
    //tra cuu dien stp
    "/fund/get_all_stpstatus": "STPLIST",
    //danh sach tai khoan mo cho vsd xac nhan
    "/fund/get_account_stpstatus": "VSDACCTMESSAGE",
    "/fund/send_account_message_vsd": "VSDACCTMESSAGE",
    "/fund/getlistfee4groups": "FEE4GROUPS",
    "/fund/addfee4groups": "FEE4GROUPS",
    "/fund/updatefee4groups": "FEE4GROUPS",
    "/fund/deletefee4groups": "FEE4GROUPS",
    "/fund/getlistfeetypes": "FEE4GROUPS",
    "/fund/getsalecalculatortrailerfee": "HOLDINGPERIODFUND",

    // Xac nhan cac lenh sip da sua
    '/vcbf/getAmendSipConfirm/AMENDSIPCONFIRM': 'AMENDSIPCONFIRM',
    '/vcbf/submitConfirmAmendSip/AMENDSIPCONFIRM': 'AMENDSIPCONFIRM',
    '/vcbf/getAgentsList/AMENDSIPCONFIRM': 'AMENDSIPCONFIRM',

    // Doi phien giao dich cho lenh dat
    '/fund/getChangeSessionOrders/CHANGEORDERSESSION': 'CHANGEORDERSESSION',
    '/order/changeOrderTradingSession/CHANGEORDERSESSION': 'CHANGEORDERSESSION',

};
const arryCustodycd = ["custodycd", "p_custodycd", "CUSTODYCD", "pv_custodycd", "P_CUSTODYCD", "PV_CUSTODYCD"]
const arryTlid = ["tlid", "p_tlid", "TLID", "pv_tlid", "P_TLID", "PV_TLID"]
const arryOBJNAME = ["OBJNAME", "objname", "pv_objname", "p_objname"]
function getOBJNAME(Obj) {
    let v_return = "";
    for (let i = 0; i < arryOBJNAME.length; i++) {
        if (Obj.hasOwnProperty(arryOBJNAME[i])) {
            v_return = Obj[arryOBJNAME[i]]
            break
        }
    }
    if (v_return == "" && Obj.hasOwnProperty('data'))
        for (let i = 0; i < arryOBJNAME.length; i++) {
            if (Obj.data.hasOwnProperty(arryOBJNAME[i])) {
                v_return = Obj.data[arryOBJNAME[i]]
                break
            }
        }

    if (v_return !== "")
        v_return = "/" + v_return
    return v_return;
}
function replaceCustodycd(body, userId, userinfo) {
    let arrUserId = userinfo.arrCustodycd;
    for (let i = 0; i < arryCustodycd.length; i++) {
        if (body.hasOwnProperty(arryCustodycd[i]) && (body[arryCustodycd[i]].length == 0
            || body[arryCustodycd[i]] != 'ALL')) {
            // body[arryCustodycd[i]] = userId;

            //1 Nhà đầu tư có nhiều custodycd -> chỉ replace nếu cus truyền lên ko thuộc arrCustodycd (arrUserId)
            if (arrUserId.includes(body[arryCustodycd[i]])) {
                //không replace, lấy theo custodycd truyền lên
                // body[arryCustodycd[i]] =
                //     body.CUSTODYCD || body.custodycd
                // body.PV_CUSTODYCD || body.P_CUSTODYCD
                //     || body.p_custodycd || body.pv_custodycd;

            } else {
                body[arryCustodycd[i]] = userId
            }
        }
    }
    return body;
}
function replaceTlid(body, tlid) {
    for (let i = 0; i < arryTlid.length; i++) {
        if (body.hasOwnProperty(arryTlid[i])) {
            body[arryTlid[i]] = tlid;
        }
    }
    return body;
}
function getCustodycd(Obj) {
    let v_return = undefined;
    for (let i = 0; i < arryCustodycd.length; i++) {
        if (Obj.hasOwnProperty(arryCustodycd[i])) {
            v_return = Obj[arryCustodycd[i]]
            break
        }
    }
    return v_return;
}
function getTLID(Obj) {
    let v_return = undefined;
    for (let i = 0; i < arryTlid.length; i++) {
        if (Obj.hasOwnProperty(arryTlid[i])) {
            v_return = Obj[arryTlid[i]]
            break
        }
    }
    return v_return;
}
var lodash = require('lodash')
function checkPermissionWithCustodyCd(username, custodycd) {    //giang.ngo: check xem user có quyền thao tác với custodycd này không
    //sails.log("checkPermissionWithCustodyCd====begin", username, custodycd)
    let list = lodash.filter(AllAccountsManage, { USERNAME: username });
    //sails.log("checkPermissionWithCustodyCd====list", list, list.length)
    if (list && list.length > 0) {
        let custodycdValidArr = list[0].ARRAY_CUSTODYCD;
        //sails.log("checkPermissionWithCustodyCd====", custodycdValidArr, custodycd)
        return (custodycdValidArr.indexOf(custodycd) > -1);
    }
    return false;
}
module.exports = {
    checkAccountCreateAccount: async function (req) {
        if (req.body) {
            req.body["CUSTID"] = "";
            req.body["CUSTODYCD"] = "";
        }
    },
    checkAccount: function (req, currUserinfo) {
        try {
            if (currUserinfo.ISCUSTOMER == 'Y') { //giang.ngo: trường hợp khách hàng online đăng nhập
                //check CUSTODYCD của req.body gửi lên. nếu chưa có trong session => return false
                // chỉ check khi CUSTODYCD !== USERID vì nhiều apis dùng CUSTODYCD = USERID để lấy all data
                if (req.body && req.body.CUSTODYCD && !currUserinfo.arrCustodycd.includes(req.body.CUSTODYCD)
                    && req.body.CUSTODYCD !== currUserinfo.USERID
                ) {
                    // sails.log('<<<<<<< arrCustodycd ', currUserinfo.arrCustodycd,
                    //     'req.body.CUSTODYCD : ', req.body.CUSTODYCD,
                    //     ' check: ', currUserinfo.arrCustodycd.includes(req.body.CUSTODYCD))

                    return false;
                }

                // Override body here
                if (req.body) {
                    req.body = replaceCustodycd(req.body, currUserinfo.USERID, currUserinfo);
                }
                return true;
            } else {    //giang.ngo: trường hợp môi giới đăng nhập
                if (req.body) { //giang.ngo: trường hợp truyền lên req.body và có truyền lên CUSTODYCD thì check xem CUSTODYCD truyền lên có hợp lệ không
                    if (sails.config.TLIDADMIN.indexOf(currUserinfo.TLID) > -1) {    //giang.ngo: trường hợp là user admin
                        return true;
                    }
                    let PV_CUSTODYCD = getCustodycd(req.body);
                    if (PV_CUSTODYCD) {
                        if (PV_CUSTODYCD.length == 0 || PV_CUSTODYCD != 'ALL') { //neu truyen len la ALL hoac rong thi bo qua k check
                            return checkPermissionWithCustodyCd(currUserinfo.USERNAME, PV_CUSTODYCD);
                        }
                    }
                }
                return true;
            }
        } catch (error) {
            sails.log.error('checkAccount.error', error)
            return false;
        }
    },
    checkAuth: function (req, objname) {
        try {
            let isvalid = false;
            SpecOBJ.map(function (key) {
                if (objname.indexOf(key) == 0) isvalid = true;
            })
            if (isvalid)
                return isvalid
            let REACTOBJNAME = null;
            let ext = getOBJNAME(req.body);
            //sails.log("checkAuth.:objname.:", objname, ':::ext.:', ext)
            Object.keys(OBJMAP).map(function (key) {
                var url = objname + ext
                //sails.log("checkAuth", key, url.indexOf(key) == 0)
                if (url.indexOf(key) == 0) REACTOBJNAME = OBJMAP[key];
                //sails.log("checkAuth.:REACTOBJNAME.:", REACTOBJNAME)
            })
            //sails.log("checkAuth.:REACTOBJNAME.:", REACTOBJNAME)
            if (!REACTOBJNAME) return false;
            let currUserfunc = req.session.Userfunc;
            //sails.log("checkAuth.:currUserfunc", currUserfunc)
            if (currUserfunc)
                if (currUserfunc.length > 0)
                    return currUserfunc.indexOf(REACTOBJNAME) > -1
                else
                    return false
            else
                return false;
        } catch (error) {
            sails.log.error('checkAuth.error', req.url, error)
            return false;
        }
    },
    validateAuth: function (req,) {
        var objname = req.url;
        let currUserinfo = req.session.userinfo
        // sails.log("validateAuth.:currUserinfo:", currUserinfo)
        if (req.body) req.body = replaceTlid(req.body, currUserinfo.TLID);  //giang.ngo: replace các tham số TLID với thông tin TLID trong session
        let ischeckaccount = this.checkAccount(req, currUserinfo);
        let ischeckobjname = this.checkAuth(req, objname);
        // sails.log('validateAuth ischeckaccount: ', ischeckaccount, ' ischeckobjname: ', ischeckobjname)
        if (!ischeckaccount) return false;
        return ischeckaccount && ischeckobjname
    }
}