import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { showNotifi } from 'app/action/actionNotification.js';
import Select from 'react-select'

class ModalAddDBCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DBCODE: { value: '', label: '' },
        };
    }
    /**
     * Trường hợp update thì hiển thị tất cả thông tin lên cho sửa
     * Trường hơp view thì ẩn các nút sửa không cho duyệt
     * Trường hợp add thì ẩn thông tin chỉ hiện thông tin chung cho người dùng -> Thực hiện -> Mở các thông tin tiếp theo cho người dùng khai
     * @param {*access} nextProps
     */
    componentWillReceiveProps(nextProps) {
        let self = this;
        if (nextProps.access == "update" || nextProps.access == "view") {
            if (nextProps.dataUPDATE) {
                this.setState({
                    DBCODE: nextProps.dataUPDATE
                })
            }
        }
    }
    async onAgentChange(e) {
        var self = this;
        if (e) {
            this.setState({ DBCODE: e });
        }
    }
    checkValid(data) {
        let mssgerr = '';
        let value = data && data.value;

        if (value == '' || value == undefined) mssgerr = this.props.strings.requiredbcode;

        if (mssgerr !== '') {
            this.props.dispatch(showNotifi({
                type: "error",
                header: "",
                content: mssgerr
            }));
            window.$(`#${id}`).focus();
        }
        return mssgerr;
    }
    clearDataModal = () => {
        this.setState({
            DBCODE: { value: '', label: '' },
        })
    }
    close() {
        this.clearDataModal();
        this.props.closeModalDetail();
    }
    addDBCode() {
        let mssgerr = this.checkValid(this.state.DBCODE);
        if (mssgerr == '') {
            this.props.addDBCode(this.state.DBCODE, this.props.access)
            this.clearDataModal();
        }
    }
    render() {
        let displayy = this.state.access == 'view' ? true : false
        return (
            <Modal show={this.props.showModalDetail} backdropClassName="secondModal" dialogClassName="custom-second-modal" bsSize="lg">
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                    <form>
                        <div className={this.state.access == "view" ? "panel-body disable" : "panel-body"}>
                            <div className="col-md-12 row" style={{ height: "100px" }}>
                                <h5 className="col-md-5"><b>{this.props.strings.dbcode}</b></h5>
                                <div className="col-md-7">
                                    <Select
                                        disabled={displayy}
                                        name="form-field-name"
                                        placeholder={this.props.strings.dbcode}
                                        options={this.props.listDBCode}
                                        value={this.state.DBCODE}
                                        onChange={this.onAgentChange.bind(this)}
                                        cache={false}
                                    />
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="pull-right">
                                    <input type="button" onClick={this.addDBCode.bind(this)} className="btn btn-primary" style={{ marginRight: 10, marginTop: 20 }} value={this.props.strings.submit} id="btnSubmit" />
                                </div>
                            </div>
                        </div>
                    </form >

                </Modal.Body>

            </Modal >
        );
    }
}
const stateToProps = state => ({
    lang: state.language.language
});
const decorators = flow([
    connect(stateToProps),
    translate('ModalAddDBCode')
]);
module.exports = decorators(ModalAddDBCode);
