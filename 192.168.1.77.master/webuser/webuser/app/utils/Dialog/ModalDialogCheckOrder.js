import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'

import { connect } from 'react-redux'
import DropdownFactory from 'app/utils/DropdownFactory';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import NumberFormat from 'react-number-format';

class ModalDialogCheckOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trangthai: 0,
    }
  }
  handleyesno(status, ACTION) {
    let data = this.props.data;
    if (status == 'Y') {
      this.props.confirmPopupCheckOrder(true, ACTION)
      this.close();
      // this.setState({ trangthai: 'Y' })

    }
    else {
      // this.setState({ trangthai: 'N' })
      this.props.confirmPopupCheckOrder(false, ACTION)
      this.close();
    }
  }
  close() {
    this.props.closeModalDetail();
  }
  render() {
    console.log('render modal')
    let ACTION = this.props.ACTION
    return (

      <Modal show={this.props.showModalDetail} bsSize="md" >
        <Modal.Header>
          <Modal.Title ><div className="title-content col-md-6 "> {this.props.strings.title}
            <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflow: "auto", height: "100%" }}>
          {ACTION == "add" ? <div><h4> <i>   {this.props.strings.content1} </i> </h4> <h4>  <b>   {this.props.strings.content2} </b> </h4></div>
            : ACTION == "edit" ? <div><h4>  <i>  {this.props.strings.content1} </i> </h4> <h4>   <b>   {this.props.strings.content3} </b>  </h4></div> : null
          }

          <div className="nav justify-content-end">
            <button style={{ float: "right", marginRight: "5px", marginLeft: "5px", width: "70px" }} type="button" className="btn btn-default" onClick={this.handleyesno.bind(this, 'N', ACTION)}>{this.props.strings.NO}</button>
            <button style={{ float: "right", marginRight: "5px", marginLeft: "5px", width: "70px" }} type="button" className="btn btn-primary" onClick={this.handleyesno.bind(this, 'Y', ACTION)}>{this.props.strings.YES}</button>
          </div>
        </Modal.Body>
      </Modal>

    );
  }
}
const stateToProps = state => ({
  language: state.language.language,
  tradingdate: state.systemdate.tradingdate
});
const decorators = flow([
  connect(stateToProps),
  translate('ModalDialogCheckOrder')
]);

module.exports = decorators(ModalDialogCheckOrder);