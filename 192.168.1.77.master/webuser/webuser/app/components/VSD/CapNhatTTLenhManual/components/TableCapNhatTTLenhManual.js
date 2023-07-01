import React, { Component } from 'react';
import ReactTable from "react-table";
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import {connect} from 'react-redux'
import axios from 'axios'
import RestfulUtils from "app/utils/RestfulUtils";

class TableCapNhatTTLenhManual extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data1: [
                 {
                     id: "1", CUSTODYCD: "1353041132003CN", CUSTID: "091C123456", FULLNAME: "Nguyễn Văn A", IDCODE: "123456789", IDPLACE: "Hà Nội", IDDATE: "18/12/2013", ADDRESS: "Hà Nội", CUSTTYPE: "Cá nhân", IDDATE: "18/12/2017", STATUS: "Chờ duyệt"
             },
                // {
                //     id: "2", CUSTODYCD: "1353041132004CN", CUSTID: "091C123456", FULLNAME: "Nguyễn Văn A", IDCODE: "123456789", IDPLACE: "Hà Nội", IDDATE: "18/12/2013", ADDRESS: "Hà Nội", CUSTTYPE: "Cá nhân", IDDATE: "18/12/2017", STATUS: "Chờ duyệt"
                // },
                // {
                //     id: "3", CUSTODYCD: "1353041132005CN", CUSTID: "091C123456", FULLNAME: "Nguyễn Văn A", IDCODE: "123456789", IDPLACE: "Hà Nội", IDDATE: "18/12/2013", ADDRESS: "Hà Nội", CUSTTYPE: "Cá nhân", IDDATE: "18/12/2017", STATUS: "Chờ duyệt"
                // },
                // {
                //     id: "4", CUSTODYCD: "1353041132005CN", CUSTID: "091C123456", FULLNAME: "Nguyễn Văn A", IDCODE: "123456789", IDPLACE: "Hà Nội", IDDATE: "18/12/2013", ADDRESS: "Hà Nội", CUSTTYPE: "Cá nhân", IDDATE: "18/12/2017", STATUS: "Chờ duyệt"
                // },
                // {
                //     id: "5", CUSTODYCD: "1353041132005CN", CUSTID: "091C123456", FULLNAME: "Nguyễn Văn A", IDCODE: "123456789", IDPLACE: "Hà Nội", IDDATE: "18/12/2013", ADDRESS: "Hà Nội", CUSTTYPE: "Cá nhân", IDDATE: "18/12/2017", STATUS: "Chờ duyệt"
                // },
                // {
                //     id: "6", CUSTODYCD: "1353041132005CN", CUSTID: "091C123456", FULLNAME: "Nguyễn Văn A", IDCODE: "123456789", IDPLACE: "Hà Nội", IDDATE: "18/12/2013", ADDRESS: "Hà Nội", CUSTTYPE: "Cá nhân", IDDATE: "18/12/2017", STATUS: "Chờ duyệt"
                // }

            ],
            pages: null,
            loading: true,
            checkedAll: false,
            checkboxChecked: false,
            selectedRows: new Set(),
            unSelectedRows: [],
            showModalAccess: false,
            showModalReview: false,
            CUSTID_DETAIL: '',
            pagesize:20,
            keySearch:{},
            sortSearch:{},
            page:1
        }
        // this.fetchData = this.fetchData.bind(this);
    }
    componentDidMount() {
        this.refresh()
    }
    handleAdd(data) {
       // console.log(' handleAdd(data)')
     //   console.log(data)
        var that = this;
        that.props.showModalDetail("add",data);
    }
    handlEdit(CUSTID) {
        var that = this;
        that.props.showModalDetail("update", CUSTID);
    }
    handleChangeALL(evt) {
        var that = this;
        this.setState({ checkedAll: evt.target.checked });
        if (evt.target.checked) {
            that.state.data.map(function (item) {
                if (!that.state.selectedRows.has(item.CUSTID)) {
                    that.state.unSelectedRows.push(item.CUSTID);
                    that.state.selectedRows.add(item.CUSTID);
                }
            })
            that.setState({ selectedRows: that.state.selectedRows, unSelectedRows: that.state.unSelectedRows })
        }
        else {
            that.state.unSelectedRows.map(function (item) {
                that.state.selectedRows.delete(item);
            })
            that.setState({ selectedRows: that.state.selectedRows, unSelectedRows: [] })
        }

    }
    onClick(type) {
        let self = this;
        switch (type) {
            case "create": {

                self.handleAdd();
            }
            case "edit": {
            }
        }
    }
    handleChange(row) {

        if (!this.state.selectedRows.has(row.original.CUSTID))
            this.state.selectedRows.add(row.original.CUSTID);
        else {
            this.state.selectedRows.delete(row.original.CUSTID);
        }
        this.setState({ selectedRows: this.state.selectedRows });
    }
    onRowClick(state, rowInfo, column, instance) {
        var that = this;
        return {
            onDoubleClick: e => {
                // console.log('A Td Element was clicked!')
                // console.log('it produced this event:', e)
                // console.log('It was in this column:', column)
                // console.log('It was in this row:', rowInfo)
                // console.log('It was in this table instance:', instance)
                that.props.showModalDetail("view", rowInfo.original.CUSTID)
            },
            style: {
                background: rowInfo==undefined?'': that.state.selectedRows.has(rowInfo.original.CUSTID)?'#dbe1ec':'',
                color:rowInfo==undefined?'': that.state.selectedRows.has(rowInfo.original.CUSTID)?'black':'',
            }
            // onClick: (e, handleOriginal) => {
            //     console.log('A Td Element was clicked!')
            //     console.log('it produced this event:', e)
            //     console.log('It was in this column:', column)
            //     console.log('It was in this row:', rowInfo)
            //     console.log('It was in this table instance:', instance)

            //     // IMPORTANT! React-Table uses onClick internally to trigger
            //     // events like expanding SubComponents and pivots.
            //     // By default a custom 'onClick' handler will override this functionality.
            //     // If you want to fire the original onClick handler, call the
            //     // 'handleOriginal' function.
            //     if (handleOriginal) {
            //       handleOriginal()
            //     }
            //   }
        }
    }
    fetchData(state, instance) {
        // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
        // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
        var that = this;
        // this.setState({ loading: true });

        // console.log('filer',state.filtered);
        // console.log('sort',state.sorted);
        // Request the data however you want.  Here, we'll use our mocked service we created earlier
        if(this.state.loading){
            let {pageSize,page,filtered,sorted} = state;
            this.loadData(pageSize,page+1,filtered,sorted);
        }
        this.setState({loading:true})
    }
    refresh = () =>{
        /*
        let self = this

             RestfulUtils.post('/account/refresh', {pagesize:this.state.pagesize}).then((resData) => {
                    if (resData.EC == 0) {
                        console.log('sync success',resData)


                         self.setState({ data: resData.DT.data,pages :resData.DT.numOfPages })
                    } else {

                        toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });

                    }
                });
*/
    }
    async loadData(pagesize,page,keySearch,sortSearch){

        let that = this ;
        let data1={
            language:this.props.lang
        }
       await RestfulUtils.post('/fund/getlistblockafmast', {pagesize, page, keySearch, sortSearch,data1}).then((resData) => {

        if (resData.status == "200") {
             
            // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
            if (resData.data.EC == 0) 

                    that.setState({
                        data: resData.data.DT.data,
                        pages: resData.data.DT.numOfPages,
                        keySearch,
                        page,
                        pagesize,
                        sortSearch
                    });
                else{

                }

            }
        });

    }
    refreshData = async ( ) =>{
        let  result = await this.refresh();
        let {pagesize,page,keySearch,sortSearch} = this.state
         this.loadData(pagesize,page,keySearch,sortSearch);

    }
    approve = () => {
        var {dispatch} = this.props;
        var datanotify={
            type:"",
            header:"Duyệt",
            content:""
        }
        this.state.selectedRows.forEach((key, value, set) => {
            new Promise((resolve, reject) => {
                let data = this.state.data.filter(e => e.CUSTID === value);
                let success = null;
                resolve(RestfulUtils.post('/account/approve', data[0])
                    .then(res => {
                        success = (res.data.EC == 0);
                        success ? toast.success("Duyệt tài khoản " + value + " thành công !", { position: toast.POSITION.BOTTOM_RIGHT })
                        :toast.error("Duyệt tài khoản " + value + " không thành công!. "+res.data.EM, { position: toast.POSITION.BOTTOM_RIGHT })
                        return res.data
                    })
                );
            })
        })

    }
    reject = () => {
        var {dispatch} = this.props;
        var datanotify={
            type:"",
            header:"Từ chối",
            content:""
        }
        this.state.selectedRows.forEach((key, value, set) => {
            new Promise((resolve, reject) => {
                let data = this.state.data.filter(e => e.CUSTID === value);
                let success = null;
                resolve(RestfulUtils.post('/account/reject', data[0])
                    .then(res => {
                        success = (res.data.EC == 0);
                        success ? toast.success("Từ chối tài khoản " + value + " thành công !", { position: toast.POSITION.BOTTOM_RIGHT })
                        :toast.error("Từ chối tài khoản " + value + " không thành công !. "+res.data.EM, { position: toast.POSITION.BOTTOM_RIGHT })
                        return res.data
                    })
                );
            })
        })
    }
    delete = () => {
        var {dispatch} = this.props;
        var datanotify={
            type:"",
            header:"Huỷ",
            content:""
        }
        this.state.selectedRows.forEach((key, value, set) => {
            new Promise((resolve, reject) => {
                let data = this.state.data.filter(e => e.CUSTID === value);
                let success = null;
                resolve(RestfulUtils.post('/account/cancel', data[0])
                .then(res => {
                    success = (res.data.EC == 0);
                    success ? toast.success("Huỷ tài khoản " + value + " thành công !", { position: toast.POSITION.BOTTOM_RIGHT })
                    :toast.error("Huỷ tài khoản " + value + " không thành công!. "+res.data.EM, { position: toast.POSITION.BOTTOM_RIGHT })
                    return res.data
                })
            );
            })
        })
    }
    closeModal = (stateModal) => {
        this.setState({showModalReview: stateModal})
    }
    render() {
        const { data, pages, loading } = this.state;
        var that = this;
        return (
            <div>
                <div style={{ marginLeft: "-32px" }} className="col-md-12 ">
                    <div className="">
                    {/* <ButtonSytem onClick={this.onClick.bind(this)} listbusiness={this.props.listbusiness} /> */}
                        {/* <button style={{ marginLeft: "5px" }} className="btn btn-primary" onClick={that.handleAdd.bind(that)}><span className="glyphicon glyphicon-plus-sign"></span> Tạo mới</button>

                        <button style={{ marginLeft: "5px" }} className="btn btn-primary" onClick={this.approve}><span className="glyphicon glyphicon-ok"></span> Duyệt</button>
                        <button style={{ marginLeft: "5px" }} className="btn btn-default" onClick={this.reject}><span className="glyphicon glyphicon-minus"></span> Từ chối</button>

                     <button style={{ marginLeft: "5px" }} className="btn btn-danger" onClick={this.delete}><span className="glyphicon glyphicon-remove"></span> Hủy</button>  */}
  {/*
                    <ButtonAdd style={{marginLeft:"5px"}} data={this.props.datapage}  onClick={this.handleAdd.bind(this)} />
                    <ButtonApprove style={{marginLeft:"5px"}} onClick={this.approve} data={this.props.datapage} />
                    <ButtonReject onClick={this.reject} style={{marginLeft:"5px"}} data={this.props.datapage} />
                    <ButtonDelete style={{marginLeft:"5px"}}  onClick={this.delete} data={this.props.datapage} />

*/}
                     {/* <button style={{ marginLeft: "5px",float:"right" }} className="btn btn-default" onClick={this.refreshData}><span className="glyphicon glyphicon-refresh"></span> Làm mới</button> */}

                    </div>

                </div>

                <div className="col-md-12" >
                    <ReactTable
                        columns={[
                            {
                                Header: props => <div className=" header-react-table">  </div>,
                                maxWidth: 90,
                                sortable: false,
                                style: { textAlign: 'center' },
                                Cell: (row) => (
                                    <div>
                                        <button type="button" className="btn btn-primary" onClick={this.handleAdd.bind(this,row.original)}>  <a  style={{color:"#ffffff"}}>{this.props.strings.submit}</a></button>
                                         {/*<span onClick={that.handlEdit.bind(that, row.original.CUSTID)} className="btn btn-primary"></span>*/}
                                    </div>
                                ),
                                Filter: ({ filter, onChange }) =>
                                    null
                            },
                            {
                                Header: props => <div className="">{this.props.strings.orderid}</div>,
                                id: "CUSTODYCD",
                                accessor: "CUSTODYCD",
                                width: 130,
                                Cell : ({value}) =>(
                                    <div className="col-left" style={{float:"left"}}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.vfmcode}</div>,
                                id: "FULLNAME",
                                accessor: "FULLNAME",
                                width: 310,
                                Cell : ({value}) =>(
                                    <div className="col-left" style={{float:"left"}}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.custodycd}</div>,
                                id: "IDCODE",
                                accessor: "IDCODE",
                                width: 130,
                                Cell : ({value}) =>(
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.ordertype}</div>,
                                id: "IDDATE",
                                accessor: "IDDATE",
                                width: 110,
                                Cell : ({value}) =>(
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.amount}</div>,
                                id: "IDPLACE",
                                accessor: "IDPLACE",
                                width: 310,
                                Cell : ({value}) =>(
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.status}</div>,
                                id: "FULLNAME",
                                accessor: "FULLNAME",
                                width: 310,
                                Cell : ({value}) =>(
                                    <div className="col-left" style={{float:"left"}}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.user}</div>,
                                id: "IDCODE",
                                accessor: "IDCODE",
                                width: 130,
                                Cell : ({value}) =>(
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.time}</div>,
                                id: "IDDATE",
                                accessor: "IDDATE",
                                width: 110,
                                Cell : ({value}) =>(
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.orderidvsd}</div>,
                                id: "IDPLACE",
                                accessor: "IDPLACE",
                                width: 310,
                                Cell : ({value}) =>(
                                    <div className="col-left">{value}</div>
                                )
                            },





                        ]}
                        getTheadTrProps={() => {
                            return {
                                className: 'head'
                            }
                        }}
                        // getTrProps={(state, rowInfo, column, instance) => {
                        //     console.log('rowInfo',rowInfo)
                        //     return {
                        //         onClick: (e, t) => {
                        //             t.srcElement.classList.add('active')
                        //         },
                        //         style: {
                        //             background: rowInfo.row.selected ? 'green' : 'red',
                        //             color:'green'
                        //         }
                        //     }
                        // }}
                        manual
                        filterable
                        pages={pages} // Display the total number of pages
                        // loading={loading} // Display the loading overlay when we need it
                        onFetchData={this.fetchData.bind(this)}
                        data={this.state.data1}
                        style={{
                            maxHeight: "600px" // This will force the table body to overflow and scroll, since there is not enough room
                          }}
                        noDataText={this.props.strings.textNodata}
                        pageText={this.props.strings.pageText}
                        rowsText={this.props.strings.rowsText}
                        previousText={<i className="fas fa-backward"></i>}
                        nextText={<i className="fas fa-forward"></i>}
                        loadingText="Đang tải..."
                        ofText="/"
                        getTrProps={this.onRowClick.bind(this)}
                        defaultPageSize={this.state.pagesize}
                        className="-striped -highlight"
                    />
                </div>
            </div>
        );
    }
}

TableCapNhatTTLenhManual.defaultProps = {

    strings: {
      tkgd:'Số TKGD',
      fullname:'Họ tên',
      ĐKSH:'Số ĐKSH',
      iddate:'Ngày cấp',
      idplace:'Nơi cấp',
      pageText:'Trang',


      rowsText:'bản ghi',
      textNodata:'Không có kết quả',
      vsdstatus:'Trạng thái VSD',

    },


  };
  const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    lang:state.language.language
  });


  const decorators = flow([
    connect(stateToProps),
    translate('TableCapNhatTTLenhManual')
  ]);

  module.exports = decorators(TableCapNhatTTLenhManual);
