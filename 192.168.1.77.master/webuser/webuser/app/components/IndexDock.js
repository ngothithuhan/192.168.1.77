import React from 'react';
import { connect } from 'react-redux';
import RestfulUtils from 'app/utils/RestfulUtils';
import { toast } from 'react-toastify';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
// const IndexItemList = ({ indexitemlist, ...props }) => (
//     <ul className="">
//         {indexitemlist.map(indexitem => (
//             <li key={indexitem.id} className="">
//                 <div className="">
//                     <h5>{indexitem.symbol}</h5><span>{indexitem.index}</span><span>{indexitem.pindex}</span>
//                 </div>
//             </li>
//         ))}
//     </ul>
// )

class IndexDock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            IndexList: [
                { id: '1', symbol: 'VFM1', index: '55533', pindex: '0.5' },
                { id: '2', symbol: 'VFM2', index: '55621', pindex: '0.6' },
                { id: '3', symbol: 'VFM3', index: '55722', pindex: '0.7' },
                { id: '4', symbol: 'VFM4', index: '55822', pindex: '0.2' },
                { id: '5', symbol: 'VFM5', index: '55611', pindex: '0.6' },
            ],
            data: [],
            data2: []
        }
    }
    componentWillMount() {
        let self = this
        let user = self.props.auth.user
        let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
        RestfulUtils.post('/nav/getlistnavprice', { language: this.props.language }).then((resData) => {
            //console.log('sync success aaaaa >>>',resData )
            if (resData.EC == 0) {
                //console.log('sync success >>>', resData)
                self.setState({ data: resData.data })
            } else {
                toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });
            }
        });
        if (isCustom) {
            //changeclassmargin()
            RestfulUtils.post('/account/getsalebycustodycd', { p_custodycd: user.USERID, language: this.props.language }).then((resData) => {
                //console.log('sync success aaaaa >>>',resData )
                if (resData.EC == 0) {
                    //console.log('sync success >>>', resData)
                    self.setState({ data2: resData.data })
                } else {
                    toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });
                }
            });
        }

    }
    formatNumber(nStr, decSeperate, groupSeperate) {
        nStr += '';
        let x = nStr.split(decSeperate);
        let x1 = x[0];
        let x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + groupSeperate + '$2');
        }
        return x1 + x2;
    }
    render() {
        const { user } = this.props.auth
        let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
        let databroker = this.state.data2.length > 0 ? this.state.data2[0] : {}
        return (
            // <div className="indexdock container col-md-12 mgt" style={{ top: "115px"}} >
            <div className="indexdock container col-md-12 mgt" id="indexdock_1" style={{ height: "90px" }}>
                {/* <IndexItemList indexitemlist={this.state.IndexList}   /> */}
                <div className="row text-center col-md-12 pdt-0 pdbt-0">
                    {this.state.data.map((indexitem, i) => ( //i la chi so
                        (i < 3) && <div key={'IndexDock' + i} style={{}} className="col-md-4 col-xs-12 col-sm-4 pdt-0 pdbt-0">
                            <p style={{ fontSize: '10px' }} className="">
                                <span style={{ color: 'red' }}>{indexitem.SYMBOL}</span><span style={{ color: 'black' }}> {this.formatNumber(indexitem.NAV == parseInt(indexitem.NAV) ? parseInt(indexitem.NAV) : indexitem.NAV, '.', ',')}</span>
                                <span>({this.formatNumber(indexitem.NAV_PERCENT == parseInt(indexitem.NAV_PERCENT) ? parseInt(indexitem.NAV_PERCENT) : indexitem.NAV_PERCENT, '.', ',')}%)</span>
                                {indexitem.NAV_NUMBER < 0 ? <span style={{ marginLeft: '-3px', fontSize: '12px', color: indexitem.NAV_NUMBER > 0 ? 'rgb(61, 206, 75)' : indexitem.NAV_NUMBER == 0 ? 'orange' : 'red' }} className="glyphicon glyphicon-arrow-down"></span> : indexitem.NAV_NUMBER > 0 ? <span style={{ marginLeft: '-5px', fontSize: '12px', color: indexitem.NAV_NUMBER > 0 ? 'rgb(61, 206, 75)' : indexitem.NAV_NUMBER == 0 ? 'orange' : 'red' }} className="glyphicon glyphicon-arrow-up"></span> : <span style={{ marginLeft: '-3px', fontSize: '12px', color: indexitem.NAV_NUMBER > 0 ? 'rgb(61, 206, 75)' : indexitem.NAV_NUMBER == 0 ? 'orange' : 'red' }} className="glyphicon glyphicon-play"></span>}
                            </p>
                        </div>
                    ))}
                    {/* <div className="col-md-12 noteNAV"> */}
                </div>
                <div className="row text-center col-md-12 top_18 fontS-11 pdt-0 pdbt-0" >
                    <div className="col-md-4 pdt-0 pdbt-0" style={{}} >
                        <b><p style={{ right: 0 }}>{this.props.strings.noteNAV}</p></b>
                    </div>
                </div>
                {isCustom && <div className="row text-left col-md-12 top_18 fontS-11 pdt-0 pdbt-0" >
                    <div className="col-md-3 pdt-0 pdbt-0" style={{ marginLeft: "55px", fontSize: "13px" }}>
                        <p style={{ right: 0 }}><b>{this.props.strings.FULLNAME} : {databroker.TLFULLNAME}</b></p>
                    </div>

                    <div className="col-md-3 text-left pdt-0 pdbt-0" style={{ fontSize: "13px" }}>
                        <p style={{ right: 0 }}><b>{this.props.strings.MOBILE} : {databroker.MOBILE}</b></p>
                    </div>

                </div>}

            </div>
        )
    }
}
const stateToProps = state => ({
    language: state.language.language,
    auth: state.auth,

});
const decorators = flow([
    connect(stateToProps),
    translate('IndexDock')
]);
module.exports = decorators(IndexDock);
