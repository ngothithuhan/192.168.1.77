//lenh giao dich
import PLACEORDER from 'DatLenh';
import PLACEORDEREX from 'DatLenh';
import PLACEORDERSIP from 'DauTuDinhKi';
import PLACEORDERSIPEX from 'DauTuDinhKi';
import OTPCONFIRMOD from './VSD/QLDSLenhChuaNhapOTP/QLDSLenhChuaNhapOTP';
import REFUNDCASHBYORDER from './VSD/HoanTienTheoTungLenh/HoanTienTheoTungLenh';
import REFUNDCASH from './VSD/HoanTienTheoTK/HoanTienTheoTK';
import ODSTSMANAGER from './VSD/CapnhatTrangthaiLenhmuaDaTT/CapnhatTrangthaiLenhmuaDaTT';
import MATCHINGOD from './VSD/KhopLenhManual/KhopLenhManual';
import CLOSEORDERBOOK from './VSD/DongSoLenh/DongSoLenh';
import ODCASHCOMPLETE from './VSD/GhiNhanLenhDaTT/GhiNhanLenhDaTT';
import IMPORTORDERS from './VSD/Import/Import';
import IMPORTORDERSEX from './VSD/Import/Import';
import IMPANDCOMPARE from './VSD/Import/Import';
import IMPUSERS from './VSD/Import/Import';

import SIPSTSMANAGER from './VSD/DKSIPs/DKSIPs';
import PORTFOLIO from './VSD/DanhMucDauTu/DanhMucDauTu';
import PORTFOLIONAV from './VSD/DanhMucDauTuNAV/DanhMucDauTuNAV';
import ODTRANSHIST from './VSD/TruyVanLichSuGiaoDich/TruyVanLichSuGiaoDich';
import ODTRANSBALANCE from './VSD/TruyVanThongTinSoDu/TruyVanThongTinSoDu';
import PAYMENTORDER from './VSD/InUyNhiemChi/InUyNhiemChi';
import ODCONFIRM from './VCBF/DuyetLenhCoPhieuLenhGoc/DuyetLenhCoPhieuLenhGoc';
import IVWITHDRAW from './VCBF/RutTienKhaDung/RutTienKhaDung';
import OVERVIEWPROPERTY from './VSD/TongQuanTaiSan/TongQuanTaiSan';


import CUSTOMER4SALE from './VCBF/KhachHangDangKyMoiGioi/KhachHangDangKy';
import CFORDERCONFIRM from './VCBF/XacNhanLenhDatHo/XacNhanLenhDatHo';
import IMPORTCAREBY from './VSD/Import/Import';
import MANAGEORDERFROMBANK from './VSD/QuanLyLenhTuBank/MANAGEORDERFROMBANK'

import AMENDSIPCONFIRM from './VCBF/QuanLyLenhSipDaSua/QuanLyLenhSipDaSua';
//tai khoan giao dich
import APPROVEACCT from './VSD/DuyetQuanLyTK/DuyetQuanLyTK';
import APPROVEORIGINALFILE from './VSD/DuyetHoSoGoc/DuyetHoSoGoc';
import VSDACCTMESSAGE from './VSD/DanhSachTKVSDXacNhan/DanhSachTKVSDXacNhan';
import STPLIST from './VSD/DanhSachDien/DanhSachDien';
import CRM from './VSD/TichHopCRM/CRM';
import MANAGERACCT from './VSD/QLTTTK_NDT/QuanLyTK/QuanLyTK';
// import MANAGERACCT from './VSD/QLTTTK_NDT/QuanLyTK/NhaDauTu/NhaDauTu';


import UPLOADMANAGER from './VSD/QLTTTK_NDT/QuanLyTK/UploadManager';
import MANAGERACCTEX from './VSD/QLTTTK_NDT/QuanLyTK/QuanLyTK'
// import CHANGEACCT from './VSD/ThayDoiTT_VSD_Duyet/ThayDoiTT_VSD_Duyet';
import OTPCONFIRMCF from 'app/components/VSD/CanBoXacNhanOTP/DSXacNhanOTP';
import INTERNALACCOUNT from './VSD/QLTTTK_NDT/QuanLyTK/INTERNALACCOUNT/INTERNALACCOUNT';
import COMPANYACCOUNT from './VSD/QLTTTK_NDT/QuanLyTK/COMPANYACCOUNT/COMPANYACCOUNT';

import ORIGINALORDER from './VSD/OriginalOrder/UploadOriginalOrder';
import MANAGERORIGINALORDER from './VSD/OriginalOrder/ManagerUploadOriginalOrder';
// import ACTIVEACCT from 'app/components/active.js';
import BLOCKACCTCF from './VSD/Phongtoa/phongtoa';
import UNBLOCKACCT from './VSD/giaitoa/giaitoa';
import REQCLSACCT from './VSD/CCQ/CCQ';
import CANCELREQCLSACCT from './VSD/CCQ_Reject/CCQ_Reject';
import COMPLETECLSACCT from './VSD/CCQ_HoanTat/CCQ_HoanTat';
import CFWVSDCONFIRM from './VSD/TKGD_VSDXacNhan/TKGD_VSDXacNhan';
import CFCOMPLETEEDIT from './VSD/ThayDoiTT_VSD_Duyet_Hoantat/ThayDoiTT_VSD_Duyet_Hoantat';
//import CLASSCUSTOMER from './VSD/QLTTTK_NDT/PhanLoaiKH/PhanLoaiKH';
//import IMPORTOPNACC from './VSD/Import/Import';
import IMPORTOPNACCEX from './VSD/Import/Import';
import CUSIMPSALE from './VSD/Import/Import';
import CCQIMP from './VSD/Import/Import';
import CUSTOMERIMP from './VSD/Import/Import';
import SENDEMAIL from 'app/components/VSD/SendEmail/Sendemail'
import EMAIL2CUST from 'app/components/VSD/ThemEmailGuiKH/ThemEmailGuiKH'
import RESETCUSTPASS from './VSD/CapLaiMkKh/CapLaiMkKh';
import CHANGEGROUPCAREBY from './VCBF/ChuyenNhomCareByKH/ChuyenNhomCareByKH';

//quan ly tien
import IVCASHBACK from './VSD/Import/Import';
import IVCASHBACKCONFIRM from './VCBF/XNTraTienThua/XNTraTienThua';
import IVIMP from './VSD/Import/Import';
//import SALEIMP from './VSD/ImportMoiGioi/ImportMoiGioi';
import SELLMONEYCONFIRM from './VCBF/XNBangKeTT/XNBangKeTT'
import MODCASH from './VCBF/DieuChinhNoiDungNopTien/DieuChinhNDNopTien'
import PARAMSYSVAR from './VCBF/ThamSoHeThong/EditSysvar'


//chung chi quy
import REQTRANFERFUND from './VSD/CKCCQ/CKCCQ';
import REJECTREQTRANFERFUND from './VSD/CKCCQtuchoi/CKCCQtuchoi';
import COMPLETEREQTRANFERFUND from './VSD/CKCCQxacnhan/CKCCQxacnhan';
import RECEIVINGFUND from './VSD/NhanCKCCQ/NhanCKCCQ';
import SEBLOCKED from './VCBF/PhongToaCQQ/PhongToaCCQ';
import SEUNBLOCKED from './VCBF/GiaiToaCQQ/GiaiToaCCQ';
//Dự kiến khớp lệnh
import FEECACULATE from './VSD/DuKienKhop/DuKienKhop';
import CHANGEORDERSESSION from './VSD/DoiPhienGDLenhDat/DoiPhienGDLenhDat';
//Phí quản lý tài khoản theo phiên
import MANAGERFEE from './VSD/PhiQuanLyTaiKhoan/PhiQuanLy';
//moi gioi
import SALESMANEGER from './VSD/ThietlapHethong/RE002/RE002';
import SALESPRODUCTS from './VSD/ThietlapHethong/QLLoaiHinhMG/QLLoaiHinhMG';
import DOANHSO from './VSD/ThietlapHethong/QLDoanhSo/QLDoanhSo';
import SALESGROUP from './VSD/ThietlapHethong/RE001/RE001';
//import ASSIGNBRANCH4SALES from './VSD/ThietlapHethong/RE003/RE003';
import ASSIGNSALE4GROUP from './VSD/ThietlapHethong/ThemMG_Nhom/ThemMG_Nhom';
import ASSIGNCUSTOMER4SALES from './VSD/ThietlapHethong/RE004/RE004';
import MOVESALES from './VSD/ThietlapHethong/ChuyenMG_TK/ChuyenMG_TK';
import MOVESALES4ORDER from './VSD/ThietlapHethong/GanCNSale/GanCNSale';
import MOVEGROUPSALES from './VSD/ThietlapHethong/GanMG_Nhom/GanMG_Nhom';
//import KPI from './VSD/ThietlapHethong/QLKPI/QLKPI';

//Quan tri HT
import TRANSACTIONS from './VSD/QLTTTK_NDT/DuyetGiaoDich/DuyetGiaoDich';
import USERS from './VSD/QLTT_USER/User/User';
import SYNCCAREBY from './VSD/QLTT_USER/Synccareby/Synccareby';
import ADDUSERTOGROUP from './VSD/QLTT_USER/GanUserVaoNhom/GanUserVaoNhom';
import GROUPS from './VSD/QLTT_USER/Group/Group';
import MEMBERS from './VSD/ThietlapHethong/QLToChucNH/QLToChucNH';
import BRANCH from './VSD/ThietlapHethong/QuanLyChiNhanh/QuanLyChiNhanh';
import AREA from './VSD/ThietlapHethong/QLKhuVuc/QLKhuVuc';
import FUNDPRODUCT from './VSD/ThietlapHethong/QLQM/QLQM';
import PRODUCTINFO from './VSD/ThietlapHethong/QLThongTinSanPham/QLThongTinSanPham';
import BANK4FUND from './VSD/ThietlapHethong/QLDSTKNHThuHuongQuy/QLDSTKNHThuHuongQuy';
//import FEEMASTER from './VSD/ThietlapHethong/QuanLyBieuPhi/QuanLyBieuPhi';
import CFVIP from './VSD/QuanlyTien/TKGDDep/TKGDDep';
import MARKET from './VSD/ThietlapHethong/ChiSoThiTruong/ChiSoThiTruong';
import NAV from './VSD/QuanlyTien/NhapNAV/NhapNAV';
import ENDMONTHNAV from './VSD/QuanlyTien/NhapNAVCuoiThang/NhapNAVCuoiThang';
import ALERT from './VSD/ThietlapHethong/QLThongBao/QLThongBao';
import CALENDAR from './VSD/ThietlapHethong/Celendar/Celendar';
import CALENDARSIP from './VSD/ThietlapHethong/Celendar/CelendarSIP';
import FEETYPE from './VSD/ThietlapHethong/QuanLyBieuPhi/QuanLyBieuPhi';
import PARAMCUSTOMER from './VSD/ThietlapHethong/ThamSoReviewPLKH/ThamSoReviewPLKH';
import CAMAST from './VSD/QuanlyTien/SKQDHCD/SKQDHCD';
//import FEEASSIGN from './VSD/ThietlapHethong/GanBieuPhi/GanBieuPhi';
import BATCHEOD from './VSD/Batch/Batch';
import TRANSHIST from './VSD/ThietlapHethong/TransHistory/TransHistory';
import USERINGROUP from './VSD/ThietlapHethong/QLUserTheoNhomNSD/QLUserTheoNhomNSD';
import RESETUSERPASS from './VSD/CapLaiMK/CapLaiMK';
import MANAGEREMAIL from 'app/components/VSD/QuanLyEmail/QuanLyEmail';
import MANAGEREMAILHIST from 'app/components/VSD/QuanLyGuiEmailAll/QuanLyGuiEmailAll';
import CANCLECALIST from './VSD/CancelSKQ/CancelSKQ';
import CREATCALIST from './VSD/BlockSKQ/BlockSKQ';
import SRRECONCILE from './VSD/DoiChieuLenh/DoiChieuLenh';
import BALANCE from './VSD/TruyVanThongTinSoDu/TruyVanThongTinSoDu';
import BALANCENAV from './VSD/TruyVanThongTinSoDuNAV/TruyVanThongTinSoDuNAV';
import REPORT from './VSD/Report/TraCuuBaoCao';
import VSDREPORT from './VSD/Report/TraCuuBaoCaoVSD';
import CLOSETRADINGSESSION from './VSD/DongSoLenhUser/DongSoLenhUser';
import CONFIRMCUSTOMERREGISTERSALE from './VCBF/DuyetDangKyMoiGioiNDT/DuyetDangKyMoiGioiNDT';
import CASHTRANSACTIONHIS from './VCBF/SaoKeLSGDTien/SaoKeLSGDTien';
import FUNDTRANSACTIONHIST from './VCBF/SaoKeCCQ/SaoKeCCQ';
import Notfound from './Notfound';
import CHANGEUSERNAME from './VCBF/AccountInfo/changeUsername';
import COMISSION from './VSD/ThietlapHethong/QLDoanhSo/QLDoanhSo';
import WITHDRAWBROCKER from './VSD/ThietlapHethong/RutMG/RutMG';
import EXPECTNAV from './VSD/QuanlyTien/NhapNAVDuKien/NhapNAVDuKien';
import ENDMONTHFEE from './VSD/QuanlyTien/NhapPhiCuoiThang/NhapPhiCuoiThang';
import RECEIVEMONEY from './VSD/QuanlyTien/QuanLyTienThanhToan/QuanLyTienThanhToan';
import FEE4GROUPS from './VSD/ThietlapHethong/QLHoaHongTinhTheoNAV/QuanLyPhiHoaHong';
import HOLDINGPERIODFUND from './VSD/ThietlapHethong/QLThoiGianNamGiuCCQ/QuanLyThoiGianNamGiuCCQ';
//#9ed4f5



import CREATEACCOUNTEKYC from './OpenAccount/CreateAccount';




//man hinh ngan hang giam sat
const components = {
  ENDMONTHFEE,
  ENDMONTHNAV,
  ADDUSERTOGROUP,
  SYNCCAREBY,
  CUSTOMERIMP,
  PORTFOLIONAV,
  BALANCENAV,
  EXPECTNAV,
  WITHDRAWBROCKER,
  COMISSION,
  CHANGEUSERNAME,
  CCQIMP,
  IMPUSERS,
  FUNDTRANSACTIONHIST,
  CASHTRANSACTIONHIS,
  CONFIRMCUSTOMERREGISTERSALE,
  CUSTOMER4SALE,
  //SALEIMP,
  CLOSETRADINGSESSION,
  BALANCE,
  SRRECONCILE,
  Notfound,
  PORTFOLIO,
  //lenh giao dich
  PAYMENTORDER,
  SIPSTSMANAGER,

  CREATEACCOUNTEKYC,

  OVERVIEWPROPERTY, //tổng quan tài sản
  PLACEORDER,
  PLACEORDERSIP,
  PLACEORDEREX,
  PLACEORDERSIPEX,
  ODCONFIRM,
  CFORDERCONFIRM,
  AMENDSIPCONFIRM,
  // CANCELORDEREX,
  // AMENDORDEREX,
  OTPCONFIRMOD,
  REFUNDCASHBYORDER,
  REFUNDCASH,
  ODCASHCOMPLETE,
  MATCHINGOD,
  CLOSEORDERBOOK,
  ODSTSMANAGER,
  IMPORTORDERS,
  IMPORTORDERSEX,
  ODTRANSHIST,
  RESETCUSTPASS,
  IMPORTCAREBY,
  MANAGEORDERFROMBANK,
  //tai khoan giao dich
  APPROVEACCT,
  APPROVEORIGINALFILE,
  VSDACCTMESSAGE,
  STPLIST,
  CRM,
  MANAGERACCT,
  UPLOADMANAGER,
  MANAGERACCTEX,
  // CHANGEACCT,
  OTPCONFIRMCF,
  INTERNALACCOUNT,
  COMPANYACCOUNT,
  // ACTIVEACCT,
  BLOCKACCTCF,
  UNBLOCKACCT,
  REQCLSACCT,
  CANCELREQCLSACCT,
  COMPLETECLSACCT,
  CFWVSDCONFIRM,
  CFCOMPLETEEDIT,
  //CLASSCUSTOMER,
  //IMPORTOPNACC,
  CUSIMPSALE,
  IMPORTOPNACCEX,
  IMPANDCOMPARE,
  SENDEMAIL,
  MANAGEREMAIL,
  MANAGEREMAILHIST,
  EMAIL2CUST,
  CHANGEGROUPCAREBY,
  //REPORT
  REPORT,
  VSDREPORT,
  //quan ly tien
  IVWITHDRAW,
  IVCASHBACK,
  IVCASHBACKCONFIRM,
  IVIMP,
  SELLMONEYCONFIRM,
  MODCASH,
  PARAMSYSVAR,
  RECEIVEMONEY,
  //chung chi quy
  REQTRANFERFUND,
  REJECTREQTRANFERFUND,
  COMPLETEREQTRANFERFUND,
  RECEIVINGFUND,
  SALESMANEGER,
  SALESPRODUCTS,
  SALESGROUP,
  //Du kien khop
  FEECACULATE,
  CHANGEORDERSESSION,
  //Phi Quan ly
  MANAGERFEE,

  //ASSIGNBRANCH4SALES,
  ASSIGNSALE4GROUP,
  ASSIGNCUSTOMER4SALES,
  MOVESALES,
  MOVESALES4ORDER,
  MOVEGROUPSALES,
  //KPI,
  SEBLOCKED,
  SEUNBLOCKED,

  //Quan tri HT
  TRANSACTIONS,
  USERS,
  GROUPS,
  MEMBERS,
  BRANCH,
  FUNDPRODUCT,
  PRODUCTINFO,
  BANK4FUND,
  //FEEMASTER,
  CFVIP,
  MARKET,
  NAV,
  ALERT,
  CALENDAR,
  CALENDARSIP,
  FEETYPE,
  PARAMCUSTOMER,
  //FEEASSIGN,
  CAMAST,
  BATCHEOD,
  TRANSHIST,
  CANCLECALIST,
  CREATCALIST,
  AREA,
  USERINGROUP,
  RESETUSERPASS,
  DOANHSO,
  ORIGINALORDER,
  MANAGERORIGINALORDER,
  FEE4GROUPS,
  HOLDINGPERIODFUND
}

module.exports = components;