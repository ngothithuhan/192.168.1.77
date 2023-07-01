import RestfulUtils from 'app/utils/RestfulUtils';

export const listCommonField = [
    { name: "AUTOID", key: "AUTOID" },//openaccount 
    { name: "CUSTID", key: "CUSTID" },//openaccount
    { name: "FULLNAME", key: "CUSTNAME", id: "txtAuthFullname" },
    { name: "SEX", key: "SEX", id: "drdAuthSex" },
    { name: "BIRTHDATE", key: "BIRTHDATE", id: "BIRTHDATE" },
    { name: "IDCODE_NO", key: "IDCODE", id: "txtAuthIDCode" },
    { name: "IDCODE_DATE", key: "IDDATE", id: "IDDATE" },
    { name: "IDCODE_ADDRESS", key: "IDPLACE", id: "txtAuthIDPlace" },
    { name: "POSITION", key: "POSITION", id: "txtAuthPosition" },
    { name: "ADDRESS", key: "ADDRESS", id: "txtAddress" },
    { name: "COUNTRY_NOW", key: "COUNTRY", id: "drdAuthCountryNow" },
    { name: "PERMANENT_ADDRESS", key: "REGADDRESS", id: "txtAuthRegaddress" },
    { name: "PERMANENT_COUNTRY", key: "OTHERCOUNTRY", id: "drdAuthCountry" },
    { name: "MOBILE", key: "MOBILE", id: "txtAuthMobile" },
    { name: "EMAIL", key: "EMAIL", id: "txtAuthEmail" },
    { name: "AUTH_ORDER", key: "AUTH_ORDER", id: "txtAUTH_ORDER" },
    { name: "NATIONALITY", key: "", id: "drdNationality" },
]

export const listExtraFieldOtherNational = [
    { name: "TEMPORARY_ADDRESS", key: "", id: "txtTemporaryAddress" },
    { name: "VISA_ID", key: "", id: "txtVisaCode" },
    { name: "VISA_DATE", key: "", id: "txtVisaDate" },
    { name: "VISA_ADDRESS", key: "", id: "txtVisaAddress" },]

export const allField = [...listCommonField, ...listExtraFieldOtherNational]

export const FieldCreateAccount = {
    AUTOID: '',
    CUSTID: '',
    CUSTNAME: '',
    IDCODE: '',
    IDDATE: '',
    IDPLACE: '',
    EFDATE: '',
    EXDATE: '',
    ADDRESS: '',
    POSITION: '',
    SEX: '',
    BIRTHDATE: '',
    RELATIONSHIP: '',
    REGADDRESS: '',
    COUNTRY: '',
    EMAIL: '',
    MOBILE: '',
    AUTH_ALL: false,
    AUTH_ORDER: false,
    AUTH_CASH: false,
    AUTH_INFOR: false,
    AUTH_SEND: true,
    IDSCAN: '',
    IDSCAN2: '',
    AUTHSCAN: '',
    FAX: '',
    OTHERCOUNTRY: '',
    AUTHCERT: '',
    ALTPHONE: '',
    BANKACC: '',
    BANKNAME: '',
    BANKBRANCH: '',
    language: 'vie',
    access: 'add',//hard code sửa
}

export const FieldEditAccount = {
    AUTOID: '',
    CUSTID: '',
    CUSTNAME: '',
    IDCODE: '',
    IDDATE: '',
    IDPLACE: '',
    EFDATE: '',
    EXDATE: '',
    ADDRESS: '',
    POSITION: '',
    SEX: '',
    BIRTHDATE: '',
    RELATIONSHIP: '',
    REGADDRESS: '',
    COUNTRY: '',
    EMAIL: '',
    MOBILE: '',
    AUTH_ALL: false,
    AUTH_CASH: false,
    AUTH_INFOR: false,
    AUTH_ORDER: false,
    AUTH_SEND: true,
    IDSCAN: '',
    IDSCAN2: '',
    AUTHSCAN: '',
    FAX: '',
    OTHERCOUNTRY: '',
    AUTHCERT: '',
    ALTPHONE: '',
    BANKACC: '',
    BANKNAME: '',
    BANKBRANCH: '',
    language: 'vie',
    access: 'update',//hard code sửa
}

export const dataBundleCreateStep2 = async (data) => {
    let result = { status: "false", error: 'Có lỗi, xin thử lại!' }
    //console.log('ha_bundle', data)
    if (data) {
        for (let i = 0; i < allField.length; i++) {
            if (allField[i].key && allField[i].name) {
                FieldCreateAccount[allField[i].key] = data[allField[i].name]
            }
        }
        //console.log('ha_api', FieldCreateAccount, 'check')
        await RestfulUtils.posttrans('/account/checkgeneralinfoauth', FieldCreateAccount)
            .then((res) => {
                if (res.EC == 0) {
                    result = { status: "pass" }
                } else {
                    result = { status: "false", error: res.EM, errorField: errorField }
                }
            })
    }
    return result
}

export const convertDataCreatStep2 = (data) => {
    if (data) {
        for (let i = 0; i < allField.length; i++) {
            if (allField[i].key && allField[i].name) {
                FieldCreateAccount[allField[i].key] = data[allField[i].name]
            }
        }
    }
    return FieldCreateAccount;
}

//Edit Account
export const dataBundleEditStep2 = async (data) => {
    let result = { status: "false", error: 'Có lỗi, xin thử lại!' }
    //console.log('ha_bundle', data)
    if (data) {
        for (let i = 0; i < allField.length; i++) {
            if (allField[i].key && allField[i].name) {
                //console.log('ha_field', allField[i].key)
                FieldEditAccount[allField[i].key] = data[allField[i].name]
            }
        }
        //console.log('ha_api', FieldEditAccount, 'check')
        await RestfulUtils.posttrans('/account/checkgeneralinfoauth', FieldEditAccount)
            .then((res) => {
                if (res.EC == 0) {
                    result = { status: "pass" }
                } else {
                    let errorField = res.DT.p_err_field ? res.DT.p_err_field : null
                    //console.log('errorField', errorField)
                    result = { status: "false", error: res.EM, errorField: errorField }
                }
            })
    }
    return result
}

export const convertDataEditStep2 = (data) => {
    if (data) {
        for (let i = 0; i < allField.length; i++) {
            if (allField[i].key && allField[i].name) {
                FieldEditAccount[allField[i].key] = data[allField[i].name]
            }
        }
    }
    return FieldEditAccount;
}
    //data sample
        // let dataSample = {
        //     AUTOID: '',
        //     CUSTID: '',
        //     CUSTNAME: 'họ tên ủy quyền',
        //     IDCODE: 'CMND123456',
        //     IDDATE: '03/06/2015',
        //     IDPLACE: 'nơi cấp hà nội',
        //     EFDATE: '',
        //     EXDATE: '',
        //     ADDRESS: '',
        //     POSITION: '',
        //     SEX: 'M',
        //     BIRTHDATE: '02/06/1997',
        //     RELATIONSHIP: '',
        //     REGADDRESS: 'địa chỉ thường trú',
        //     COUNTRY: '234',
        //     EMAIL: 'myeamil@gmail.com',
        //     MOBILE: '0368435252',
        //     AUTH_ALL: false,
        //     AUTH_ORDER: false,
        //     AUTH_CASH: false,
        //     AUTH_INFOR: false,
        //     AUTH_SEND: true,
        //     IDSCAN: '',
        //     IDSCAN2: '',
        //     AUTHSCAN: '',
        //     FAX: '',
        //     OTHERCOUNTRY: 'quốc tịch khác',
        //     AUTHCERT: '',
        //     ALTPHONE: '0368435253',
        //     BANKACC: 'bankNo123',
        //     BANKNAME: '000004',
        //     BANKBRANCH: 'chi nhánh hà nội',
        //     language: 'vie',
        //     access: 'add',
        // }

