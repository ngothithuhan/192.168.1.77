export const DefaultPagesize = 10;
export const amt_width = 120;
export const qtty_width = 130;
export const date_width = 70;
export const custodycd_width = 110;
export const symbol_width = 120;
export const CUTOMERTLID = '686868';//la kh
export const SRTYPE_CR = "CR";//huy ban doi voi lenh sip
export const SRTYPE_AR = "AR";//sua ban doi voi lenh sip
export const SRTYPE_NS = "NS";//mua
export const SRTYPE_NR = "NR";//ban
export const SRTYPE_SW = "SW";//hoan doi
export const CUSTYPE_CN = "CN";//loai kh ca nhan
export const CUSTYPE_TC = "TC";//loai kh to chuc
export const IDTYPE_004 = "004";//loai DKSH chung thu khac
export const IDTYPE_005 = "005";//loai DKSH giay phep KD
export const IDTYPE_009 = "009";//loai DKSH trading code
export const COUNTRY_234 = "234";//quoc tich VN
export const ACTYPE_TT = "TT";//loai kh thong thuong
export const GRINVESTOR_TN = "TN"//phan loai KH trong nuoc
export const GRINVESTOR_NN = "NN"//phan loai KH nuoc ngoai
export const COLORNS = "#0076a3"//mau lenh mua
export const COLORNR = "#808284"//mau lenh ban
export const COLORSW = "#ef4322"//mau lenh hoan doi
export const COLORGRAY = "rgb(128, 130, 132)"
export const COLORBLACK = "#808284"

export const COLORNS_NEW = "#DF7A00"//mau lenh mua
export const COLORNR_NEW = "#C60C30"//mau lenh ban
export const COLORSW_NEW = "#161C26"//mau lenh hoan doi

export const IMGMAXW = 350//chieu rong hinh
export const IMGMAXH = 300//chieu dai hinh
export const LANGUAGE_KEY = 'vfmLanguage'
export const ArrSpecial = ['IDCODE', 'PHONE', 'ORDERID', 'MOBILE', 'BANKCODE', 'CITYBANK', 'TAXNO', 'IDTYPE', 'SỐ ĐKSH',
    'BANKACC', 'FEEID', 'SWFEEID', 'FILEID', 'REFTXNUM', 'SYSORDERID', 'VSDORDERID', 'TLID', 'GRPID', 'SHORTNAME', 'AREAID',
    'MBID', 'BRID', 'ID', 'AUTOID', 'YEARCD', 'ACCTREF', 'GRLLEVEL', 'BRTELE', 'RATE', 'ISINCODE', 'CAREBY', 'ACCTNO', 'TXNUM', 'NEWCARE', 'REACCTNO', 'AUTHPHONE',
    'AUTHIDCODE',
    'REFIDCODE1',
    'REFMOBILE1', 'DBCODE',
    'SALEID', 'CONTRACTNO', 'MACHUNGTU', 'NEWSALEACCTNO', 'OLDSALEACCTNO', 'MATKMOIGIOIMOI',
    'MOBILE', 'BANKACC', 'BANKCODE', 'THRESHOLD', 'BRID', 'MBCODE1'] //la so nhung dang string
export const AllKeyLang = ['vie', 'en'] //all key ngon ngu trong vfm
export const PASSWORD_LENGTH = 8
export const PIN_LENGTH = 6
export const ISCHECKSPECIALCHARACTER = true
export const ISCHECKSPECIALCHARACTER_PIN = false
export const maximumSize = 2000000
export const ArraySpecialImport = ['DELTD', 'STATUS', 'ERRMSG'] //nhung truong xuat hien sau khi import thanh cong

export function getAmountByExectype(type, amount, qtty) {
    return type == SRTYPE_NS ? amount : qtty;
}
export function getRowTextTable(lang) {
    if (lang == 'vie') return 'dòng'
    else return 'rows'
}
export function getPageTextTable(lang) {
    if (lang == 'vie') return 'Trang'
    else return 'Page'
}
// export function getObjname(){
//     return window.location.pathname.replace('/','');
// }

export function checkValidDate(text) {
    try {
        var comp = text.split('/');
        var m = parseInt(comp[1], 10);
        var d = parseInt(comp[0], 10);
        var y = parseInt(comp[2], 10);
        var date = new Date(y, m - 1, d);
        if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
            return true
        }
    } catch (error) {
        console.log('co loi checkValidDate')
    }
    return false
}

export function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line
    return re.test(email)
}

export function saveLanguageKey(language) {
    localStorage.setItem(LANGUAGE_KEY, language)
}

export function getLanguageKey() {
    //console.log('localStorage.getItem(LANGUAGE_KEY)',localStorage.getItem(LANGUAGE_KEY))
    return localStorage.getItem(LANGUAGE_KEY)
}

let lang_vie = 'vie';
let lang_en = 'en';
export function getExtensionByLang(key, lang) {
    let ext = ''
    switch (lang) {
        case lang_en:
            ext = ""
            break;

        default:
            break;
    }
    return key + ext;
}

export const METHODS_FIX = "FIX";//SIP co dinh
export const METHODS_FLEX = "FLX";//SIP linh hoat

export const COUNTDOWN_PLACEORDER = 5 * 60; // thời gian countdown PIN/OTP đặt lệnh, đơn vị : giây
export const COUNTDOWN_OTP_ACCOUNT = 5 * 60; //thời gian countdown OTP mở/sửa tài khoản, đơn vị : giây
export const EVENT = {
    CANCEL_ORDER_IF_TIMEOUT_NORMAL: 'CANCEL_ORDER_IF_TIMEOUT_NORMAL', //hủy lệnh nếu ko nhập OTP/PIN sau khoảng thời gian timeout
    CANCEL_ORDER_IF_TIMEOUT_SIP: 'CANCEL_ORDER_IF_TIMEOUT_SIP', //hủy lệnh sip
    RETURN_TABLE_ACC: 'RETURN_TABLE_ACC', //trở về quản lý tài khoản
    CLOSE_POPUP_WARNING_ACC: 'CLOSE_POPUP_WARNING_ACC',
    TIME_UP_CLOSE_OTP: 'TIME_UP_CLOSE_OTP'// AUTO CLOSE POPUP WHEN TIMEUP
}

export const MAXSIZE_PDF = 5 * 1024 * 1024;
//EKYC
export const TYPE_IMG = {
    FRONT: 'FRONT', // Mặt trước FRONT
    BACK: 'BACK', // Mặt sau BACK
    FACE: 'FACE', // Gương mặt FACE
}
export const USER_TYPE_OBJ = { //loại người dùng khi mở tài khoản
    CNTN: 'CNTN', //cá nhân trong nước
    CNNN: 'CNNN', //cá nhân ngoài nước
    TCTN: 'TCTN', //tổ chức trong nước
    TCNN: 'TCNN' //tổ chức ngoài nước
}

export const ACTIONS_ACC = {
    EDIT: 'update',
    CREATE: 'add',
    DELETE: 'DELETE',
    VIEW: 'view',
    CLONE: 'clone'
}

export const EXPIRED_DATE_ID = 15;// NGÀY HẾT HẠN CMND, CỘNG THÊM 15 NĂM

export const IMPORT_FILE_TYPE_BIDV = 'I028';

export const COUNT_OTP_FAIL = 5// Số lần OTP có thể nhập sai

export const WAIT_OTP_FAIL = 60 //Thời gian chờ sau khi nhập sai OTP 5 lần

export const DISABLE_CUSTODYCD_STARTWITH = ['003'];  //Chặn không cho KH của 003 được sửa thông tin tài khoản
export const DISABLE_EDIT_ACCOUNT = true;


