import React, { Component } from 'react';
import ReactTable from "react-table";
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import {connect} from 'react-redux'
import NumberFormat from 'react-number-format';
import NumberInput from 'app/utils/input/NumberInput'

class TableBacThang extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
              

            ],
            dataTest:[],
            pages: null,
            loading: true,
            checkedAll: false,
            checkboxChecked: false,
            selectedRows: new Set(),
            unSelectedRows: [],
       
            pagesize:4,
            keySearch:{},
            sortSearch:{},
            page:1,
            showModalDetailBT:false,
        }
        // this.fetchData = this.fetchData.bind(this);
    }
    componentWillMount() {
        var str=this.props.dataEDIT
        if(str!=""){
            var array = []
            var elementname=""
            var element={}
            var count = str.split("~$~").length - 1;
            console.log('count:',count)
            var index=0
            var day = "";
            for (var i = 0; i <= count; i++) {
                // day = str.substr(0, str.indexOf('~$~'));
                // str = str.replace(day + "~$~", "")
            
                for (var j = 0; j <= 2; j++) {
                    if(j==0) elementname='fromvalue'
                    else if(j==1) elementname='tovalue'
                    else elementname='fee'
                    if(j==2){
                        if(i==count){
                            console.log('1,i,j:',i , j)
                            day = str.substr(0, str.indexOf('~#~')); 
                            console.log('day:',day)
                            str = str.replace(day + "~#~", "")
                            console.log('str:',str)
                            element[elementname]=str
                        }else{
                            console.log('2,i,j:',i , j)
                            day = str.substr(0, str.indexOf('~$~'));
                            console.log('day:',day)
                            str = str.replace(day + "~$~", "")
                            console.log('str:',str)
                            element[elementname]=day
                        }
            
                    }else{
                        console.log('3,i,j:',i , j)
                        day = str.substr(0, str.indexOf('~#~')); 
                        console.log('day:',day)
                        str = str.replace(day + "~#~", "")
                        console.log('str:',str)
                        element[elementname]=day
                    }
                    
                
                }
                if(index==0) element.id=0
                else element.id=index
                array.push(element)
                element={}
                index+=1
            }
            this.props.loadagain(array)
            this.setState({
                dataTest:array
            })
        
        }
    }
    handleAdd(evt) {
        var that = this;
        that.props.showModalDetail("add");
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
                that.props.showModalDetail("view", rowInfo.original)
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
  
  
   
    add(){
        this.props.showModalDetail("add")
    }
    edit(id) {
        var that = this;
        that.props.showModalDetail("update", id);
    }
    deleteBT(data){
        let result=this.state.dataTest.filter(node => node.id != data);
      
        this.props.loadagain(result)
        this.setState({
            dataTest:result
        })
    
    }
    componentWillReceiveProps(nextProps){
        console.log('nextProps',nextProps)
        // if(nextProps.access=="add"){
        
        this.setState({
            dataTest:nextProps.dataBT,
            isTrailerfee:nextProps.isTrailerfee,
            
        })
        // }
    }
    genComboboxMonths() {
        return monthList = moment.months();
    }
    render() {
        var show = (this.props.isTrailerfee == '1' || this.props.isTrailerfee == '2') && this.props.feetype == '002' ? true : false;
        console.log('this.props.isTrailerfee:::',this.props.isTrailerfee,':::this.props.feetype:::',this.props.feetype);
        console.log('show:::',show);
        const { dataTest } = this.state;
        
        var that = this;
        return (
            <div>
                <div className="col-md-12" >
                <div className="container panel panel-success" style={{width: "94%",padding:40,float:"left",paddingTop:10,paddingBottom:10}}>
                    <ReactTable
                        columns={[
                            {
                                Header: props => <div className=" header-react-table">  <span  className="fas fa-plus-circle" style={{color:"#ed1c24"}} onClick={this.add.bind(this)}></span>
                                </div>,
                                maxWidth: 70,
                                sortable: false,
                                style: { textAlign: 'center' },
                                Cell: (row) => (
                                    <div>
                                        <span onClick={that.edit.bind(that, row.original)} className="glyphicon glyphicon-pencil" id={'pencilBT'+row.original.id}></span>
                                        <span  className="far fa-trash-alt"  style={{marginLeft:10}} onClick={this.deleteBT.bind(that, row.original.id)} id={'trash'+row.original.id}></span>

                                    </div>
                                ),
                                Filter: ({ filter, onChange }) =>
                                    null
                            },
                            {
                                Header: props => <div className="wordwrap">{show == true ? this.props.strings.frommonth : this.props.strings.fromvalue}</div>,
                                id: "fromvalue",
                                accessor: "fromvalue",
                                width: 130,
                                Cell : ({value}) =>(
                                    <NumberFormat id={"lbl" + value} className="col-right" value={value==0 ? 0 : value} displayType={'text'}  decimalScale={0} thousandSeparator={true}/>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{show == true ? this.props.strings.tomonth : this.props.strings.tovalue}</div>,
                                id: "tovalue",
                                accessor: "tovalue",
                                width: 130,
                                Cell : ({value}) =>(
                                    <NumberFormat id={"lbl" + value} className="col-right" value={value==0 ? 0 : value} displayType={'text'}  decimalScale={0} thousandSeparator={true}/>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.fee}</div>,
                                id: "fee",
                                accessor: "fee",
                                width: 110,
                                Cell : ({value}) =>(
                                    
                                    <NumberInput value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} className="col-right"/>
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
                        filterable={false}
                        
                      //  pages={pages} // Display the total number of pages
                        // loading={loading} // Display the loading overlay when we need it
                      //  onFetchData={this.fetchData.bind(this)}
                        data={dataTest}
                        style={{
                            maxHeight: "300px" // This will force the table body to overflow and scroll, since there is not enough room
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
                        showPagination={false}
                    />
                </div>
                </div>
            </div>
        );
    }
}

TableBacThang.defaultProps = {

    strings: {
      custid:'Mã ngân hàng',
      custiodycd:'Tên ngân hàng',
      fullname:'Giấy phép NHNN',
      iddate:'Ngày cấp',
      opendate:'Địa chỉ',
      idplace:'Fax',
      place:'Ghi chú',

    },


  };
  const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification
  });


  const decorators = flow([
    connect(stateToProps),
    translate('TableBacThang')
  ]);

  module.exports = decorators(TableBacThang);
