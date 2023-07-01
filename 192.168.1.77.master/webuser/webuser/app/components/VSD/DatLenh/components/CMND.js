import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { closeModalCMND } from 'actionDatLenh';
import RestfulUtils from '../../../../utils/RestfulUtils'
class CMND extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.CUSTODYCD !== nextProps.CUSTODYCD) {
      if (nextProps.CUSTODYCD)
        RestfulUtils.post('/order/getidcodeimg', { CUSTODYCD: nextProps.CUSTODYCD , OBJNAME: nextProps.OBJNAME }).then((resData) => {
          if (resData.EC == 0)
            this.setState({ ...this.state, idcodeimg: resData.DT.p_idscan })
        });
      else
        this.setState({ ...this.state, idcodeimg: '' })
    }
  }
  close() {
    var { dispatch } = this.props;
    dispatch(closeModalCMND());
  }
  render() {
    let { idcodeimg } = this.state;
    let $IDCODEIMGPreview = null;
    if (idcodeimg) {
      $IDCODEIMGPreview = (<img style={{
        width: " 250px",
        height: "200px",
        padding: " 10px"
      }} src={idcodeimg} />);
    } else {
      $IDCODEIMGPreview = (<div className="previewText"></div>);
    }
    return (
      <div className="popup-form">
        <Modal show={this.props.showModal} bsSize="sm" >
          <Modal.Header>
            <Modal.Title> <div style={{ textAlign: "center" }} className="title-content col-md-6">{this.props.strings.title}</div> </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {$IDCODEIMGPreview}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close.bind(this)}>{this.props.strings.exit}</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}
const stateToProps = state => ({
  showModal: state.datLenh.showModalCMND,
  language: state.language.language
});
const decorators = flow([
  connect(stateToProps),
  translate('CMND')
]);
module.exports = decorators(CMND);

