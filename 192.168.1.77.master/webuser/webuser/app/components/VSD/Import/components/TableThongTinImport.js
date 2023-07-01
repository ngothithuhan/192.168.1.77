import React, { Component } from 'react';
import ReactTable from 'react-table';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import { requestData } from 'app/utils/ReactTableUlti';
import NumberFormat from 'react-number-format';
import { DefaultPagesize, getRowTextTable, getPageTextTable } from 'app/Helpers'
import { ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'
export default class TableThongTinImport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                rows: [],
                cols: [

                ],

            },
            columnNames: [],
            dataTable: [
            ],
            pagesize: DefaultPagesize,
            data: [],
            pages: null,
            loading: true,
            loaded: false,

            sorted1: [],
            filtered1: [],
            i: false
        };
        this.fetchData = this.fetchData.bind(this);
    }
    fetchData(state, instance) {
        let that = this

        requestData(
            state.pageSize,
            state.page,
            state.sorted,
            state.filtered,
            this.state.data,
        ).then(res => {
            this.state.dataTable = res.rows,
                this.state.pages = res.pages,
                // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
                this.setState(that.state);
        });
    }

    convetToListOject(dataTable) {
        var dataRow = [];
        for (var i = 1; i < dataTable.length; i++) {
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
    componentWillReceiveProps(nextProps) {

        if (nextProps.dataTable && nextProps.dataTable.length > 0 && nextProps.dataTable !== this.props.dataTable) {

            // let dataTable = this.convetToListOject(nextProps.dataTable)
            this.setState({ dataTable: nextProps.dataTable, columnNames: nextProps.columnNames, data: nextProps.dataTable })
        }
    }
    render() {
        let { rows, cols } = this.state.data;
        let { typeColumn } = this.props
        let { dataTable, columnNames, data, pagesize } = this.state
        let columns = []
        let length = data.length
        let ListColumnNames = {}
        console.log('render TableThongtinImport :::length:::', length);
        if (length > 0) {
            let widthDefault = 200;

            for (let i in columnNames) {
                if (columnNames[i].trim() == "ERRMSG") widthDefault = 400;
                // if (columnNames[i].trim() == "DES") widthDefault = 800;

                columns.push({
                    Header: props => <div className="wordwrap">{columnNames[i].trim()}</div>,
                    id: columnNames[i].trim(),
                    accessor: columnNames[i].trim(),
                    Cell: ({ value }) => (
                        <span className={typeColumn[columnNames[i].trim()] == "N" ? 'col-right' : 'col-left'} >
                            {typeColumn[columnNames[i].trim()] == "N" ? <NumberFormat value={parseFloat(value)} displayType={'text'} thousandSeparator={true} decimalScale={2} /> : value}
                        </span>
                    ),
                    minWidth: widthDefault,
                    Footer: typeColumn[columnNames[i].trim()] == "N" ? (
                        <span className='col-right' >

                            <NumberFormat value={_.sum(_.map(data, d => parseFloat(d[columnNames[i].trim()])))} displayType={'text'} thousandSeparator={true} decimalScale={2} style={{ color: 'red', fontWeight: 'bold' }} />

                        </span>
                    ) : '',
                })
                ListColumnNames[columnNames[i].trim()] = columnNames[i].trim()
            }
        }
        if (length > 0) {
            return (
                <div className="">
                    <div style={{ marginLeft: "-34px", marginBottom: "10px" }} className="col-md-12">
                        <ButtonExport style={{ marginLeft: "7px" }} HaveChk={false} dataRows={dataTable} colum={columns} data={this.props.datapage} dataHeader={ListColumnNames} />
                    </div>
                    <div className="col-md-12">
                        <ReactTable
                            columns={columns}
                            getTheadTrProps={() => {
                                return {
                                    className: 'head'
                                }
                            }}
                            filterable
                            data={dataTable}
                            // loadingText="Đang tải..."
                            ofText="/"
                            defaultPageSize={pagesize}
                            className="-striped -highlight"
                            // loading={this.state.loading} // Display the loading overlay when we need it
                            onFetchData={this.fetchData}
                            pageText={getPageTextTable(this.props.lang)}
                            rowsText={getRowTextTable(this.props.lang)}
                            manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                            previousText={<i className="fas fa-backward" id="previous"></i>}
                            nextText={<i className="fas fa-forward" id="next"></i>}
                            pages={this.state.pages}
                            style={{
                                maxHeight: "400px", // This will force the table body to overflow and scroll, since there is not enough room
                                minWidth: "1000px"
                            }}

                        />
                    </div>
                </div>
            )
        }
        else {
            return (<div style={{ textAlign: "center" }}>{this.props.strings.nodata}</div>)
        }

    }
};
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    styleWeb: state.styleWeb,
    auth: state.auth,
    lang: state.language.language
});
const decorators = flow([
    connect(stateToProps),
    translate('TableThongTinImport')
]);

module.exports = decorators(TableThongTinImport);