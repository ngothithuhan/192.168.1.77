import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import DropdownFactory from 'app/utils/DropdownFactory'
import DateInput from "app/utils/input/DateInput";
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import Select from 'react-select';
import { getExtensionByLang } from 'app/Helpers'


class Synccareby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: {
                general: true,
                authorize: true,
                fatca: false
            },
            showModalDetail: false,
            titleModal: 'Taọ tài khoản',
            DATA: "",
            access: "add",
            isClear: true,
            loadgrid: false
        };
    }
    createSuccess(access) {
        this.setState({ access: access })
    }
    closeModalDetail() {
        this.setState({ showModalDetail: false, isClear: true, loadgrid: false })
    }
    showModalDetail(access, DATAUPDATE) {

        let titleModal = ""
        let DATA = ""

        switch (access) {
            case "add": titleModal = this.props.strings.modaladd; break
            case "update": titleModal = this.props.strings.modaledit; break;
            case "view": titleModal = this.props.strings.modalview; break
        }
        if (DATAUPDATE != undefined) {
            DATA = DATAUPDATE
        }

        this.setState({ showModalDetail: true, titleModal: titleModal, DATA: DATA, access: access, isClear: true, loadgrid: false })
    }
    change() {

        this.setState({ isClear: false })
    }
    load() {
        this.setState({ loadgrid: true })
    }
    async submitUser() {

        var api = '/user/syncuser';
        var { dispatch } = this.props;
        var datanotify = {
            type: "",
            header: "",
            content: ""

        }
        let that = this
        ////console.log(api)
        //console.log(this.state.datauser)
        RestfulUtils.posttrans(api,  {language :this.props.language})
            .then((res) => {
                //console.log(res)
                if (res.result[0].PRC_SYSTEM_LOGEVENT == 0) {
                    datanotify.type = "success";
                    datanotify.content = this.props.strings.success;
                    dispatch(showNotifi(datanotify));
                    //this.setState({ err_msg: "Thêm mới user thành công" })


                } else {
                    datanotify.type = "error";
                    datanotify.content = res.EM;
                    dispatch(showNotifi(datanotify));
                }

            })
    }
    render() {
        let { datapage } = this.props
        return (
            <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">

                <div className="title-content">{this.props.strings.title}</div>
                <div className="panel-body" >
                    <div className="col-md-12 row">
                        <div className="col-md-4">
                            <h5><b>{this.props.strings.note}</b></h5>
                        </div>
                        <div className="col-md-6">
                            <input type="button" className="btn btn-primary" style={{ marginLeft: 0, marginRight: 5 }} value={this.props.strings.submit} onClick={this.submitUser.bind(this)} id="btnSubmit" />

                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    language: state.language.language,
});


const decorators = flow([
    connect(stateToProps),
    translate('Synccareby')
]);

module.exports = decorators(Synccareby);
