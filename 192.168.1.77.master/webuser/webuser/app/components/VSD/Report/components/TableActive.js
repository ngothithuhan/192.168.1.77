import React, { Component } from 'react';
import ReactTable from 'react-table';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
 class TablActive extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                rows: [],
                cols: [
                 
                ],
                
            },
            columnNames:[],
            dataTable:[
           
               
            ]
        }
    }
    convetToListOject(dataTable){
        var dataRow = [];
        for (var i=1;i< dataTable.length;i++) {
            var col = dataTable[0];
            var obj = {};
            for (var index in col) {
                obj[col[index]] = dataTable[i][index];
                if (!obj[col[index]]) {
                    obj[col[index]] = '';
                }
            }
            dataRow.push(obj);
        }
        return dataRow;
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.dataTable&&nextProps.dataTable.length>0){
            // let dataTable = this.convetToListOject(nextProps.dataTable)
             this.setState({dataTable:nextProps.dataTable,columnNames:nextProps.columnNames})
        }
        else{
            this.setState({dataTable:nextProps.dataTable,columnNames:[]})
        }
    }
    render() {
        let {rows, cols} = this.state.data;
        let {typeColumn}  = this.props
        let {dataTable,columnNames}  = this.state
        let columns = [];
        let length = dataTable.length
        if(dataTable.length>0){
            for(let i in columnNames){
                columns.push({
                    Header: props => <div>{this.props.strings[columnNames[i]]}</div>,
                    id: columnNames[i],
                    accessor: columnNames[i],
                    with:150,
                    Cell: ({ value }) => (
                        <span className='col-left' >
                            {value}
                        </span>
                    ),
                    with:180
                })
            }
        }

        console.log("columns...", columns);

        if(length>0){
            return (
                <ReactTable
                columns={columns}
                getTheadTrProps={() => {
                    return {
                        className: 'head'
                    }
                }}
                filterable
                data={dataTable}
                loadingText="Đang tải..."
                ofText="/"
                defaultPageSize={5}
                className="-striped -highlight"
            />
            )
        }
        else{
            return(<div className="col-md-12" style={{textAlign:"center"}}>
          {/* <div  className="alert alert-info">
              <strong>Thông báo</strong> trang không tồn tại
            </div> */}  

               <div className="noData-table"> Chưa có dữ liệu  </div>
            
            </div>)
        }
       
    }
};

TablActive.defaultProps = {

    strings: {
       

    },


};
const stateToProps = state => ({
    notification: state.notification,
    styleWeb: state.styleWeb

});


const decorators = flow([
    connect(stateToProps),
    translate('')
]);

module.exports = decorators(TablActive);