import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'

import { connect } from 'react-redux'
import DropdownFactory from 'app/utils/DropdownFactory';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import NumberFormat from 'react-number-format';
import './ModalDialog.scss'

class ModalDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trangthai: 0,
    }
  }
  handleyesno(status, ACTION) {
      this.props.confirmPopup(status, ACTION)
      this.close();
  }
  close() {
    this.props.closeModalDetail();
  }
  render() {
    let { ACTION, isCustom, SIGN_IMG, data } = this.props;
    return (
      <Modal show={this.props.showModalDetail} bsSize="sm" className="modal-action" onHide={this.close.bind(this)} >
          <div className="title-content"> 
            <span>
              {this.props.strings.title}
            </span>
            <button className="close" onClick={this.close.bind(this)}>
                <span aria-hidden="true">×</span>
                <span className="sr-only">Close</span>
            </button>
          </div>
        <div className="icon-container">
          <span className="icon-bg">
            <i className="fas fa-clipboard-list" />
          </span>
        </div>
        <div className="modal-middle">
          {ACTION == "delete" ? <span>    {this.props.strings.bodyconfirmdelete}  </span>
            : ACTION == "edit" ? <span>    {this.props.strings.bodyconfirmedit}  </span>: null
          }

          {ACTION === "delete" && !isCustom && data.STATUS != '1' && data.STATUS != 'N' && (
            <div className="col-md-12 form-group text-right div-add-order-image">
              <input
                className="form-control"
                id="btnOrderImg"
                type="button"
                defaultValue={this.props.strings.uploadOrderImg}
                onClick={this.props.openModalCreateUploadOriginalOrder}
              />
              {SIGN_IMG && (
                <div className="icon-added-order-image"><i class="fas fa-check"></i></div>
              )}
            </div>
          )}

          <div className="modal-bottom">
            <button className="sayYes" onClick={this.handleyesno.bind(this, true, ACTION)}>{this.props.strings.YES}</button>
            <button className="sayNo" onClick={this.handleyesno.bind(this, false, ACTION)}>{this.props.strings.NO} </button>
          </div>
        </div>

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
  translate('ModalDialog')
]);

module.exports = decorators(ModalDialog);