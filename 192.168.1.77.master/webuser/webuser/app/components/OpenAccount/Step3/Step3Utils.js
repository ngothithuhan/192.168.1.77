import RestfulUtils from 'app/utils/RestfulUtils';
import { USER_TYPE_OBJ, EXPIRED_DATE_ID, GRINVESTOR_TN, GRINVESTOR_NN, COUNTRY_234 } from 'app/Helpers';
import _ from 'lodash';
import moment from 'moment';

//mảng lưu các state hiển thị với cá nhân trong nước (mở tài khoản EKYC)
export const ARR_ALLOW_CNTN = [
    'FULLNAME',
    'BIRTHDATE',
    'SEX',
    'NATIONALITY',
    'IDTYPE',
    'IDCODE_NO',
    'IDCODE_DATE',
    'IDCODE_ADDRESS',
    'SIGNATURE',

    'COUNTRY_ADDRESS',
    'ADDRESS', //địa chỉ thường trú, địa chỉ liên hệ
    'COUNTRY_REGADDRESS',
    'REGADDRESS',

    'EMAIL',
    'PHONE_CONTACT',

    'BANK_NO',
    'BANK_NAME',
    'BANK_BRANCH',


    'IS_ONLINE',
];

//mảng lưu các state hiển thị với cá nhân ngoài nước (mở tài khoản EKYC)
export const ARR_ALLOW_CNNN = [
    'FULLNAME',
    'BIRTHDATE',
    'SEX',
    'NATIONALITY',
    'IDTYPE',
    'IDCODE_NO',
    'IDCODE_DATE',
    'IDCODE_ADDRESS',
    'SIGNATURE',

    // 'COUNTRY_ADDRESS',
    'ADDRESS', //địa chỉ tạm trú tại VN
    'COUNTRY_REGADDRESS',
    'REGADDRESS',

    'EMAIL',
    'PHONE_CONTACT',

    'BANK_NO',
    'BANK_NAME',
    'BANK_BRANCH',


    'IS_ONLINE',
];

//mảng lưu các state hiển thị với tổ chức trong nước (mở tài khoản EKYC)
export const ARR_ALLOW_TCTN = [
    'FULLNAME',
    'NATIONALITY',
    'TAX_NUMBER',

    'IDTYPE',
    'IDCODE_NO',
    'IDCODE_DATE',
    'IDCODE_ADDRESS',

    'COUNTRY_ADDRESS',
    'ADDRESS', //địa chỉ trụ sở chính

    'EMAIL',
    'PHONE_CONTACT',

    'LAW_FULLNAME',
    'LAW_BIRTHDAY',
    'LAW_NATIONALITY',
    'LAW_POSITION',
    'LAW_IDCODE_NO',
    'LAW_IDCODE_DATE',
    'LAW_IDCODE_ADDRESS',
    'LAW_PHONE_CONTACT',
    //'LAW_EMAIL',

    'BANK_NO',
    'BANK_NAME',
    'BANK_BRANCH',

    'IS_ONLINE',


    //hiển thị tiêu đề section
    'SECTION_DAI_DIEN_PHAP_LUAT',
    //add space
    'PADDING_EKYC'
];

//mảng lưu các state hiển thị với tổ chức ngoài nước (mở tài khoản EKYC)
export const ARR_ALLOW_TCNN = [
    'FULLNAME',
    'NATIONALITY',
    'TAX_NUMBER',

    'IDTYPE',
    'IDCODE_NO',
    'IDCODE_DATE',
    'IDCODE_ADDRESS',

    // 'ISSUED_NO',// đăng ký sở hữu
    // 'ISSUED_DATE',
    // 'ISSUED_ADDRESS',

    'BUSSINESS_NO', //đăng ký kinh doanh
    'BUSSINESS_DATE',
    'BUSSINESS_ADDRESS',

    'COUNTRY_ADDRESS',
    'ADDRESS', //địa chỉ trụ sở chính
    'REGADDRESS',

    'EMAIL',
    'PHONE_CONTACT',

    'LAW_FULLNAME',
    'LAW_BIRTHDAY',
    'LAW_NATIONALITY',
    'LAW_POSITION',
    'LAW_IDCODE_NO',
    'LAW_IDCODE_DATE',
    'LAW_IDCODE_ADDRESS',
    'LAW_PHONE_CONTACT',
    //'LAW_EMAIL',

    'BANK_NO',
    'BANK_NAME',
    'BANK_BRANCH',

    'IS_ONLINE',


    //hiển thị tiêu đề section
    'SECTION_DAI_DIEN_PHAP_LUAT',
    //add space
    'PADDING_EKYC',
    'PADDING_EKYC2'
];

//mảng lưu các state hiển thị với cá nhân trong nước (sửa tài khoản)
export const ARR_ALLOW_CNTN_EDIT = [
    'FULLNAME',
    'BIRTHDATE',
    'SEX',
    'NATIONALITY',
    'IDTYPE',

    'IDCODE_NO',
    'IDCODE_DATE',
    'IDCODE_ADDRESS',

    'SIGNATURE',

    'COUNTRY_ADDRESS',
    'ADDRESS', //địa chỉ thường trú, địa chỉ liên hệ
    'COUNTRY_REGADDRESS',
    'REGADDRESS',

    'EMAIL',
    'PHONE_CONTACT',

    'BANK_NO',
    'BANK_NAME',
    'BANK_BRANCH',

    'IS_FATCA',
    'IS_AGREE',
    'IS_AUTHORIZED',
    'IS_ONLINE',

    'CUSTTYPE',
    'OTHER_NATIONALITY',
    'JOB',
    'BUSINESS_AREAS',
    'POSITION',
    'WORK_ADDRESS',
    'TAX_NUMBER',
    'TAX_COUNTRY',
    'FAX',

    'CAREBY_GROUP',
    'CAREBY_PERSON',

    'INVEST_TIME',
    'RISK',
    'EXPERIENCE',

    //hiển thị tiêu đề section
    'SECTION_UY_QUYEN',
    'SECTION_IS_FATCA',
    'SECTION_BROKER',
    'SECTION_CONTRACT',
    'SECTION_INVEST'
];

//mảng lưu các state hiển thị với cá nhân ngoài nước (sửa tài khoản)
export const ARR_ALLOW_CNNN_EDIT = [
    'FULLNAME',
    'BIRTHDATE',
    'SEX',
    'NATIONALITY',
    'IDTYPE',
    'PASSPORT',
    'PASSPORTDATE',
    'PASSPORTPLACE',

    // 'ISSUED_NO',
    // 'ISSUED_DATE',
    // 'ISSUED_ADDRESS',

    'IDCODE_NO',
    'IDCODE_DATE',
    'IDCODE_ADDRESS',

    'SIGNATURE',

    // 'COUNTRY_ADDRESS',
    'ADDRESS', //địa chỉ tạm trú tại VN
    'COUNTRY_REGADDRESS',
    'REGADDRESS',
    'EMAIL',
    'PHONE_CONTACT',

    'BANK_NO',
    'BANK_NAME',
    'BANK_BRANCH',

    'IS_FATCA',
    'IS_AGREE',
    'IS_AUTHORIZED',
    'IS_ONLINE',
    'CUSTTYPE',
    'OTHER_NATIONALITY',
    'TAX_COUNTRY',
    'TAX_NUMBER',
    'FAX',
    'REASON_ENTRY',
    'VISA_NO',

    'CAREBY_GROUP',
    'CAREBY_PERSON',

    'INVEST_TIME',
    'RISK',
    'EXPERIENCE',

    //hiển thị tiêu đề section
    'SECTION_UY_QUYEN',
    'SECTION_IS_FATCA',
    'SECTION_BROKER',
    'SECTION_CONTRACT',
    'SECTION_INVEST',
];

//mảng lưu các state hiển thị với tổ chức trong nước (sửa tài khoản)
export const ARR_ALLOW_TCTN_EDIT = [
    'FULLNAME',
    'NATIONALITY',
    'OTHER_NATIONALITY',
    'TAX_NUMBER',
    'IDTYPE',

    // 'ISSUED_NO',
    // 'ISSUED_DATE',
    // 'ISSUED_ADDRESS',

    'IDCODE_NO',
    'IDCODE_DATE',
    'IDCODE_ADDRESS',


    'COUNTRY_ADDRESS',
    'ADDRESS', //địa chỉ trụ sở chính
    'EMAIL',
    'PHONE_CONTACT',

    'LAW_FULLNAME',
    'LAW_BIRTHDAY',
    'LAW_NATIONALITY',
    'LAW_POSITION',
    'LAW_IDCODE_NO',
    'LAW_IDCODE_DATE',
    'LAW_IDCODE_ADDRESS',
    'LAW_PHONE_CONTACT',
    // 'LAW_EMAIL',

    'BANK_NO',
    'BANK_NAME',
    'BANK_BRANCH',

    'IS_FATCA',
    'IS_AUTHORIZED',
    'IS_AGREE',
    'IS_ONLINE',


    'CUSTTYPE',

    'FAX',
    'TAX_COUNTRY',

    'CAREBY_GROUP',
    'CAREBY_PERSON',


    'INVEST_TIME',
    'RISK',
    'EXPERIENCE',

    'LAW_GENDER',
    'LAW_VISA_NO',
    'LAW_VISA_DATE',
    'LAW_VISA_ADDRESS',

    'CAPITAL_NAME',
    'CAPITAL_POSITION',
    'CAPITAL_ID_NO',
    'CAPITAL_ID_DATE',
    'CAPITAL_ID_ADDRESS',
    'CAPITAL_PHONE',
    'CAPITAL_EMAIL',

    //hiển thị tiêu đề section
    'SECTION_UY_QUYEN',
    'SECTION_DAI_DIEN_PHAP_LUAT',
    'SECTION_IS_FATCA',
    'SECTION_BROKER',
    'SECTION_INVEST',
    'SECTION_CAPITAL',
    'SECTION_CONTRACT',

    //PADDING, add space
    'PADDING1'
];

//mảng lưu các state hiển thị với tổ chức ngoài nước (sửa tài khoản)
export const ARR_ALLOW_TCNN_EDIT = [
    'FULLNAME',
    'NATIONALITY',
    'OTHER_NATIONALITY',
    'TAX_NUMBER',
    'IDTYPE',

    // 'ISSUED_NO',// đăng ký sở hữu
    // 'ISSUED_DATE',
    // 'ISSUED_ADDRESS',

    'IDCODE_NO',
    'IDCODE_DATE',
    'IDCODE_ADDRESS',

    'BUSSINESS_NO', //đăng ký kinh doanh
    'BUSSINESS_DATE',
    'BUSSINESS_ADDRESS',


    'COUNTRY_ADDRESS',
    'ADDRESS', //địa chỉ trụ sở chính
    'REGADDRESS',
    'EMAIL',
    'PHONE_CONTACT',

    'LAW_FULLNAME',
    'LAW_BIRTHDAY',
    'LAW_NATIONALITY',
    'LAW_POSITION',
    'LAW_IDCODE_NO',
    'LAW_IDCODE_DATE',
    'LAW_IDCODE_ADDRESS',
    'LAW_PHONE_CONTACT',
    //'LAW_EMAIL',

    'BANK_NO',
    'BANK_NAME',
    'BANK_BRANCH',

    'IS_FATCA',
    'IS_AUTHORIZED',
    'IS_AGREE',
    'IS_ONLINE',

    'CUSTTYPE',


    'FAX',
    'TAX_COUNTRY',

    'CAREBY_GROUP',
    'CAREBY_PERSON',


    'INVEST_TIME',
    'RISK',
    'EXPERIENCE',

    'LAW_GENDER',
    'LAW_VISA_NO',
    'LAW_VISA_DATE',
    'LAW_VISA_ADDRESS',

    'CAPITAL_NAME',
    'CAPITAL_POSITION',
    'CAPITAL_ID_NO',
    'CAPITAL_ID_DATE',
    'CAPITAL_ID_ADDRESS',
    'CAPITAL_PHONE',
    'CAPITAL_EMAIL',


    //hiển thị tiêu đề section
    'SECTION_UY_QUYEN',
    'SECTION_DAI_DIEN_PHAP_LUAT',
    'SECTION_IS_FATCA',
    'SECTION_BROKER',
    'SECTION_INVEST',
    'SECTION_CAPITAL',
    'SECTION_CONTRACT',

    //add space
    'PADDING1',
    'PADDING2'
];

export const getIdType = (dataState, language) => {
    let inputs = buildInputsData(dataState, language)

    return new Promise(async (resolve, reject) => {
        let res = await RestfulUtils.post("/account/getidtype", {
            // action: "add",
            // country: "234",
            // custtype: "CN",
            // grinvestor: "TN",
            // language: "vie"
            action: inputs.action ? inputs.action : 'add',
            country: inputs.country ? inputs.country : '',
            custtype: inputs.custtype ? inputs.custtype : '',
            grinvestor: inputs.grinvestor ? inputs.grinvestor : '',
            language: inputs.language ? inputs.language : ''
        })
        resolve(res.result ? res.result : [])
    })
}

export const getCountryList = (inputs) => {
    return new Promise(async (resolve, reject) => {
        let res = await RestfulUtils.post('/allcode/getlist',
            { CDTYPE: 'CF', CDNAME: 'COUNTRY', CDVAL: 'NATIONALITY' }
        )
        let result = [];
        if (res && res.errCode === 0) {
            if (res.data && res.data.length > 0) {
                let allData = res.data;
                if (inputs.GRINVESTOR === GRINVESTOR_NN && inputs.IS_FILTER === true) {
                    //tổ chức, cá nhân nước ngoài thì remove việt nam
                    allData = _.filter(allData, item => item.CDVAL !== COUNTRY_234);
                }
                if (inputs.GRINVESTOR === GRINVESTOR_TN && inputs.IS_FILTER === true) {
                    allData = _.filter(allData, item => item.CDVAL === COUNTRY_234)
                }

                if (allData && allData.length > 0) {
                    allData.map(item => {
                        let object = {};
                        object.label = inputs.language === 'vie' ? item.CDCONTENT : item.EN_CDCONTENT;
                        object.value = item.CDVAL;
                        result.push(object)
                    })
                }
            }
        }
        resolve(result)
    })
}

export const getJobList = (inputs) => {
    return new Promise(async (resolve, reject) => {
        let res = await RestfulUtils.post("/account/getjob", {
            language: inputs.language ? inputs.language : 'vie'
        })
        resolve(res ? res : [])
    })
}

export const getCareby4Tlid = (inputs) => {
    return new Promise(async (resolve, reject) => {
        let res = await RestfulUtils.post("/account/getcareby4tlid", {
            language: inputs.language ? inputs.language : 'vie'
        })

        resolve(res ? res : [])
    })
}

// export const get = (inputs) => {
//     return new Promise(async (resolve, reject) => {

//     })
// }

export const getExperienceList = (inputs) => {
    return new Promise(async (resolve, reject) => {
        let res = RestfulUtils.post("/account/getexperience", {
            language: inputs.language ? inputs.language : 'vie'
        })

        resolve(res ? res : [])
    })
}

export const getInvestTime = (inputs) => {
    return new Promise(async (resolve, reject) => {
        let res = await RestfulUtils.post("/account/getinvesttime", {
            language: inputs.language ? inputs.language : 'vie'
        })

        resolve(res ? res : [])
    })
}

export const getRiskList = (inputs) => {
    return new Promise(async (resolve, reject) => {
        let res = await RestfulUtils.post("/account/getruiro", {
            language: inputs.language ? inputs.language : 'vie'
        })
        resolve(res ? res : [])
    })
}

export const getListSaleidByTLID = (inputs) => {
    return new Promise(async (resolve, reject) => {
        let res = await RestfulUtils.post('/user/getListSaleidByTLID',
            {
                language: inputs.language ? inputs.language : 'vie'
            }
        );
        resolve(res.result ? res.result : [])
    })
}


export const buildInputsData = (dataState, language) => {
    let object = {};
    object.action = dataState.action ? dataState.action : 'add',
        object.country = dataState.NATIONALITY ? dataState.NATIONALITY : '';
    object.custtype = dataState.CUSTTYPE ? dataState.CUSTTYPE : '';
    object.grinvestor = dataState.GRINVESTOR ? dataState.GRINVESTOR : '';
    object.language = language;
    return object;
}

export const getAllRequireData = (inputs) => {
    return new Promise(async (resolve, reject) => {
        // let idType = await getIdType(inputs);
        let jobList = await getJobList(inputs);
        let careByList = await getCareby4Tlid(inputs);
        let saleList = await getListSaleidByTLID(inputs);
        let riskList = await getRiskList(inputs);
        let investTimeList = await getInvestTime(inputs);
        let experienceList = await getExperienceList(inputs);

        resolve({ jobList, careByList, saleList, riskList, investTimeList, experienceList })
    })
}



export const getAllRequireDataEKYC = (inputs) => {
    return new Promise(async (resolve, reject) => {
        // let jobList = await getJobList(inputs);
        // let careByList = await getCareby4Tlid(inputs);
        // let saleList = await getListSaleidByTLID(inputs);
        // let riskList = await getRiskList(inputs);
        // let investTimeList = await getInvestTime(inputs);
        // let experienceList = await getExperienceList(inputs);

        // resolve({ jobList, careByList, saleList, riskList, investTimeList, experienceList })
    })
}

export const checkValidateInputMainInfor = (dataState, isLoggedOut, userType, isAuth) => {
    let idElement = '', isValid = true, arrCheckFields = [], arrNotCheck = [];
    let idCheckFormat = ''
    let isCheckEmpty = false

    //array lưu các trường không cần điền trên form
    let ARR_NOT_REQUIRED_CNTN = [
        'REGADDRESS',
        'COUNTRY_REGADDRESS',

        'PADDING',
        'PADDING1',
        'PADDING2',
        'PADDING_EKYC',
        'PADDING_EKYC2'
    ];
    let ARR_NOT_REQUIRED_CNNN = [
        'REGADDRESS',
        'COUNTRY_REGADDRESS',
        'PADDING',
        'PADDING1',
        'PADDING2',
        'PADDING_EKYC',
        'PADDING_EKYC2'
    ];
    let ARR_NOT_REQUIRED_TCTN = [
        'SECTION_DAI_DIEN_PHAP_LUAT',
        'PADDING',
        'PADDING1',
        'PADDING2',
        'PADDING_EKYC',
        'PADDING_EKYC2',
        'REGADDRESS',
    ];
    let ARR_NOT_REQUIRED_TCNN = [
        'REGADDRESS',
        'SECTION_DAI_DIEN_PHAP_LUAT',
        'PADDING',
        'PADDING1',
        'PADDING2',
        'PADDING_EKYC',
        'PADDING_EKYC2'
    ];

    let ARR_NOT_REQUIRED_CNTN_EDIT = [
        'OTHER_NATIONALITY', 'JOB',
        'BUSINESS_AREAS', 'POSITION', 'WORK_ADDRESS', 'TAX_COUNTRY', 'TAX_NUMBER', 'FAX',
        'SECTION_UY_QUYEN',
        'SECTION_IS_FATCA',
        'SECTION_BROKER',
        'SECTION_CONTRACT',
        'SECTION_INVEST',
        'REGADDRESS',

        'INVEST_TIME',
        'RISK',
        'EXPERIENCE',

        'PADDING',
        'PADDING1',
        'PADDING2',
        'PADDING_EKYC',
        'PADDING_EKYC2'
    ];
    let ARR_NOT_REQUIRED_CNNN_EDIT = [
        'TAX_NUMBER',
        'REASON_ENTRY',
        'VISA_NO',
        'FAX',
        'SECTION_UY_QUYEN',
        'SECTION_IS_FATCA',
        'SECTION_BROKER',
        'SECTION_CONTRACT',
        'SECTION_INVEST',

        'REGADDRESS',
        'COUNTRY_REGADDRESS',

        'INVEST_TIME',
        'RISK',
        'EXPERIENCE',

        'PADDING',
        'PADDING1',
        'PADDING2',
        'PADDING_EKYC',
        'PADDING_EKYC2'
    ];

    let ARR_NOT_REQUIRED_TCTN_EDIT = [
        'OTHER_NATIONALITY',
        'FAX',
        'PASSPORT',
        'VISA_NO',
        'LAW_VISA_NO',
        'LAW_VISA_DATE',
        'LAW_VISA_ADDRESS',
        'CAPITAL_NAME',
        'CAPITAL_POSITION',
        'CAPITAL_ID_NO',
        'CAPITAL_ID_DATE',
        'CAPITAL_ID_ADDRESS',
        'CAPITAL_PHONE',
        'CAPITAL_EMAIL',
        'LAW_VISA_NO',
        'LAW_VISA_DATE',
        'LAW_VISA_ADDRESS',
        'SECTION_UY_QUYEN',
        'SECTION_DAI_DIEN_PHAP_LUAT',
        'SECTION_IS_FATCA',
        'SECTION_BROKER',
        'SECTION_INVEST',
        'SECTION_CAPITAL',
        'SECTION_CONTRACT',

        'INVEST_TIME',
        'RISK',
        'EXPERIENCE',

        'PADDING',
        'PADDING1',
        'PADDING2',
        'PADDING_EKYC',
        'PADDING_EKYC2'
    ];

    let ARR_NOT_REQUIRED_TCNN_EDIT = [
        'FAX', 'LAW_VISA_NO', 'LAW_VISA_DATE', 'LAW_VISA_ADDRESS',
        'SECTION_UY_QUYEN',
        'REGADDRESS',
        'OTHER_NATIONALITY',
        'CAPITAL_NAME',
        'CAPITAL_POSITION',
        'CAPITAL_ID_NO',
        'CAPITAL_ID_DATE',
        'CAPITAL_ID_ADDRESS',
        'CAPITAL_PHONE',
        'CAPITAL_EMAIL',
        'SECTION_DAI_DIEN_PHAP_LUAT',
        'SECTION_IS_FATCA',
        'SECTION_BROKER',
        'SECTION_INVEST',
        'SECTION_CAPITAL',
        'SECTION_CONTRACT',

        'INVEST_TIME',
        'RISK',
        'EXPERIENCE',
        'TEMPORARY_ADDRESS',

        'PADDING',
        'PADDING1',
        'PADDING2',
        'PADDING_EKYC',
        'PADDING_EKYC2'
    ];

    if (userType === USER_TYPE_OBJ.CNTN) {
        arrCheckFields = isLoggedOut ? ARR_ALLOW_CNTN : ARR_ALLOW_CNTN_EDIT;
        arrNotCheck = isLoggedOut ? ARR_NOT_REQUIRED_CNTN : ARR_NOT_REQUIRED_CNTN_EDIT;
    }
    if (userType === USER_TYPE_OBJ.CNNN) {
        arrCheckFields = isLoggedOut ? ARR_ALLOW_CNNN : ARR_ALLOW_CNNN_EDIT;
        arrNotCheck = isLoggedOut ? ARR_NOT_REQUIRED_CNNN : ARR_NOT_REQUIRED_CNNN_EDIT;
    }
    if (userType === USER_TYPE_OBJ.TCTN) {
        arrCheckFields = isLoggedOut ? ARR_ALLOW_TCTN : ARR_ALLOW_TCTN_EDIT;
        arrNotCheck = isLoggedOut ? ARR_NOT_REQUIRED_TCTN : ARR_NOT_REQUIRED_TCTN_EDIT;
    }
    if (userType === USER_TYPE_OBJ.TCNN) {
        arrCheckFields = isLoggedOut ? ARR_ALLOW_TCNN : ARR_ALLOW_TCNN_EDIT;
        arrNotCheck = isLoggedOut ? ARR_NOT_REQUIRED_TCNN : ARR_NOT_REQUIRED_TCNN_EDIT;
    }
    if (isAuth) {
        arrNotCheck = [...arrNotCheck, 'IS_ONLINE']
        //console.log('arrayNotCheck', arrNotCheck)
    }

    arrCheckFields = arrCheckFields.filter((item) => !arrNotCheck.includes(item));

    //check rỗng
    if (isCheckEmpty === false) {
        for (let i = 0; i < arrCheckFields.length; i++) {
            if (!dataState[arrCheckFields[i]]) {
                isValid = false;
                idCheckFormat = ''
                idElement = arrCheckFields[i];
                break;
            }
        }
        isCheckEmpty = true
    }

    //check giá trị checkbox
    console.log('>>> inside validate dataState: ', dataState, 'arrCheckFields :', arrCheckFields)
    if (dataState['IS_ONLINE'] && dataState['IS_AGREE']) {
        if (dataState['IS_ONLINE'] === 'N' && arrCheckFields.includes('IS_ONLINE')) {
            isValid = false;
            idCheckFormat = ''
            idElement = 'IS_ONLINE';
        }
        if (dataState['IS_AGREE'] === 'N' && arrCheckFields.includes('IS_AGREE')) {
            isValid = false;
            idCheckFormat = ''
            idElement = 'IS_AGREE';
        }
    }

    //check ngày cấp idcode và ngày sinh
    if (dataState['BIRTHDATE'] && dataState['IDCODE_DATE']) {
        if (moment(dataState['IDCODE_DATE'], "DD/MM/YYYY") <= moment(dataState['BIRTHDATE'], "DD/MM/YYYY")) {
            isValid = false;
            idCheckFormat = 'F_IDCODE_DATE'
            idElement = 'IDCODE_DATE';
        }
    }

    if (dataState['BUSSINESS_DATE']) {
        if (moment(dataState['BUSSINESS_DATE'], "DD/MM/YYYY") >= moment(new Date(), "DD/MM/YYYY")) {
            isValid = false;
            idCheckFormat = 'F_BUSSINESS_DATE'
            idElement = 'BUSSINESS_DATE';
        }
    }


    let regexEmail = (/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
    let regexBankAccount = (/^[0-9]*$/gm)
    let regexMobile = (/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/)
    let regexIDCODE = (/^[0-9]*$/gm)

    let listCheckFormatEmail = ['EMAIL', 'LAW_EMAIL', 'CAPITAL_EMAIL', 'ONLINEEMAIL']
    let listCheckFormatMobile = ['PHONE', 'PHONE_CONTACT', 'CAPITAL_PHONE', 'ONLINEPHONE', 'LAW_PHONE_CONTACT']
    let listCheckFormatIDCODE = ['IDCODE_NO', 'LAW_IDCODE_NO', 'CAPITAL_ID_NO']

    let arrCheckFormat = listCheckFormatEmail.concat(listCheckFormatMobile).concat(listCheckFormatIDCODE).concat(['BANK_NO']).concat(['BUSSINESS_NO']);

    //cần check thêm định dạng của email, số điện thoại
    if (isCheckEmpty && isValid) {
        for (let i = 0; i <= arrCheckFormat.length; i++) {
            if (dataState[arrCheckFormat[i]]) {
                if (listCheckFormatEmail.includes(arrCheckFormat[i])) {
                    isValid = (/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i).test(dataState[arrCheckFormat[i]])
                    if (!isValid) {
                        idElement = arrCheckFormat[i];
                        idCheckFormat = `F_EMAIL`
                        break;
                    }
                }
                if (listCheckFormatMobile.includes(arrCheckFormat[i])) {
                    isValid = (/^[0-9]*$/gm).test(dataState[arrCheckFormat[i]])
                    if (!isValid) {
                        idElement = arrCheckFormat[i];
                        idCheckFormat = `F_MOBILE`;
                        break;
                    }
                }
                if (listCheckFormatIDCODE.includes(arrCheckFormat[i])) {
                    isValid = (/^[a-zA-Z0-9]*$/gm).test(dataState[arrCheckFormat[i]])
                    if (!isValid) {
                        idElement = arrCheckFormat[i];
                        idCheckFormat = `F_ID`;
                        break;
                    }
                }
                if (arrCheckFormat[i] === 'BANK_NO') {
                    isValid = (/^[a-zA-Z0-9]*$/gm).test(dataState[arrCheckFormat[i]])
                    if (!isValid) {
                        idElement = arrCheckFormat[i];
                        idCheckFormat = `F_BANK`;
                        break;
                    }
                }

                if (arrCheckFormat[i] === 'BUSSINESS_NO') {
                    isValid = (/^[a-zA-Z0-9]*$/gm).test(dataState[arrCheckFormat[i]])
                    if (!isValid) {
                        idElement = arrCheckFormat[i];
                        idCheckFormat = `F_BUSSINESS_ID`;
                        break;
                    }
                }
            }
        }
    }

    return {
        idElement,
        isValid,
        idCheckFormat
    };
}

export const getTypeAccount = (userType) => {
    let ACCTYPE = '', CUSTTYPE = '', GRINVESTOR = '';
    if (userType === USER_TYPE_OBJ.CNTN) {
        ACCTYPE = 'TT';
        CUSTTYPE = 'CN';
        GRINVESTOR = 'TN';
    }
    if (userType === USER_TYPE_OBJ.CNNN) {
        ACCTYPE = 'TT';
        CUSTTYPE = 'CN';
        GRINVESTOR = 'NN';
    }
    if (userType === USER_TYPE_OBJ.TCTN) {
        ACCTYPE = 'TT';
        CUSTTYPE = 'TC';
        GRINVESTOR = 'TN';
    }
    if (userType === USER_TYPE_OBJ.TCNN) {
        ACCTYPE = 'TT';
        CUSTTYPE = 'TC';
        GRINVESTOR = 'NN';
    }

    return {
        ACCTYPE,
        CUSTTYPE,
        GRINVESTOR,
    }
}

//map api và state (trường hợp sửa thông tin tài khoản)
export const arrMapApiToState = [
    { key: 'CUSTID', value: 'CUSTID' },
    { key: 'CUSTODYCD', value: 'CUSTODYCD' },
    { key: 'FULLNAME', value: 'FULLNAME' },
    { key: 'ACCTYPE', value: 'ACCTYPE' },
    { key: 'CUSTTYPE', value: 'CUSTTYPE' },
    { key: 'GRINVESTOR', value: 'GRINVESTOR' },
    { key: 'SEX', value: 'SEX' },
    { key: 'BIRTHDATE', value: 'BIRTHDATE' },
    { key: 'IDTYPE', value: 'IDTYPE' },
    { key: 'IDCODE', value: 'IDCODE_NO' },
    { key: 'IDDATE', value: 'IDCODE_DATE' },
    { key: 'IDPLACE', value: 'IDCODE_ADDRESS' },
    { key: 'TAXNO', value: 'TAX_NUMBER' },
    { key: 'COUNTRY', value: 'NATIONALITY' }, //quốc tịch
    { key: 'OTHERCOUNTRY', value: 'OTHER_NATIONALITY' }, //quốc tịch khác
    { key: 'PHONE', value: 'PHONE' },
    { key: 'MOBILE', value: 'PHONE_CONTACT' }, //điện thoại liên hệ
    { key: 'EMAIL', value: 'EMAIL' },
    { key: 'DBCODE', value: 'DBCODE' }, //999
    { key: 'BANKACC', value: 'BANK_NO' }, //số tài khoản ngân hàng
    { key: 'BANKCODE', value: 'BANK_NAME' }, //tên ngân hàng
    { key: 'CITYBANK', value: 'BANK_BRANCH' }, //chi nhánh ngân hàng
    { key: 'BANKACNAME', value: 'BANKACNAME' },
    { key: 'FAX', value: 'FAX' },
    { key: 'INCOMEYEAR', value: 'INCOMEYEAR' },
    { key: 'ISAUTH', value: 'IS_AUTHORIZED' }, //có ủy quyền hay không
    { key: 'TRADINGCODE', value: 'TRADINGCODE' },
    { key: 'PASSPORT', value: 'PASSPORT' },
    { key: 'PASSPORTDATE', value: 'PASSPORTDATE' },
    { key: 'PASSPORTPLACE', value: 'PASSPORTPLACE' },
    { key: 'TAXPLACE', value: 'TAX_COUNTRY' }, //quốc gia đóng thuế
    { key: 'CAREBY', value: 'CAREBY_GROUP' }, //nhóm chăm sóc tài khoản
    { key: 'INVESTTYPE', value: 'INVESTTYPE' }, //TT
    { key: 'IDEXPDATED', value: 'IDEXPDATED' }, //ngày hết hạn cmnd
    { key: 'ISONLINE', value: 'IS_ONLINE' },
    { key: 'ISCONTACT', value: 'ISCONTACT' },
    { key: 'SALEID', value: 'CAREBY_PERSON' }, //nhân viên chăm sóc
    { key: 'ISFATCA', value: 'IS_FATCA' },
    { key: 'ISAGREE', value: 'IS_AGREE' },
    { key: 'ISPEP', value: 'IS_PEP' },
    { key: 'FAMILYNAME1', value: 'FAMILYNAME1' },
    { key: 'FAMILYNAME2', value: 'FAMILYNAME2' },
    { key: 'NAME1', value: 'NAME1' },
    { key: 'NAME2', value: 'NAME2' },
    { key: 'ISREPRESENTATIVE', value: 'ISREPRESENTATIVE' },
    { key: 'LRNAME', value: 'LAW_FULLNAME' }, //nguời đại diện pháp luật
    { key: 'LRSEX', value: 'LRSEX' },
    { key: 'LRDOB', value: 'LAW_BIRTHDAY' },
    { key: 'LRCOUNTRY', value: 'LAW_NATIONALITY' }, //quốc tịch
    { key: 'LRPOSITION', value: 'LAW_POSITION' },
    { key: 'LRDECISIONNO', value: 'LRDECISIONNO' },
    { key: 'LRID', value: 'LAW_IDCODE_NO' },
    { key: 'LRIDDATE', value: 'LAW_IDCODE_DATE' },
    { key: 'LRIDPLACE', value: 'LAW_IDCODE_ADDRESS' },
    { key: 'LRADDRESS', value: 'LRADDRESS' },
    { key: 'LRCONTACT', value: 'LRCONTACT' },
    { key: 'LRPRIPHONE', value: 'LAW_PHONE_CONTACT' },
    { key: 'LRALTPHONE', value: 'LRALTPHONE' },
    { key: 'LRFAX', value: 'LRFAX' },
    { key: 'LREMAIL', value: 'LAW_EMAIL' },
    { key: 'SONHA', value: 'SONHA' },
    { key: 'PHOTHONXOM', value: 'PHOTHONXOM' },
    { key: 'PHUONGXA', value: 'PHUONGXA' },
    { key: 'THANHPHO', value: 'THANHPHO' },
    { key: 'INVESTTIME', value: 'INVEST_TIME' }, //thời gian đầu tư
    { key: 'RUIRO', value: 'RISK' },//mức độ chấp nhận rủi ro
    { key: 'EXPERIENCE', value: 'EXPERIENCE' }, //kinh nghiệm đầu tư
    { key: 'ISAGREESHARE', value: 'ISAGREESHARE' },
    { key: 'TAXNUMBER', value: 'TAX_NUMBER' }, //mã số thuế
    { key: 'SONHAREG', value: 'SONHAREG' },
    { key: 'PHOTHONXOMREG', value: 'PHOTHONXOMREG' },
    { key: 'PHUONGXAREG', value: 'PHUONGXAREG' },
    { key: 'THANHPHOREG', value: 'THANHPHOREG' },
    { key: 'JOB', value: 'JOB' }, //nghề nghiệp
    { key: 'POSITIONCN', value: 'POSITION' }, //chức vụ
    { key: 'WORKADDRESS', value: 'WORK_ADDRESS' }, //nơi công tác
    { key: 'VISANO', value: 'VISA_NO' }, //số thị thực
    { key: 'LIDONHAPCANH', value: 'REASON_ENTRY' },
    { key: 'CAPITALNAME', value: 'CAPITAL_NAME' }, //thông tin người đại diện vốn
    { key: 'CAPITALPOSITION', value: 'CAPITAL_POSITION' },
    { key: 'CAPITALIDCODE', value: 'CAPITAL_ID_NO' },
    { key: 'CAPITALIDDATE', value: 'CAPITAL_ID_DATE' },
    { key: 'CAPITALIDPLACE', value: 'CAPITAL_ID_ADDRESS' },
    { key: 'CAPITALTEL', value: 'CAPITAL_PHONE' },
    { key: 'CAPITALEMAIL', value: 'CAPITAL_EMAIL' },
    { key: 'ONLINENAME', value: 'ONLINENAME' },
    { key: 'ONLINEPHONE', value: 'ONLINEPHONE' },
    { key: 'ONLINEEMAIL', value: 'ONLINEEMAIL' },
    { key: 'REGADDRESS', value: 'REGADDRESS' }, //địa chỉ phụ
    { key: 'ADDRESS', value: 'ADDRESS' }, //địa chỉ chính
    // language: 'vie',
    // access: 'add',
]


//KEY LÀ FIELD API, VALUE LÀ BIẾN STATE, dùng trong trường hợp edit tài khoản
const INPUT_EDIT_API = [
    { key: 'CUSTID', value: 'CUSTID' },
    { key: 'CUSTODYCD', value: 'CUSTODYCD' },
    { key: 'FULLNAME', value: 'FULLNAME' },
    { key: 'ACCTYPE', value: 'ACCTYPE' },
    { key: 'CUSTTYPE', value: 'CUSTTYPE' },
    { key: 'GRINVESTOR', value: 'GRINVESTOR' },
    { key: 'SEX', value: 'SEX' },
    { key: 'BIRTHDATE', value: 'BIRTHDATE' },
    { key: 'IDTYPE', value: 'IDTYPE' },
    { key: 'IDCODE', value: 'IDCODE_NO' },
    { key: 'IDDATE', value: 'IDCODE_DATE' },
    { key: 'IDPLACE', value: 'IDCODE_ADDRESS' },
    { key: 'TAXNO', value: 'TAX_NUMBER' },
    { key: 'ADDRESS', value: 'ADDRESS' }, //địa chỉ chính
    { key: 'REGADDRESS', value: 'REGADDRESS' }, //địa chỉ phụ
    { key: 'SONHA', value: 'SONHA' },
    { key: 'PHOTHONXOM', value: 'PHOTHONXOM' },
    { key: 'PHUONGXA', value: 'PHUONGXA' },
    { key: 'THANHPHO', value: 'THANHPHO' },
    { key: 'INVESTTIME', value: 'INVEST_TIME' }, //thời gian đầu tư
    { key: 'RUIRO', value: 'RISK' },//mức độ chấp nhận rủi ro
    { key: 'EXPERIENCE', value: 'EXPERIENCE' }, //kinh nghiệm đầu tư
    { key: 'ISAGREESHARE', value: 'ISAGREESHARE' },
    { key: 'COUNTRY', value: 'NATIONALITY' }, //quốc tịch
    { key: 'OTHERCOUNTRY', value: 'OTHER_NATIONALITY' }, //quốc tịch khác
    { key: 'PHONE', value: 'PHONE' },
    { key: 'MOBILE', value: 'PHONE_CONTACT' }, //điện thoại liên hệ
    { key: 'EMAIL', value: 'EMAIL' },
    { key: 'BANKACC', value: 'BANK_NO' }, //số tài khoản ngân hàng
    { key: 'BANKCODE', value: 'BANK_NAME' }, //tên ngân hàng
    { key: 'CITYBANK', value: 'BANK_BRANCH' }, //chi nhánh ngân hàng
    { key: 'BANKACNAME', value: 'BANKACNAME' },
    { key: 'FAX', value: 'FAX' },
    { key: 'INCOMEYEAR', value: 'INCOMEYEAR' },
    { key: 'ISAUTH', value: 'IS_AUTHORIZED' },


    //khác add
    { key: 'RCV_EMAIL', value: 'RCV_EMAIL' },
    { key: 'RCV_SMS', value: 'RCV_SMS' },
    { key: 'RCV_MAIL', value: 'RCV_MAIL' },
    //////////

    { key: 'TRADINGCODE', value: 'TRADINGCODE' },
    { key: 'PASSPORT', value: 'PASSPORT' },
    { key: 'PASSPORTDATE', value: 'PASSPORTDATE' },
    { key: 'PASSPORTPLACE', value: 'PASSPORTPLACE' },
    { key: 'TAXPLACE', value: 'TAX_COUNTRY' }, //quốc gia đóng thuế
    { key: 'CAREBY', value: 'CAREBY_GROUP' }, //nhóm chăm sóc tài khoản
    { key: 'INVESTTYPE', value: 'INVESTTYPE' }, //TT
    { key: 'IDEXPDATED', value: 'IDEXPDATED' }, //ngày hết hạn cmnd
    { key: 'ISONLINE', value: 'IS_ONLINE' },
    { key: 'ISCONTACT', value: 'ISCONTACT' },
    { key: 'SALEID', value: 'CAREBY_PERSON' }, //nhân viên chăm sóc
    { key: 'ISFATCA', value: 'IS_FATCA' },

    //khác add
    { key: 'SIGN_IMG', value: 'SIGNATURE' },
    { key: 'OWNLICENSE_IMG', value: 'OWNLICENSE_IMG' },
    { key: 'OWNLICENSE2_IMG', value: 'OWNLICENSE2_IMG' },
    { key: 'OWNLICENSE3_IMG', value: 'OWNLICENSE3_IMG' },
    { key: 'OWNLICENSE4_IMG', value: 'OWNLICENSE4_IMG' },
    //////


    { key: 'ISAGREE', value: 'IS_AGREE' },
    { key: 'ISPEP', value: 'IS_PEP' },
    { key: 'FAMILYNAME1', value: 'FAMILYNAME1' },
    { key: 'FAMILYNAME2', value: 'FAMILYNAME2' },
    { key: 'NAME1', value: 'NAME1' },
    { key: 'NAME2', value: 'NAME2' },
    { key: 'LRCOUNTRY', value: 'LAW_NATIONALITY' }, //quốc tịch
    { key: 'LRPOSITION', value: 'LAW_POSITION' },
    { key: 'LRDECISIONNO', value: 'LRDECISIONNO' },
    { key: 'LRID', value: 'LAW_IDCODE_NO' },
    { key: 'LRIDDATE', value: 'LAW_IDCODE_DATE' },
    { key: 'LRIDPLACE', value: 'LAW_IDCODE_ADDRESS' },
    { key: 'LRADDRESS', value: 'LRADDRESS' },
    { key: 'LRCONTACT', value: 'LRCONTACT' },
    { key: 'LRPRIPHONE', value: 'LAW_PHONE_CONTACT' },
    { key: 'LRALTPHONE', value: 'LRALTPHONE' },
    { key: 'LRFAX', value: 'LRFAX' },
    { key: 'LREMAIL', value: 'LAW_EMAIL' },
    { key: 'ISREPRESENTATIVE', value: 'ISREPRESENTATIVE' },
    { key: 'LRNAME', value: 'LAW_FULLNAME' }, //nguời đại diện pháp luật
    { key: 'LRSEX', value: 'LRSEX' },
    { key: 'LRDOB', value: 'LAW_BIRTHDAY' },
    { key: 'TAXNUMBER', value: 'TAX_NUMBER' }, //mã số thuế
    { key: 'SONHAREG', value: 'SONHAREG' },
    { key: 'PHOTHONXOMREG', value: 'PHOTHONXOMREG' },
    { key: 'PHUONGXAREG', value: 'PHUONGXAREG' },
    { key: 'THANHPHOREG', value: 'THANHPHOREG' },
    { key: 'JOB', value: 'JOB' }, //nghề nghiệp
    { key: 'POSITIONCN', value: 'POSITION' }, //chức vụ
    { key: 'WORKADDRESS', value: 'WORK_ADDRESS' }, //nơi công tác
    { key: 'VISANO', value: 'VISA_NO' }, //số thị thực
    { key: 'LIDONHAPCANH', value: 'REASON_ENTRY' },
    { key: 'CAPITALNAME', value: 'CAPITAL_NAME' }, //thông tin người đại diện vốn
    { key: 'CAPITALPOSITION', value: 'CAPITAL_POSITION' },
    { key: 'CAPITALIDCODE', value: 'CAPITAL_ID_NO' },
    { key: 'CAPITALIDDATE', value: 'CAPITAL_ID_DATE' },
    { key: 'CAPITALIDPLACE', value: 'CAPITAL_ID_ADDRESS' },
    { key: 'CAPITALTEL', value: 'CAPITAL_PHONE' },
    { key: 'CAPITALEMAIL', value: 'CAPITAL_EMAIL' },
    { key: 'ONLINENAME', value: 'ONLINENAME' },
    { key: 'ONLINEPHONE', value: 'ONLINEPHONE' },
    { key: 'ONLINEEMAIL', value: 'ONLINEEMAIL' },
    { key: 'DBCODE', value: 'DBCODE' }, //999
]

//convert data state để map vào api thêm mới user
export const mapStateToEditApi = (state, userType) => {
    let result = {};
    INPUT_EDIT_API.map(item => {
        result[item.key] = state[item.value] ? state[item.value] : null
    })

    //tính ngày hết hạn 
    if (result['IDDATE']) {
        let arrResultDate = result['IDDATE'].split("/"); //DD/MM/YYYY
        let newyear = parseInt(arrResultDate[2]) + EXPIRED_DATE_ID;
        let expiredData = arrResultDate[0] + "/" + arrResultDate[1] + "/" + newyear;
        result['IDEXPDATED'] = expiredData;
    }

    if (!result['ACCTYPE']) {
        result['ACCTYPE'] = getTypeAccount(userType).ACCTYPE;
    }
    if (!result['CUSTTYPE']) {
        result['CUSTTYPE'] = getTypeAccount(userType).CUSTTYPE;
    }
    if (!result['GRINVESTOR']) {
        result['GRINVESTOR'] = getTypeAccount(userType).GRINVESTOR;
    }

    return result;
}


//KEY LÀ FIELD API, VALUE LÀ BIẾN STATE, dùng trong trường hợp tạo tài khoản
const INPUT_ADD_API = [
    { key: 'CUSTID', value: 'CUSTID' },
    { key: 'CUSTODYCD', value: 'CUSTODYCD' },
    { key: 'FULLNAME', value: 'FULLNAME' },
    { key: 'ACCTYPE', value: 'ACCTYPE' },
    { key: 'CUSTTYPE', value: 'CUSTTYPE' },
    { key: 'GRINVESTOR', value: 'GRINVESTOR' },
    { key: 'SEX', value: 'SEX' },
    { key: 'BIRTHDATE', value: 'BIRTHDATE' },
    { key: 'IDTYPE', value: 'IDTYPE' },
    { key: 'IDCODE', value: 'IDCODE_NO' }, //số cmnd
    { key: 'IDDATE', value: 'IDCODE_DATE' },
    { key: 'IDPLACE', value: 'IDCODE_ADDRESS' }, //nơi cấp cmnd
    { key: 'TAXNO', value: 'TAX_NUMBER' },
    { key: 'COUNTRY', value: 'NATIONALITY' }, //quốc tịch
    { key: 'OTHERCOUNTRY', value: 'OTHER_NATIONALITY' }, //quốc tịch khác
    { key: 'PHONE', value: 'PHONE' },
    { key: 'MOBILE', value: 'PHONE_CONTACT' }, //điện thoại liên hệ
    { key: 'EMAIL', value: 'EMAIL' },
    { key: 'DBCODE', value: 'DBCODE' },
    { key: 'BANKACC', value: 'BANK_NO' }, //số tài khoản ngân hàng
    { key: 'BANKCODE', value: 'BANK_NAME' }, //tên ngân hàng
    { key: 'CITYBANK', value: 'BANK_BRANCH' }, //chi nhánh ngân hàng
    { key: 'BANKACNAME', value: 'BANKACNAME' },
    { key: 'FAX', value: 'FAX' },
    { key: 'INCOMEYEAR', value: 'INCOMEYEAR' },
    { key: 'ISAUTH', value: 'IS_AUTHORIZED' },
    { key: 'TRADINGCODE', value: 'TRADINGCODE' },
    { key: 'PASSPORT', value: 'PASSPORT' },
    { key: 'PASSPORTDATE', value: 'PASSPORTDATE' },
    { key: 'PASSPORTPLACE', value: 'PASSPORTPLACE' },
    { key: 'TAXPLACE', value: 'TAX_COUNTRY' }, //quốc gia đóng thuế
    { key: 'CAREBY', value: 'CAREBY_GROUP' }, //nhóm chăm sóc tài khoản
    { key: 'INVESTTYPE', value: 'INVESTTYPE' },
    { key: 'IDEXPDATED', value: 'IDEXPDATED' },
    { key: 'ISONLINE', value: 'IS_ONLINE' },
    { key: 'ISCONTACT', value: 'ISCONTACT' },
    { key: 'SALEID', value: 'CAREBY_PERSON' }, //nhân viên chăm sóc
    { key: 'ISFATCA', value: 'IS_FATCA' },
    { key: 'ISAGREE', value: 'IS_AGREE' },
    { key: 'ISPEP', value: 'ISPEP' },
    { key: 'FAMILYNAME1', value: 'FAMILYNAME1' },
    { key: 'FAMILYNAME2', value: 'FAMILYNAME2' },
    { key: 'NAME1', value: 'NAME1' },
    { key: 'NAME2', value: 'NAME2' },
    { key: 'ISREPRESENTATIVE', value: 'ISREPRESENTATIVE' },
    { key: 'LRNAME', value: 'LAW_FULLNAME' }, //nguời đại diện pháp luật
    { key: 'LRSEX', value: 'LRSEX' },
    { key: 'LRDOB', value: 'LAW_BIRTHDAY' },
    { key: 'LRCOUNTRY', value: 'LAW_NATIONALITY' }, //quốc tịch
    { key: 'LRPOSITION', value: 'LAW_POSITION' },
    { key: 'LRDECISIONNO', value: 'LRDECISIONNO' },
    { key: 'LRID', value: 'LAW_IDCODE_NO' },
    { key: 'LRIDDATE', value: 'LAW_IDCODE_DATE' },
    { key: 'LRIDPLACE', value: 'LAW_IDCODE_ADDRESS' },
    { key: 'LRADDRESS', value: 'LRADDRESS' },
    { key: 'LRCONTACT', value: 'LRCONTACT' },
    { key: 'LRPRIPHONE', value: 'LAW_PHONE_CONTACT' },
    { key: 'LRALTPHONE', value: 'LRALTPHONE' },
    { key: 'LRFAX', value: 'LRFAX' },
    { key: 'LREMAIL', value: 'LAW_EMAIL' },
    { key: 'SONHA', value: 'SONHA' },
    { key: 'PHOTHONXOM', value: 'PHOTHONXOM' },
    { key: 'PHUONGXA', value: 'PHUONGXA' },
    { key: 'THANHPHO', value: 'THANHPHO' },
    { key: 'INVESTTIME', value: 'INVEST_TIME' }, //thời gian đầu tư
    { key: 'RUIRO', value: 'RISK' },//mức độ chấp nhận rủi ro
    { key: 'EXPERIENCE', value: 'EXPERIENCE' }, //kinh nghiệm đầu tư
    { key: 'ISAGREESHARE', value: 'ISAGREESHARE' },
    { key: 'TAXNUMBER', value: 'TAX_NUMBER' }, //mã số thuế
    { key: 'SONHAREG', value: 'SONHAREG' },
    { key: 'PHOTHONXOMREG', value: 'PHOTHONXOMREG' },
    { key: 'PHUONGXAREG', value: 'PHUONGXAREG' },
    { key: 'THANHPHOREG', value: 'THANHPHOREG' },
    { key: 'JOB', value: 'JOB' }, //nghề nghiệp
    { key: 'POSITIONCN', value: 'POSITION' }, //chức vụ
    { key: 'WORKADDRESS', value: 'WORK_ADDRESS' }, //nơi công tác
    { key: 'VISANO', value: 'VISA_NO' }, //số thị thực
    { key: 'LIDONHAPCANH', value: 'REASON_ENTRY' },
    { key: 'CAPITALNAME', value: 'CAPITAL_NAME' }, //thông tin người đại diện vốn
    { key: 'CAPITALPOSITION', value: 'CAPITAL_POSITION' },
    { key: 'CAPITALIDCODE', value: 'CAPITAL_ID_NO' },
    { key: 'CAPITALIDDATE', value: 'CAPITAL_ID_DATE' },
    { key: 'CAPITALIDPLACE', value: 'CAPITAL_ID_ADDRESS' },
    { key: 'CAPITALTEL', value: 'CAPITAL_PHONE' },
    { key: 'CAPITALEMAIL', value: 'CAPITAL_EMAIL' },
    { key: 'ONLINENAME', value: 'ONLINENAME' },
    { key: 'ONLINEPHONE', value: 'ONLINEPHONE' },
    { key: 'ONLINEEMAIL', value: 'ONLINEEMAIL' },
    { key: 'REGADDRESS', value: 'REGADDRESS' },
    { key: 'ADDRESS', value: 'ADDRESS' },
]

//convert data state để map vào api thêm mới user
export const mapStateToAddApi = (state, userType) => {
    let result = {};
    INPUT_ADD_API.map(item => {
        result[item.key] = state[item.value] ? state[item.value] : '';
    });

    //tính ngày hết hạn 
    if (result['IDDATE']) {
        let arrResultDate = result['IDDATE'].split("/"); //DD/MM/YYYY
        let newyear = parseInt(arrResultDate[2]) + EXPIRED_DATE_ID;
        let expiredData = arrResultDate[0] + "/" + arrResultDate[1] + "/" + newyear;
        result['IDEXPDATED'] = expiredData;
    }


    if (!result['ACCTYPE']) {
        result['ACCTYPE'] = getTypeAccount(userType).ACCTYPE;
    }
    if (!result['CUSTTYPE']) {
        result['CUSTTYPE'] = getTypeAccount(userType).CUSTTYPE;
    }
    if (!result['GRINVESTOR']) {
        result['GRINVESTOR'] = getTypeAccount(userType).GRINVESTOR;
    }

    return result;
}
