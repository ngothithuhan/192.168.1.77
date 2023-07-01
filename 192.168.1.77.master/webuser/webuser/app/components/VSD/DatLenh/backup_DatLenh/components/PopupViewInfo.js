import React from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { closeModalViewInfo } from 'actionDatLenh';
import NumberInput from 'app/utils/input/NumberInput'
import RestfulUtils from '../../../../utils/RestfulUtils'
class PopupViewInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            datarecieve: {},
            bankinfo :''
        };
    }
    componentWillMount() {
        // this.setState({ datarecieve: this.props.data })
        // console.log('will mount in view info', this.props.data)
    }
    componentDidMount() {
        // this.setState({ datarecieve: this.props.data })
        // console.log('did mount in view info', this.props.data)
    }
    async componentWillReceiveProps(nextProps) {
        let SRTYPE = nextProps.isSIP == true ? 'SP':'NN';
        console.log('nextProp:::',nextProps)
        let CODEID = nextProps.data.dataGet.CODEID;
        this.getBankInfo(SRTYPE,CODEID)
        await this.setState({ datarecieve: nextProps.data })
    }
    getBankInfo(srtype,codeid) {        
        //lay ds careby
        let self = this;
        RestfulUtils.post("/fund/getbankinfo", {
          language: this.props.language,
          srtype :srtype,
          codeid: codeid,
          OBJNAME : this.props.OBJNAME
        }).then((res) => {
        //   self.state.bankinfo = res.data
          self.setState({
            bankinfo : res.DT.data[0].BRANCH
          })
      
      })
      }
    close = (e) => {
        var { dispatch } = this.props;
        dispatch(closeModalViewInfo());
    }
    // hàm xóa dấu
    xoa_dau(str) {
        str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace("Đ", "D")
        return str.toUpperCase();
    }
    render() {
        let checkShowWhenSIP = this.props.isSIP ? this.props.isSIP : false
        let data = this.state.datarecieve
        let valueidcode = data.AccountInfo ? this.xoa_dau(data.AccountInfo.FULLNAME) : ''
        //console.log('data cuoiii', data)
        //console.log('===============================', this.props.language)
        return (
            <div className="popup-form">
                <Modal show={this.props.showModal} >
                    <Modal.Header>
                        <Modal.Title><div className="title-content col-md-6">{this.props.strings.title} <button type="button" className="close" onClick={this.close}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                        <div style={{ fontSize: '14px' }} className='row'>
                            <div className="col-md-10 col-md-push-1">
                                <p>{this.props.strings.cap1} <b className="highlight">{data.dataGet ? data.dataGet.CLSORDTIME : ''} {this.props.strings.cap2} - {data.dataGet ? data.dataGet.CLOSEDATE : ''} </b> {this.props.strings.cap3} </p>
                                <table className='table table-notification'>
                                    <tbody>

                                        <tr>
                                            <td><b>{this.props.strings.BANKNAME}:</b></td>
                                            {this.props.language == "vie" ?
                                                <td>{data.dataGet ? data.dataGet.BANKNAME : ''}</td>
                                                :
                                                <td>{data.dataGet ? data.dataGet.BANKNAME_EN : ''}</td>
                                            }
                                        </tr>
                                        <tr>
                                            <td><b>{this.props.strings.BRANCH}:</b></td>
                                            <td>{this.state.bankinfo}</td>
                                        </tr>
                                        <tr>
                                            <td><b>{this.props.strings.BANKACC}:</b></td>
                                            <td>{data.dataGet ? data.dataGet.BANKACC : ''}</td>
                                        </tr>
                                        <tr>
                                            <td><b>{this.props.strings.BANKACNAME}:</b></td>
                                            {this.props.language == "vie" ?
                                                <td>{data.dataGet ? data.dataGet.BANKACNAME : ''}</td>
                                                :
                                                <td>{data.dataGet ? data.dataGet.BANKACNAME_EN : ''}</td>
                                            }
                                        </tr>
                                        {!checkShowWhenSIP && <tr>
                                            <td><b>{this.props.strings.AMOUNT}:</b></td>
                                            <td><NumberInput value={data ? data.AMOUNT : ''} displayType={'text'} thousandSeparator={true} /></td>
                                        </tr>}
                                        <tr>
                                            <td><b>{this.props.strings.INFO}:</b></td>
                                            {/* <td>{data.AccountInfo ? data.AccountInfo.CUSTODYCD : ''} - {valueidcode} - {data.dataGet ? data.dataGet.SYMBOL : ''} - {this.props.strings.AT} {data.dataGet ? data.dataGet.MBNAME : ''} </td> */}
                                            {!checkShowWhenSIP ? 
                                            <td>{data.AccountInfo ? data.AccountInfo.FULLNAME : ''}_{data.AccountInfo ? data.AccountInfo.CUSTODYCD : ''}_{this.props.strings.AT}_{data.dataGet ? data.dataGet.SYMBOL : ''} </td>:
                                            <td>{data.AccountInfo ? data.AccountInfo.FULLNAME : ''}_{data.AccountInfo ? data.AccountInfo.CUSTODYCD : ''}_{data.dataGet ? data.dataGet.VSDSPCODE : ''} </td>}
                                            {/* {data.dataGet ? data.dataGet.BANKACTYPE == "S" ? 
                                             <td>{data.AccountInfo ? data.AccountInfo.FULLNAME : ''} {data.AccountInfo ? data.AccountInfo.CUSTODYCD : ''} {data.dataGet ? data.dataGet.VSDSPCODE : ''}</td> :
                                             <td>{data.AccountInfo ? data.AccountInfo.FULLNAME : ''} {data.AccountInfo ? data.AccountInfo.CUSTODYCD : ''} {this.props.strings.AT} {data.dataGet ? data.dataGet.SYMBOL : ''} </td> : ""}  */}

                                            {/* <td>{data.AccountInfo ? data.AccountInfo.FULLNAME : ''} {data.AccountInfo ? data.AccountInfo.CUSTODYCD : ''} {this.props.strings.AT}{data.dataGet ? data.dataGet.BANKACTYPE == "S" ? ' SIP' : "" : ""} - {data.dataGet ? data.dataGet.SYMBOL : ''} </td> */}
                                            {/* <td>{data.AccountInfo ? data.AccountInfo.CUSTODYCD : ''} - {valueidcode}{data.dataGet ? data.dataGet.BANKACTYPE == "S" ? ' - SIP' : "" : ""} - {data.dataGet ? data.dataGet.SYMBOL : ''} {this.props.strings.AT} {data.dataGet ? data.dataGet.SHORTNAME : ''} </td> */}
                                            {/* <td>{data.AccountInfo ? data.AccountInfo.CUSTODYCD : ''} - {data.dataGet ? data.dataGet.VSDSPCODE : ''} - {valueidcode}</td> */}
                                        </tr>
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </Modal.Body>

                </Modal>
            </div>
        )
    }
}

const stateToProps = state => ({
    language: state.language.language,
    showModal: state.datLenh.showModalViewInfo,
    tradingdate: state.systemdate.tradingdate
});
const decorators = flow([
    connect(stateToProps),
    translate('PopupViewInfo')
]);
module.exports = decorators(PopupViewInfo);

