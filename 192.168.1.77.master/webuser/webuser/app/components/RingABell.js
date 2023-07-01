import React from 'react'
import RestfulUtils from 'app/utils/RestfulUtils';
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import ShadowScrollbar from 'app/components/ShadowScrollbar';
import { showNotifi } from 'app/action/actionNotification.js';
import moment from 'moment'
import { Modal } from 'react-bootstrap'

class RingABell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datamenu: [],
      data: [],
      notificationNUM: 1,
      page: 1,
      showModalDetail: false,
      dataDetail: {}
    }
  }

  async getBell() {
    if (this.props.auth.user.ISCUSTOMER == 'Y') {
      let that = this;
      let data = {
        custodycd: this.props.auth.user.USERID,
        language: this.props.language,
      }
      await RestfulUtils.post('/fund/getlistalert4account', data).then((resData) => {
        //console.log(resData)


        // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
        if (resData.EC == 0) {

          that.setState({
            data: resData.DT.data,
          });
        }
      });
    } else this.setState({
      data: [],
    })
  }
  componentDidMount() {


    this.getBell()
  }
  actionAtBottom() {

    let pageindex = this.state.page += 1
    let countpageindex = this.state.data.length
    if (countpageindex >= pageindex * 10) {
      this.setState({
        page: pageindex
      })
    }

  }

  async deleteNoti(autoid) {
    let that = this;
    let data = {
      p_refid: this.props.auth.user.USERID,
      language: this.props.language,
      p_autoid: autoid
    }
    var { dispatch } = this.props;
    var datanotify = {
      type: "",
      header: "",
      content: ""

    }
    await RestfulUtils.post('/fund/SeenNoti', data).then((resData) => {
      if (resData.EC == 0) {
        RestfulUtils.post('/fund/deleteNotiBell', data).then((resData1) => {
          if (resData1.EC == 0) {
            datanotify.type = "success";
            datanotify.content = this.props.strings.success;
            dispatch(showNotifi(datanotify));
            that.getBell()
          } else {
            datanotify.type = "error";
            datanotify.content = resData1.EM;
          }
        })
      }
    })
  }
  async SeenNoti(autoid) {
    let that = this;
    let data = {
      p_refid: this.props.auth.user.USERID,
      language: this.props.language,
      p_autoid: autoid
    }
    await RestfulUtils.post('/fund/SeenNoti', data).then((resData) => {

      if (resData.EC == 0) {
        var data = this.state.data.filter(nodes => nodes.AUTOID == autoid)

        this.setState({
          showModalDetail: true,
          dataDetail: data[0]
        })
        //that.deleteNoti(autoid)
      }
    });
  }
  close() {
    this.setState({
      showModalDetail: false
    })
  }
  render() {

    let { data, page } = this.state
    let datafill = data.slice(0, 10 * page)
    const notiBell = (
      <ul className="nav navbar-nav bellcustom ">
        <ShadowScrollbar style={{ width: 350, height: 430 }} actionAtBottom={this.actionAtBottom.bind(this)}>
          {datafill.map(function (data, i) {
            let classEven = i % 2 == 0 ? " coloreven" : ""


            return (


              <li key={"libell" + i} className={"dropdown-mainmenu liCustom" + classEven} title={data.SHORTCONTENT}>
                <div style={{ height: "25px" }}>

                  <div className='Bell' onClick={this.SeenNoti.bind(this, data.AUTOID)}  >{data.SHORTCONTENT} </div>
                  <div className="BellClose" onClick={this.deleteNoti.bind(this, data.AUTOID)}><i className="fas fa-times-circle"></i></div>

                </div>
                <div className='Bell' onClick={this.SeenNoti.bind(this, data.AUTOID)}>
                  <span style={{ fontSize: "10px" }} ><i className="far fa-clock" style={{ paddingRight: "5px" }}></i>{moment(data.LASTCHANGE, 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY HH:mm')}</span>
                </div>
              </li>

            )

          }.bind(this))

          }
        </ShadowScrollbar>
      </ul>
    )


    let displayBell = this.props.auth.user.ISCUSTOMER == 'Y' ? 'block' : 'none'
    return (
      <div style={{ display: displayBell }}>
        <ul style={{ paddingRight: "8px" }} className="nav navbar-nav navbar-right ">
          <li className="dropdown">
            <div className="button_notification" title={this.props.strings.notification}>
              <a style={{ background: '#242729' }} href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i style={{ color: '#ffa648' }} className="fa fa-bell hehe" id="bell"></i></a>
              {this.state.notificationNUM > 0 &&
                <span className="button__badge ">{this.state.notificationNUM}</span>
              }
              <ul style={{ marginRight: "6px", zIndex: 1001 }} className="dropdown-menu hihi">
                <div className="titleBell">{this.props.strings.notification}</div>
                {notiBell}
              </ul>
            </div>
          </li>
        </ul>
        <Modal show={this.state.showModalDetail}  >
          <Modal.Header  >
            <Modal.Title ><div className="title-content col-md-6">{this.state.dataDetail["SHORTCONTENT"]} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ overflow: "auto", height: "100%" }}>
            <div className="panel-body ">
              <div className="add-info-account">
                <div style={{ paddingTop: "11px" }}>

                  {/*
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className=""><b>{this.props.strings.createtime}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <input disabled={true} className="form-control"  value={this.state.dataDetail["p_senddate"]}  id="txtCreatetime"  />
                                    </div>

                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className=""><b>{this.props.strings.shortcontent}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <input disabled={true} className="form-control" type="text" placeholder={this.props.strings.shortcontent} id="txtShortcontent" value={this.state.dataDetail["SHORTCONTENT"]} />
                                    </div>

                                </div>
                                */}
                  <div className="col-md-12 row">
                    {/*
                                    <div className="col-md-3">
                                        <h5 className=""><b>{this.props.strings.maincontent1}</b></h5>
                                    </div>
                                */}
                    <div className="col-md-12">
                      <textarea disabled={true} className="form-control" rows="10" id="txtMaincontent" value={this.state.dataDetail["MAINCONTENT"]} ></textarea>
                    </div>

                  </div>
                  {/*
                                <div className="col-md-12 row">
                                    <div className="pull-right">
                                        <input  type="button" onClick={this.close.bind(this)} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />
                                    </div>
                                </div>
                                     */}
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>

    )
  }
}

const stateToProps = state => ({
  auth: state.auth,
  language: state.language.language
});



const decorators = flow([
  connect(stateToProps),
  translate('RingABell')
]);
module.exports = decorators(RingABell)
