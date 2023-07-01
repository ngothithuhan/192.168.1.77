import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { closeModalThongTinUyQuyen } from 'actionDatLenh';
import RestfulUtils from '../../../../utils/RestfulUtils'
class UyQuyen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { list_cfauth: [] };
  }

  componentWillReceiveProps(nextProps) {
    var self = this;
    if (nextProps.CUSTODYCD) {
      if(nextProps.CUSTODYCD !== this.props.CUSTODYCD )
        RestfulUtils.post('/account/get_cfauthinfor', { p_custodycd: nextProps.CUSTODYCD, OBJNAME: nextProps.OBJNAME, p_language : this.props.language}).then((resData) => {
          if (resData.EC === 0) {
            self.setState({ list_cfauth: resData.DT });
          } else {
            self.setState({ list_cfauth: [] });
          }
        });
    }
    else
      self.setState({ list_cfauth: [] });
  }
  close() {
    var { dispatch } = this.props;
    dispatch(closeModalThongTinUyQuyen());
  }
  render() {
    return (
      <div className="popup-form">
        <Modal show={this.props.showModal} onHide={this.close}>
          <Modal.Header>
            <Modal.Title> <div style={{ textAlign: "center" }} className="title-content col-md-6">{this.props.strings.authen}</div> </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table className="table table-hover" >
              <thead>
                <tr className="head">
                  <th>{this.props.strings.name}</th>
                  <th>{this.props.strings.idcode}</th>
                  <th>{this.props.strings.iddate}</th>
                </tr>
              </thead>
              <tbody>{this.state.list_cfauth.map(function (i, index) {

                return (
                  <tr key={index}>
                    <td>{i.CUSTNAME}</td>
                    <td>{i.IDCODE}</td>
                    <td>{i.IDDATE}</td>
                  </tr>
                )
              })
              }
              </tbody>
            </table>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close.bind(this)}>Thoát</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}
const stateToProps = state => ({
  language: state.language.language,
  auth: state.auth,
  showModal: state.datLenh.showModalThongTinUyQuyen,
  tradingdate: state.systemdate.tradingdate
});
const decorators = flow([
  connect(stateToProps),
  translate('UyQuyen')
]);
module.exports = decorators(UyQuyen);
// module.exports = connect(state => ({
//   showModal: state.datLenh.showModalThongTinUyQuyen,
//   language: state.language.language
// }))(UyQuyen);
