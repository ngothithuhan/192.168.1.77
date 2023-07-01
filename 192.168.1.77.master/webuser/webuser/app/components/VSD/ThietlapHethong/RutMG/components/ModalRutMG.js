import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import Select from 'react-select';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { toast } from 'react-toastify';
import { showNotifi } from 'app/action/actionNotification.js';

class ModalRutMG extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ISEDIT: false,
            access: 'add',
            DATA: '',
            data: [

            ],
            AccountInfo: {},
            optionsDataMG: [],
            optionMaLoaiHinh: [],
            dataMGrow: {}, //obj kq loc dc
            dataLHrow: {},
            dataMG: [],
            dataLH: [],
            //du lieu can truyen
            p_refacctno: '', //so hieu tk giao dich
            CUSTODYCD:{value: '',label:''},
            p_retype: '',
            p_saleid: '',
            p_saleid_old: '',
            p_saleacctno: '',
            p_rerole: '',
            p_reproduct: '',
            pv_objname: this.props.OBJNAME,
            pv_language: this.props.language,
            //du lieu tra ve
            p_fullname: '',
            p_tlname: '',
            p_brname: '',
            p_mbname: '',
            p_active: '',
            nextProps: '',
            GRPID: '',
            FULLNAME: '',
            RETYPE: '',
            MANAGERNAME: '',
            MANAGERFULLNAME: '',
            GROUP: { value: '', label: '' },
            checkFields: [
                { name: "p_refacctno", id: "drdrefacctno" },
                { name: "p_saleid", id: "drdsaleid" },
                { name: "p_retype", id: "drdretype" },
            ],
        };
    }
    close() {
        this.props.closeModalDetail();
    }
    /**
     * Trường hợp update thì hiển thị tất cả thông tin lên cho sửa
     * Trường hơp view thì ẩn các nút sửa không cho duyệt
     * Trường hợp add thì ẩn thông tin chỉ hiện thông tin chung cho người dùng -> Thực hiện -> Mở các thông tin tiếp theo cho người dùng khai
     * @param {*access} nextProps
     */
    async componentWillReceiveProps(nextProps) {
        console.log('nextProp:=======', nextProps)
        //let self = this;
        //let { SALEID } = nextProps.DATA;
        if (nextProps.access == "update" || nextProps.access == "view") {
                // this.props.change()
                this.setState({
                    ...this.state, 
                    p_tlname: nextProps.DATA.TLNAME,
                    p_fullname: nextProps.DATA.TLFULLNAME,
                    GRPID: nextProps.DATA.GRPID,
                    FULLNAME: nextProps.DATA.FULLNAME,
                    RETYPE: nextProps.DATA.RETYPE,
                    MANAGERNAME: nextProps.DATA.MANAGERNAME,
                    MANAGERFULLNAME: nextProps.DATA.MANAGERFULLNAME,
                })
                let result = {};
                let { dataLH } = this.state;
                console.log('dataLH: ',dataLH);
                if (dataLH)
                    if (dataLH.length > 0) {
                        result = await dataLH.filter(item => item.AUTOID == nextProps.DATA.RETYPE)
                        if (result)
                            if (result.length > 0) {
                                //console.log('result dataLH', result[0])
                                this.setState({
                                    dataLHrow: result[0],
                                    p_reproduct: result[0]["REPRODUCT"],
                                    p_rerole: result[0]["REROLE"],
                                    label_reproduct: result[0]["REPRODUCTDESC"],
                                    label_rerole: result[0]["REROLEDESC"],
                                });
                                console.log('state:=======', this.state);
                            }
                    }
                
                // this.setState({
                //     CUSTODYCD: {value: nextProps.DATA.REFACCTNO, label: nextProps.DATA.REFACCTNO},
                //     p_refacctno: nextProps.DATA.REFACCTNO, //so hieu tk giao dich
                //     p_fullname: nextProps.DATA.FULLNAME,
                //     p_saleid: nextProps.DATA.SALEID_NEW,
                //     p_saleid_old: nextProps.DATA.SALEID_OLD,
                //     p_tlname: nextProps.DATA.NEWSALENAME,
                //     p_retype: nextProps.DATA.RETYPE,
                //     p_rerole: nextProps.DATA.REROLE,
                //     p_reproduct: nextProps.DATA.REPRODUCT,
                //     p_desc: nextProps.DATA.DESC,
                //     pv_objname: this.props.OBJNAME,
                //     pv_language: this.props.language,
                //     access: nextProps.access,
                // })
        }
        else
            if (nextProps.isClear) {
                this.props.change()

                this.setState({

                    fatca: false,
                    authorize: false,
                    upload: false,
                    quydangki: false,
                    p_refacctno: '', //so hieu tk giao dich
                    p_fullname: '',
                    p_saleid: '',
                    p_saleid_old: '',
                    p_tlname: '',
                    p_retype: '',
                    p_saleacctno: '',
                    p_rerole: '',
                    p_reproduct: '',
                    label_reproduct: '',
                    label_rerole: '',
                    p_desc: '',
                    pv_language: this.props.language,
                    pv_objname: this.props.OBJNAME,

                    access: nextProps.access,

                })
            }
    }


    handleChange(type) {
        this.state.collapse[type] = !this.state.collapse[type];
        this.setState({ collapse: this.state.collapse })
    }
    closeModalDetail() {
        this.props.closeModalDetail()
    }
    onSetDefaultValue = (type, value) => {
        //console.log('this.state.REROLE.fdfd', this.state.REROLE)
        if (!this.state[type])
            this.state[type] = value
    }
    onChange(type, event) {
        let data = {};
        if (event.target) {

            this.state[type] = event.target.value;
        }
        else {
            this.state[type] = event.value;
        }
        this.setState({ p_desc: this.state.p_desc })
    }


    checkValid(name, id) {
        let value = this.state[name];
        let mssgerr = '';

        switch (name) {

            // case "p_refacctno":
            //     if (value == '') {
            //         mssgerr = this.props.strings.requiredrefacctno;
            //     }
            //     break;
            // case "p_saleid":
            //     if (value == '') {
            //         mssgerr = this.props.strings.requiredsaleid;
            //     }
            //     break;
            // case "p_retype":
            //     if (value == '') {
            //         mssgerr = this.props.strings.requiredretype;
            //     }
            //     break;
            default:
                break;
        }
        if (mssgerr !== '') {
            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
            datanotify.type = "error";
            datanotify.content = mssgerr;
            dispatch(showNotifi(datanotify));
            window.$(`#${id}`).focus();
        }
        return mssgerr;
    }
    // async submitGroup() {
    //     var mssgerr = '';
    //     for (let index = 0; index < this.state.checkFields.length; index++) {
    //         const element = this.state.checkFields[index];
    //         mssgerr = this.checkValid(element.name, element.id);
    //         if (mssgerr !== '')
    //             break;
    //     }
    //     if (mssgerr == '') {
    //         var api = '/user/addlistsalecustomers';
    //         if (this.state.access == "update") {
    //             api = '/user/updatesalecustomers';
    //         }
    //         var { dispatch } = this.props;
    //         var datanotify = {
    //             type: "",
    //             header: "",
    //             content: ""

    //         }
    //         //consoconsole.log('xxx ', this.state.LOAIHINH, this.state.CODEID)
    //         let self = this
    //         console.log('retype post: ', this.state.p_retype,  this.state.p_saleid + this.state.p_retype)
    //         RestfulUtils.posttrans(api, {
    //             refacctno: this.state.p_refacctno,
    //             retype: this.state.p_retype, saleid: this.state.p_saleid,
    //             saleid_old : this.state.p_saleid_old,
    //             saleacctno: this.state.p_saleid + this.state.p_retype,
    //             rerole: this.state.p_rerole, reproduct: this.state.p_reproduct, fullname: this.state.p_fullname,
    //             language: this.props.language, objname: this.props.OBJNAME
    //         })
    //             .then((res) => {
    //                 //onsole.log('res ', res)
    //                 if (res.EC == 0) {
    //                     datanotify.type = "success"
    //                     datanotify.content = this.props.strings.success;
    //                     dispatch(showNotifi(datanotify));
    //                     this.props.closeModalDetail()



    //                 } else {
    //                     datanotify.type = "error";
    //                     datanotify.content = res.EM;
    //                     dispatch(showNotifi(datanotify));
    //                 }

    //             })

    //     }
    // }

    fetchData(state, instance) {
        // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
        // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
        var that = this;
        // Request the data however you want.  Here, we'll use our mocked service we created earlier

        if (this.state.loading) {
            new Promise((resolve, reject) => {
                let { pageSize, page, filtered, sorted } = state;
                setTimeout(() => resolve(this.loadData(pageSize, page + 1, filtered, sorted, instance.props.columns)), 500);
            })
        }
        this.setState({ loading: true })
    }
    clearGroup() {
        this.setState({
            GROUP: { value: '', label: '' }
        })
    }
    async loadData(pagesize, page, keySearch, sortSearch, columns) {

        let that = this;
        await RestfulUtils.post('/user/getlistsalemanagers', { pagesize, page, keySearch, sortSearch, language: this.props.language, OBJNAME: this.props.OBJNAME }).then(resData => {


            // console.log('datatable',resData)
            // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
            if (resData.EC == 0) {
                that.setState({
                    data: resData.DT.data,
                    pages: resData.DT.numOfPages,
                    keySearch,
                    page,
                    pagesize,
                    sortSearch,
                    sumRecord: resData.DT.sumRecord,
                    colum: columns
                });
            }
            else {

            }


        });

    }
    refresh = () => {
        let self = this

        RestfulUtils.post('/user/getlistsalemanagers', { pagesize: this.state.pagesize, language: this.props.language, OBJNAME: this.props.OBJNAME }).then((resData) => {
            if (resData.EC == 0) {
                //console.log('sync success', resData)

                self.setState({ data: resData.DT.data, pages: resData.DT.numOfPages, sumRecord: resData.DT.sumRecord , dataAll: resData.DT.dataAll})
            } else {

                toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });

            }
        });

    }

    submitGroup = () => {
        
        let success = null;
        var p_saleacctno = this.state.SALEID+this.state.RETYPE;
        let datadelete = {
            grpid: this.state.GRPID,
            saleid: this.props.DATA.SALEID,
            saleacctno: p_saleacctno,
            language: this.props.language,
            objname: this.props.OBJNAME
        };
        //console.log('datadelete ', datadelete)
        
        RestfulUtils.post('/user/withdraw_brocker_0008', datadelete)
            .then(res => {
                console.log('res withdraw:',res)
                success = (res.rs.EC == 0);
                console.log('success:',success)
                success ? toast.success(this.props.strings.success, { position: toast.POSITION.BOTTOM_RIGHT })
                    : toast.error(this.props.strings.fail + res.EM, { position: toast.POSITION.BOTTOM_RIGHT })
                // if (this.state.selectedRows.size == i) {
                this.setState({ loaded: false })
                //this.refresh()
                let data = {
                    pageSize: this.state.pagesize,
                    page: this.state.page,
                    sorted: this.state.sortSearch,
                    filtered: this.state.keySearch,
                }
                //this.fetchData(data, { props: { columns: this.state.colum } })
                this.props.closeModalDetail();
                this.clearGroup()
                    
                // }
            });
    }
    
    getOptionsSoHieuTKGD(input) {
        return RestfulUtils.post('/account/search_all', { key: input })
            .then((res) => {

                return { options: res }
            })
    }
    //lay thong tin fullname -- useless
    getInforAccount(p_refacctno) {
        let self = this
        RestfulUtils.post('/account/get_generalinfor', { refacctno: this.state.p_refacctno, OBJNAME: this.props.OBJNAME  }).then((resData) => {

            if (resData.EC == 0) {
                self.setState({ AccountInfo: resData.DT });
            } else {
                self.setState({ AccountInfo: {} });
            }
        });
        let { AccountInfo } = this.state;
    }
    async onChangeSoHieuTKGD(e) { //phai truyen CUSTODYCD
        let self = this


        //console.log('AccountInfo ', AccountInfo)
        if (e && e.value) {
            await RestfulUtils.post('/account/get_generalinfor', { CUSTODYCD: e.label , OBJNAME: this.props.OBJNAME  }).then((resData) => {
                // console.log('onChangeSoHieuTKGD', resData)
                if (resData.EC == 0) {
                    self.setState({ AccountInfo: resData.DT });
                } else {
                    self.setState({ AccountInfo: {} });
                }
            });
            let { AccountInfo } = this.state;
           
            this.setState({
                p_refacctno: e.value,
                CUSTODYCD:e,
                p_fullname: AccountInfo.FULLNAME
            })
        }
        else {
            this.setState({
                CUSTODYCD:{value: '',label:''},
                p_refacctno:'',
                p_fullname: ''
            })
        }

    }
    //--------lay ma mo gioi-----

    async componentWillMount() {
        let that = this
        await RestfulUtils.post('/user/getlistsaleid', { language: this.props.language })
            .then((res) => {
                //console.log('data   ',res)
                that.setState({
                    ...that.state, dataMG: res.resultdata, optionsDataMG: res.result
                })

            })
    }
    async getOptionsMaMoGioi(input) {

        return { options: this.state.optionsDataMG }

    }
    async onChangeMaMoGioi(e) {
        let result = {};
        let { dataMG } = this.state
        if (e && e.value) {
            //console.log('checking', e.value)
            if (dataMG)
                if (dataMG.length > 0) {
                    result = await dataMG.filter(item => item.TLID == e.value)
                    if (result)
                        if (result.length > 0) {
                            //console.log('result dataMG', result)
                            this.setState({
                                dataMGrow: result[0],
                                p_tlname: result[0]["TLFULLNAME"],
                            })
                        }
                    // console.log('saleid: ', this.state.p_saleid)
                    //console.log('dataMGrow', this.state.dataMGrow)
                }
            this.setState({
                // optionMaLoaiHinh: [],
                // p_retype: ''
            })
            await RestfulUtils.post('/user/getretypebysaleid', { saleid: this.state.dataMGrow["TLID"], language: this.props.language })
                .then((res) => {
                    //console.log('data: ',res.data.resultdata)
                    if (res.result.length > 0) {

                        this.setState({
                            ...this.state, optionMaLoaiHinh: res.result, dataLH: res.resultdata,
                        })
                    }

                    //console.log('checking', dataLH, dataLH[0].REROLE)
                })

            this.setState({
                p_saleid: e.value
            })
        }
        else {
            this.setState({
                p_saleid: ''
            })
        }
    }
    async getOptionsMaLoaiHinh(input) {

        return { options: this.state.optionMaLoaiHinh }

    }
    async onChangeMaLoaiHinh(e) {
        let result = {};
        let { dataLH } = this.state
        console.log('dataLH :=====',dataLH)
        if (e && e.value) {
            if (dataLH)
                if (dataLH.length > 0) {
                    result = await dataLH.filter(item => item.AUTOID == e.value)
                    console.log('result :=====',result)
                    if (result)
                        if (result.length > 0) {
                            //console.log('result dataLH', result[0])
                            this.setState({
                                dataLHrow: result[0],
                                p_reproduct: result[0]["REPRODUCT"],
                                p_rerole: result[0]["REROLE"],
                                label_reproduct: result[0]["REPRODUCTDESC"],
                                label_rerole: result[0]["REROLEDESC"],
                            })
                        }
                }
            this.setState({
                p_retype: e.value,
            })
        } else {
            this.setState({
                p_retype: '',
            })
        }

    }
    showModalDetail(access, bacthang) {

        let titleModal = ""
        let DATA = ""
        console.log('bacthang',bacthang);
        switch (access) {
            case "add": titleModal = this.props.strings.modaladd; break
            case "update": titleModal = this.props.strings.modaledit; break;
            case "view": titleModal = this.props.strings.modalview; break
        }
        if (bacthang != undefined) {
            DATA = bacthang
        }

        this.setState({ showModalDetail: true, 
            titleModal: titleModal, 
            databacthang: DATA, 
            accessBACTHANG: access, 
            isClearbacthang: true, 
            loadgrid: false,
            // p_tlname: tmpData.TLNAME,
            // p_fullname: tmpData.TLFULLNAME,
            // p_brname: tmpData.BRNAME,
            // p_mbname: tmpData.MBNAME,
            // p_active: tmpData.ACTIVEDESC
        })
    }

    getOptions(input) {
        let data = {
            p_language: this.props.language,
            p_autoid: 'ALL',

        }
        console.log('language: ',data.p_language);
        return RestfulUtils.post('/fund/getlistsale_groups', data)
            .then((res) => {
                console.log('getOptionsGroup: ',res)
                return { options: res };
            })
    }
    onChange(e) {
        if (e && e.value) {
            this.setState({ GROUP: e });
        } else {
            this.setState({ GROUP: { value: '', label: '' } });
        }
    }

    render() {
        // console.log('retype : ', this.state.p_retype,  this.state.p_saleid + this.state.p_retype)
        //const pageSize = 5;
        //const { selectedOption, dataMGrow, dataLH } = this.state;
        let disableWhenView = (this.state.access == 'view')
        console.log('this.state',this.state);
        return (
            <Modal show={this.props.showModalDetail} bsSize="md" >
                <Modal.Header  >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body ">
                        <div className="add-info-account">
                            <div className={this.state.access == "view" ? "col-md-12 disable" : "col-md-12 "} style={{ paddingTop: "11px" }}>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5><b>{this.props.strings.tlname}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-control" id="lblTlname">{this.state.p_tlname}</label>
                                    </div>
                                    {/* <div className="col-md-8 customSelect">
                                        <Select.Async
                                            name="form-field-name"
                                            disabled={this.state.ISEDIT}
                                            placeholder={this.props.strings.refacctno}
                                            loadOptions={this.getOptionsSoHieuTKGD.bind(this)}
                                            value={this.state.CUSTODYCD}
                                            onChange={this.onChangeSoHieuTKGD.bind(this)}
                                            id="drdrefacctno"
                                            ref="txtrefacctno"
                                            disabled={true}
                                        />
                                    </div> */}
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5><b>{this.props.strings.fullname}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-control" id="lblFullname">{this.state.p_fullname}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className=""><b>{this.props.strings.titleNhom}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-control" id="lbltitleNhom">{this.state.GRPID}-{this.state.FULLNAME}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className=""><b>{this.props.strings.retype}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-control" id="lblretype">{this.state.RETYPE}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 ><b>{this.props.strings.MANAGERNAME}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-control" id="lblREROLE">{this.state.MANAGERNAME}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5><b>{this.props.strings.MANAGERFULLNAME}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-control" id="lblBrname">{this.state.MANAGERFULLNAME}</label>
                                    </div>
                                    
                                </div>
                                
                                <div className="col-md-12 row">
                                    <div className="pull-right">

                                        <input disabled={disableWhenView} onClick={this.submitGroup.bind(this)} type="button" className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}
const stateToProps = state => ({
    language: state.language.language
});
const decorators = flow([
    connect(stateToProps),
    translate('ModalRutMG')
]);
module.exports = decorators(ModalRutMG);
