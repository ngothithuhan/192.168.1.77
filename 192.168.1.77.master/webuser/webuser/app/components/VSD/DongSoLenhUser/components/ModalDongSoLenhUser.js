import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { showNotifi } from 'app/action/actionNotification.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import Select from 'react-select';
class ModalDongSoLenhUser extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         listOptionSelect: {
    //             ISSIP: [{
    //                 "label": "Có",
    //                 "value": "Y"
    //               },
    //               {
    //                 "label": "Không",
    //                 "value": "N"
    //               }]

    //         },
    //     };
    // }
    close() {
        this.props.closeModalDetail();
    }

    closeModalDetail() {
        this.props.closeModalDetail()
    }
    action = () => {
        let self = this
        
        RestfulUtils.posttrans('/order/processcloseorderManual', {symbol: this.props.DATA.SYMBOL ,sessionno: this.props.DATA.TRADINGID ,desc: this.props.DATA.DESC_STATUS ,  language: this.props.lang, objname: this.props.OBJNAME}).then((resData) => {
            var { dispatch } = self.props;
                var datanotify = {
                  type: "",
                  header: "", //khong quan tam header
                  content: ""
                }
            if (resData.EC == 0) {
                datanotify.type="success"
                datanotify.content = self.props.strings.thongbaothanhcong;
                dispatch(showNotifi(datanotify));
                this.props.closeModalDetail()
            }
            else{
                //console.log("else",resData)
                datanotify.type="error"
                datanotify.content = resData.EM;
                dispatch(showNotifi(datanotify));
            }
            
        });

    }
    onChangeSelect(type, e) {
        console.log('change drop  :', type, e)

        this.state[type] = e.value;

        this.setState({ state: this.state });
    }
    // async getOptions(input) {

    //     return { options: this.state.listOptionSelect.ISSIP }

    // }
    render() {
        const pageSize = 5;
        return (
            <Modal show={this.props.showModalDetail}   >
                <Modal.Header  >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body">
                        <div className="row">
                            <div className="col-md-6">
                                <h5><b>{this.props.strings.idchungchi}</b></h5>
                            </div>
                            <div className="col-md-6">
                                <h5>{this.props.DATA.SYMBOL}</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <h5><b>{this.props.strings.phiengiaodich}</b></h5>
                            </div>
                            <div className="col-md-6">
                                <h5>{this.props.DATA.TRADINGID}</h5>
                            </div>
                        </div>
                        {/* <div className="row">
                            <div className="col-md-6">
                                <h5><b>{this.props.strings.ISSIP}</b></h5>
                            </div>
                            <div className="col-md-6">
                            <Select.Async
                                    name="form-field-name"
                                    placeholder={""}
                                    value={this.state['ISSIP']}
                                    loadOptions={this.getOptions.bind(this)}
                                    onChange={this.onChangeSelect.bind(this, 'ISSIP')}
                                    clearable={true}
                                    options={this.state.listOptionSelect['ISSIP']}
                                    backspaceRemoves={false}
                                    cache={false}
                                />
                            </div>
                        </div> */}
                        <div className="row">
                            <div className="col-md-6">
                                <h5><b>{this.props.strings.mota}</b></h5>
                            </div>
                            <div className="col-md-6">
                                <h5>{this.props.lang == 'vie' ? this.props.DATA.DESC_STATUS : this.props.DATA.DESC_STATUS_EN}</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <h5><b>{this.props.strings.tradingdate}</b></h5>
                            </div>
                            <div className="col-md-6">
                                <h5>{this.props.DATA.TRADINGDATE}</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <h5><b>{this.props.strings.clsorddate}</b></h5>
                            </div>
                            <div className="col-md-6">
                                <h5>{this.props.DATA.CLSORDDATE}</h5>
                            </div>
                        </div>
                        <div style={{marginRight: "20px"}} className="text-right row">
                            <button onClick={this.action} type="button" className="btn btn-primary">  <a style={{ color: "#ffffff", textDecoration: "none" }}>{this.props.strings.submit}</a></button>
                        </div>
                    </div>
                </Modal.Body>

            </Modal>
        );
    }
}
const stateToProps = state => ({
    lang: state.language.language
});


const decorators = flow([
    connect(stateToProps),
    translate('ModalDongSoLenhUser')
]);

module.exports = decorators(ModalDongSoLenhUser);