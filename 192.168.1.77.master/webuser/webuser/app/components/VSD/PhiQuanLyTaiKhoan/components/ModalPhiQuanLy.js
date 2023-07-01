import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { showNotifi } from 'app/action/actionNotification.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import DropdownFactory from 'app/utils/DropdownFactory';
import NumberFormat from 'react-number-format';

class ModalPhiQuanLy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            access: 'add',
            datagroup: {},
        };
    }
    close() {
        this.props.closeModalDetail();
    }

    componentWillReceiveProps(nextProps) {
        let self = this;
        if (nextProps.access == "update" || nextProps.access == "view") {
            if (nextProps.isClear) {
                this.props.change()
               //console.log("thanh.ngo------nextProps.DATA:",nextProps.DATA)    
                this.setState({
                    datagroup: {
                        p_codeid: nextProps.DATA.CODEID,
                        p_tradingid:nextProps.DATA.TRADINGID,
                        p_managerfee: nextProps.DATA.MANAGERFEEAMT,
                        p_desc: '',
                        pv_objname: this.props.OBJNAME,
                        p_language: this.props.lang
                    },
                    access: nextProps.access,
                    //symbol: nextProps.DATA.SYMBOL
                })
            }
        }
        else
            this.setState({

            })
    }

    closeModalDetail() {
        this.props.closeModalDetail()
    }

    onChange(type, event) {
        let data = {};

        if (event.target) {

            this.state.datagroup[type] = event.target.value;
        }
        else {

            this.state.datagroup[type] = event.value;
        }
        this.setState({ datagroup: this.state.datagroup })
    }
    onSetDefaultValue = (type, value) => {
        if (!this.state.datagroup[type])
            this.state.datagroup[type] = value
    }
    onChangeDRD(type, event) {

        let data = {};
        if (event.target) {

            this.state.datagroup[type] = event.target.value;
        }
        else {

            this.state.datagroup[type] = event.value;
        }
        this.setState({ datagroup: this.state.datagroup })
    }
    action = () => {
        var api = '/order/update_managerfee';


            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""
            }
          
            RestfulUtils.posttrans(api, this.state.datagroup)
                .then((res) => {
                    if (res.EC == 0) {
                        datanotify.type = "success";
                        datanotify.content = this.props.strings.success;
                        dispatch(showNotifi(datanotify));
                        this.props.load()
                        this.props.closeModalDetail()
                    } else {
                        datanotify.type = "error";
                        datanotify.content = res.EM;
                        dispatch(showNotifi(datanotify));
                    }

                })
    }
    onValueChange(type, data) {
        this.state.datagroup[type] = data.value
        this.setState({ datagroup: this.state.datagroup })
    }
    
    render() {
        const pageSize = 5;
        let displayy = this.state.access == 'view' ? true : false
        //console.log('DATA >>>>', this.props.DATA)
        return (
            <Modal show={this.props.showModalDetail}   >
                <Modal.Header  >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body">
                    <div className="add-info-account">
                        <div className="row">
                            <div className="col-md-6">
                                <h5><b>{this.props.strings.codeid}</b></h5>
                            </div>
                            <div className="col-md-6">
                                <h5>{this.props.DATA.SYMBOL}</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <h5><b>{this.props.strings.tradingid}</b></h5>
                            </div>
                            <div className="col-md-6">
                                <h5>{this.props.DATA.TRADINGID}</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <h5 className="highlight"><b>{this.props.strings.managerfee}</b></h5>
                            </div>
                            <div className="col-md-6">
                                <NumberFormat thousandSeparator={true}   className="form-control" value={this.state.datagroup["p_managerfee"]} onValueChange={this.onValueChange.bind(this, "p_managerfee")} id="txtamt"  />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <h5><b>{this.props.strings.desc}</b></h5>
                            </div>
                            <div className="col-md-6">
                                        <input maxLength={1000} disabled={displayy} className="form-control" placeholder={this.props.strings.mota} id="txtDesc" value={this.state.datagroup["p_desc"]} onChange={this.onChange.bind(this, "p_desc")} />
                            </div>
                        </div>
                        
                        <div style={{marginRight: "0px"}} className="text-right row">
                            <button onClick={this.action} type="button" className="btn btn-primary">  <a style={{ color: "#ffffff", textDecoration: "none" }}>{this.props.strings.submit}</a></button>
                        </div>
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
    translate('ModalPhiQuanLy')
]);

module.exports = decorators(ModalPhiQuanLy);