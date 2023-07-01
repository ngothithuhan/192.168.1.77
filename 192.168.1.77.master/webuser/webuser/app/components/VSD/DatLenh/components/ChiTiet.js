import React from 'react';
import { connect } from 'react-redux';
import { closeModalChiTiet } from 'actionDatLenh';
import { Modal, Button } from 'react-bootstrap';
import Toggle from 'react-toggle'
import "react-toggle/style.css"
import RestfulUtils from 'app/utils/RestfulUtils'

class ChiTiet extends React.Component {
  constructor(props) {
    super(props);
    var listFundBalance = [];
    this.state = {
      listFund: listFundBalance,
      rowdisplay: {},
      sumQtty: 0,
      SEDTLID: '',
      err_msg:'',
    };
  }

  componentWillReceiveProps(nextProps) {
    var self = this;
    
    var codeid = '';
    var custodycd = '';
    var objname = '';

    if (nextProps.CODEID) {
      this.setState({ CODEID: nextProps.CODEID });
      codeid = nextProps.CODEID;
      veProps: custodycd
    }
    if (nextProps.CUSTODYCD) {
      this.setState({ CUSTODYCD: nextProps.CUSTODYCD });
      custodycd = nextProps.CUSTODYCD;
    }
   
    if (nextProps.showModal) {
      var body = {
        CODEID: codeid,
        CUSTODYCD: custodycd,
        OBJNAME: this.props.OBJNAME
      }
      RestfulUtils.post('/balance/getfundbalance', body).then((res) => {
        if (res.EC === 0) {
          self.setState({ listFund: res.DT });
        } else {
          self.setState({ err_msg: res.EM });
        }

      });
    }

  }
  componentDidMount() {

  }

  closeDialog() {
    var { dispatch } = this.props;
    dispatch(closeModalChiTiet());
  }
  onClickSellFund(SEDTLID) {
    var rowdisplay = {}
    rowdisplay[SEDTLID] = true;
    var idinput = "PlaceQtty" + SEDTLID;
    this.refs[idinput].value = 0;
    this.setState({ rowdisplay: rowdisplay, sumQtty: 0, SEDTLID: SEDTLID });
  }

  onChangeSellAmount(event) {
    var amt = event.target.value;
    this.setState({ sumQtty: amt });
  }
  onChangeAllSell(event) {
    var self = this;
    if (event.target.checked) {
      var rowdisplay = {};
      var sumQtty = 0;
      this.state.listFund.map(function(i,index) {
        rowdisplay[i.SEDTLID] = true;
        var idinput = "PlaceQtty" + i.SEDTLID;
        self.refs[idinput].value = i.AVLQTTY;
        self.refs[idinput].disabled = true;
        sumQtty += i.AVLQTTY;
      });
      self.setState({ rowdisplay: rowdisplay,sumQtty:sumQtty});
    }
    else {
      var rowdisplay = {};
      this.state.listFund.map(function(i,index) {
        rowdisplay[i.SEDTLID] = false;
        var idinput = "PlaceQtty" + i.SEDTLID;
        self.refs[idinput].value = 0;
        self.refs[idinput].disabled = false;
      });
      self.setState({ rowdisplay: rowdisplay,sumQtty:0});
    }
  }
  onConfirm() {
    this.closeDialog();
    this.props.onClickConfirm(this.state.SEDTLID, this.state.sumQtty);
  }
  render() {
    var sum = 0;
    var self = this;
    return (
      <div className="popup-form">
        <Modal show={this.props.showModal} onHide={this.closeDialog.bind(this)}>
          <Modal.Header closeButton>
            {/* <Modal.Title> <div style={{textAlign:"center"}} className="">Ủy quyền</div> </Modal.Title> */}
          </Modal.Header>
          <Modal.Body style={{ overflow: "auto", height: "100%" }}>
            <div>
              <div className="col-xs-12" style={{ marginBottom: "10px",display:'flex',alignItems:'center' }}>
                <label style={{marginBottom:'0px',marginRight:'10px'}}>Bán hết</label>
                <Toggle defaultChecked={false} onChange={this.onChangeAllSell.bind(this)} />
              </div>
              <table className="table table-hover" >
                <thead>
                  <tr className="head">
                    <th>SHTKGD</th>
                    <th>Khả dụng</th>
                    <th>Ngày phát sinh</th>
                    <th>Số lượng đặt bán</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.listFund.map(function (i, index) {

                    // var SoLuongDatBan = parseInt(i.SoLuongDatBan);
                    // sum += SoLuongDatBan;
                    return (
                      <tr key={index}>
                        <td>{i.CUSTODYCD}</td>
                        <td>{i.AVLQTTY}</td>
                        <td>{i.TXDATE}</td>
                        <td style={{ color: "red",padding:'4px' }}>
                          <div style={{ float: 'left' }}><button ref="btnSell" style={{ display: self.state.rowdisplay[i.SEDTLID] ? 'none' : '', padding: '3px 6px', lineHeight: '9px', fontSize: '12px' }} className="btn btn-link" onClick={self.onClickSellFund.bind(self, i.SEDTLID)}>Bán</button></div>
                          <div style={{ width: '100px', display: self.state.rowdisplay[i.SEDTLID] ? '' : 'none', float: 'left' }}><input ref={"PlaceQtty" + i.SEDTLID} onChange={self.onChangeSellAmount.bind(self)} className="form-control" defaultValue="0" style={{height:'30px'}}/></div></td>
                      </tr>
                    )
                  })
                  }
                  <tr>
                    <td colSpan="2"></td>
                    <td style={{ color: "red", fontWeight: "bold" }} >Tổng bán</td>
                    <td style={{ color: "red" }}>{self.state.sumQtty}</td>
                  </tr>
                </tbody>
              </table>
              <div className="col-md-12">
                <div style={{ color: 'red' }}>{this.state.err_msg}</div>
              </div>

            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button style={{ padding: "5px 10px", fontSize: "12px" }} bsStyle="success" onClick={this.onConfirm.bind(this)}>Chấp nhận</Button>
            <Button style={{ padding: "5px 10px", fontSize: "12px" }}  >Làm mới</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

module.exports = connect(function (state) {
  return { showModal: state.datLenh.showModalChiTiet };
})(ChiTiet);
