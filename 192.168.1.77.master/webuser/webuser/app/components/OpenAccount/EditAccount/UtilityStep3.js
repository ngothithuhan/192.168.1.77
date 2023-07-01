import RestfulUtils from 'app/utils/RestfulUtils';

export const mapDataFatca = [
    { name: "CUSTID", key: "CUSTID" },
    { name: "ISAUTHRIGH", key: "ISAUTHRIGH" },
    { name: "ISDISAGREE", key: "ISDISAGREE" },
    { name: "ISIRS", key: "ISIRS" },
    { name: "ISSOLEADDRESS", key: "ISSOLEADDRESS" },
    { name: "ISSSN", key: "ISSSN" },
    { name: "ISUS", key: "ISUS" },
    { name: "ISUSCITIZEN", key: "ISUSCITIZEN" },
    { name: "ISUSMAIL", key: "ISUSMAIL" },
    { name: "ISUSPHONE", key: "ISUSPHONE" },
    { name: "ISUSPLACEOFBIRTH", key: "ISUSPLACEOFBIRTH" },
    { name: "ISUSTRANFER", key: "ISUSTRANFER" },
    { name: "OPNDATE", key: "OPNDATE" },
    { name: "OTHER", key: "OTHER" },
    { name: "REOPNDATE", key: "REOPNDATE" },
    { name: "SIGNDATE", key: "SIGNDATE" },
    { name: "W9ORW8BEN", key: "W9ORW8BEN" },
]

export const FieldApiFatca = {
    CUSTID: '',
    ISUSCITIZEN: 'N',
    ISUSPLACEOFBIRTH: 'N',
    ISUSMAIL: 'N',
    ISUSPHONE: 'N',
    ISUSTRANFER: 'N',
    ISAUTHRIGH: 'N',
    ISSOLEADDRESS: 'N',
    OPNDATE: '',
    ISDISAGREE: '',
    ISOPPOSITION: '',
    ISUSSIGN: '',
    REOPNDATE: '',
    W9ORW8BEN: 'W9',
    FULLNAME: '',
    ROOMNUMBER: '',
    CITY: '',
    STATE: '',
    NATIONAL: '',
    ZIPCODE: '',
    ISSSN: '',
    ISIRS: '',
    OTHER: '',
    W8MAILROOMNUMBER: '',
    W8MAILCITY: '',
    W8MAILSTATE: '',
    W8MAILNATIONAL: '',
    W8MAILZIPCODE: '',
    IDENUMTAX: '',
    FOREIGNTAX: '',
    REF: '',
    FIRSTCALL: '',
    FIRSTNOTE: '',
    SECONDCALL: '',
    SECONDNOTE: '',
    THIRTHCALL: '',
    THIRTHNOTE: '',
    ISUS: 'N',
    SIGNDATE: '',
    NOTE: '',
    language: 'vie',
    access: 'update',//hard code sửa
}


export const dataBundleStep3 = async (data) => {
    console.log('ha_bundle', data)
    let result = { status: "false", error: 'Có lỗi, xin thử lại!' }
    if (data) {
        for (let i = 0; i < mapDataFatca.length; i++) {
            if (data[mapDataFatca[i].name]) {
                FieldApiFatca[mapDataFatca[i].key] = data[mapDataFatca[i].name]
            }
        }
        console.log('ha_api', FieldApiFatca, 'check')
        await RestfulUtils.posttrans('/account/checkgeneralinfofatca', FieldApiFatca)
            .then((res) => {
                if (res.EC == 0) {
                    result = { status: "pass" }
                } else {
                    result = { status: "false", error: res.EM }
                }
            })
    }
    return result
}

export const convertDataStep3 = (data) => {
    if (data) {
        for (let i = 0; i < mapDataFatca.length; i++) {
            if (data[mapDataFatca[i].name]) {
                FieldApiFatca[mapDataFatca[i].key] = data[mapDataFatca[i].name]
            }
        }
    }
    return FieldApiFatca
}
   //data sample
        // let FieldApiFatcaSample = {
        //     CUSTID: '000001002640',
        //     ISUSCITIZEN: 'N',
        //     ISUSPLACEOFBIRTH: 'Y',
        //     ISUSMAIL: 'N',
        //     ISUSPHONE: 'N',
        //     ISUSTRANFER: 'N',
        //     ISAUTHRIGH: 'N',
        //     ISSOLEADDRESS: 'Y',
        //     OPNDATE: '',
        //     ISDISAGREE: '',
        //     ISOPPOSITION: '',
        //     ISUSSIGN: '',
        //     REOPNDATE: '01/01/2016',
        //     W9ORW8BEN: 'W9',
        //     FULLNAME: '',
        //     ROOMNUMBER: '',
        //     CITY: '',
        //     STATE: '',
        //     NATIONAL: '',
        //     ZIPCODE: '',
        //     ISSSN: '',
        //     ISIRS: '',
        //     OTHER: '',
        //     W8MAILROOMNUMBER: '',
        //     W8MAILCITY: '',
        //     W8MAILSTATE: '',
        //     W8MAILNATIONAL: '',
        //     W8MAILZIPCODE: '',
        //     IDENUMTAX: '',
        //     FOREIGNTAX: '',
        //     REF: '',
        //     FIRSTCALL: '',
        //     FIRSTNOTE: '',
        //     SECONDCALL: '',
        //     SECONDNOTE: '',
        //     THIRTHCALL: '',
        //     THIRTHNOTE: '',
        //     ISUS: 'Y',
        //     SIGNDATE: '01/01/2016',
        //     NOTE: '',
        //     language: 'vie',
        //     access: 'update',
        // }


