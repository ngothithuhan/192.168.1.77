
function showModalWarningInfoOpenAcc() {
  return {
    type: 'SHOW_MODAL_WARNING_INFO_OPEN_ACC',
    showModalWarningInfoOpenAcc: true
  }
}
function closeModalWarningInfoOpenAcc() {
  return {
    type: 'CLOSE_MODAL_WARNING_INFO_OPEN_ACC',
    showModalWarningInfoOpenAcc: false
  }
}
function showModalViewInfo() {
  return {
    type: 'SHOW_MODAL_VIEW_INFO',
    showModalViewInfo: true
  }
}
function closeModalViewInfo() {
  return {
    type: 'CLOSE_MODAL_VIEW_INFO',
    showModalViewInfo: false
  }
}
function showModalThongTinUyQuyen() {
  return {
    type: 'SHOW_MODAL_THONGTIN_UYQUYEN',
    showModalThongTinUyQuyen: true
  }
}
function closeModalThongTinUyQuyen() {
  return {
    type: 'CLOSE_MODAL_THONGTIN_UYQUYEN',
    showModalThongTinUyQuyen: false
  }
}
function showModalConfirm() {
  return {
    type: 'SHOW_MODAL_CONFIRM',
    showModalConfirm: true
  }
}
function closeModalConfirm() {
  return {
    type: 'CLOSE_MODAL_CONFIRM',
    showModalConfirm: false
  }
}
function showModalSipDetail() {
  return {
    type: 'SHOW_MODAL_SIP_DETAIL',
    showModalSipDetail: true
  }
}
function closeModalSipDetail() {
  return {
    type: 'CLOSE_MODAL_SIP_DETAIL',
    showModalSipDetail: false
  }
}
function showModalCMND() {
  return {
    type: 'SHOW_MODAL_CMND',
    showModalCMND: true
  }
}
function closeModalCMND() {
  return {
    type: 'CLOSE_MODAL_CMND',
    showModalCMND: false
  }
}
function showModalChiTiet() {
  return {
    type: 'SHOW_MODAL_CHITIET',
    showModalChiTiet: true
  }
}
function closeModalChiTiet() {
  return {
    type: 'CLOSE_MODAL_CHITIET',
    showModalChiTiet: false
  }
}
function showModalCease(detailNDTDangKy) {
  return { type: "SHOW_MODAL_CEASE", showModalCease: true, detailNDTDangKy }
}
function closeModalCease() {
  return { type: "CLOSE_MODAL_CEASE", showModalCease: false }
}
function showModalKichHoat(detailNDTDangKy) {
  return { type: "SHOW_MODAL_KICHHOAT", showModalKichHoat: true, detailNDTDangKy }
}
function closeModalKichHoat(detailNDTDangKy) {
  return { type: "CLOSE_MODAL_KICHHOAT", showModalKichHoat: false }
}
function getListSoDuHienCo(listSoDuHienCo) {
  return {
    type: "LIST_SODU_HIENCO",
    listSoDuHienCo: listSoDuHienCo
  }
}
function getListSoLenh(listSoLenh) {
  return {
    type: "LIST_SOLENH", listSoLenh
  }
}
function getListChiTietGoiSip(listChiTietGoiSip) {
  return {
    type: "LIST_CHITIET_GOISIP", listChiTietGoiSip
  }
}
function getListNDTDangKy(listNDTDangKy) {
  return {
    type: "LIST_NDT_DANGKY", listNDTDangKy
  }
}
function searchSoDuHienCo(dataSearch) {
  return {
    type: 'SEARCH_SODU_HIENCO',
    dataSearch
  }
}
function searchListSoLenh(dataSearch) {
  return { type: "SEARCH_SOLENH", dataSearch }
}
function searchListNDTDangKy(dataSearch) {
  return {
    type: "SEARCH_LISTNDT_DANGKY", dataSearch
  }
}
function searchListChiTietGoiSipNDT(dataSearch) {
  return { type: "SEARCH_LISTCHITIET_GOISIP", dataSearch }
}

//lưu data tài khoản đang đặt lệnh, dùng khi switch giữa lệnh thường và lệnh SIP
function saveDataAccountPlaceOrder(data) {
  return {
    type: "SAVE_DATA_ACCOUNT_PLACEORDER", data
  }
}
module.exports = {
  showModalWarningInfoOpenAcc, closeModalWarningInfoOpenAcc, showModalThongTinUyQuyen, closeModalThongTinUyQuyen, showModalChiTiet, closeModalChiTiet, getListSoDuHienCo,
  searchSoDuHienCo, searchListSoLenh, getListSoLenh, getListNDTDangKy, getListChiTietGoiSip, searchListNDTDangKy,
  showModalCease, closeModalCease, closeModalKichHoat, showModalKichHoat, searchListChiTietGoiSipNDT, showModalConfirm,
  closeModalConfirm, showModalCMND, closeModalCMND, showModalSipDetail, closeModalSipDetail, showModalViewInfo, closeModalViewInfo,
  saveDataAccountPlaceOrder
};
