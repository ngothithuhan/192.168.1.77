import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { ArrSpecial } from 'app//Helpers';
import { connect } from 'react-redux'
import * as XLSX from 'xlsx';


function Workbook() {
    if (!(this instanceof Workbook))
        return new Workbook()

    this.SheetNames = []

    this.Sheets = {}
}

const download = (url, name) => {
    let a = document.createElement('a')
    a.href = url
    a.download = name
    document.body.appendChild(a);
    a.click()
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
    //   window.URL.revokeObjectURL(url)
}


function s2ab(s) {
    const buf = new ArrayBuffer(s.length)

    const view = new Uint8Array(buf)

    for (let i = 0; i !== s.length; ++i)
        view[i] = s.charCodeAt(i) & 0xFF

    return buf
}

class ButtonExport extends React.Component {
    createExport(colum, data) {

        const element = []
        let data1 = []
        let obj = {}
        if (this.props.HaveChk) {
            for (let index = 1; index < colum.length; index++) {

                element.push(colum[index]["id"])
            }
        } else {
            for (let index = 0; index < colum.length; index++) {
                element.push(colum[index]["id"])
            }
        }


        const arraydata = Object.keys(data[0])
        let notPresentInData = arraydata.filter(val => element.includes(val));
        let test = []

        //xoa nhung cot ko co tren luoi
        for (let index = 0; index < data.length; index++) {
            obj = {}
            for (let j = 0; j < notPresentInData.length; j++) {
                if (isNaN(data[index][notPresentInData[j]]) == false && data[index][notPresentInData[j]] != null && ArrSpecial.includes(notPresentInData[j]) == false && data[index][notPresentInData[j]] != '' && data[index][notPresentInData[j]].length != 0) {
                    obj[notPresentInData[j]] = parseFloat(data[index][notPresentInData[j]])
                } else obj[notPresentInData[j]] = data[index][notPresentInData[j]]
            }
            test.push(obj);
        }
        //build lai data theo thu tu tren luoi
        for (let index = 0; index < test.length; index++) {
            obj = {}
            for (let j = 0; j < element.length; j++) {

                obj[this.props.dataHeader[element[j]]] = test[index][element[j]]
                if (j == element.length - 1) data1.push(obj)
            }
        }


        return data1
    }
    onClick() {
        window.$("#loadingscreen").show()
        let data = this.props.isApproveImport ? this.props.dataRows : this.createExport(this.props.colum, this.props.dataRows)
        let filename = this.props.filename ? this.props.filename : "Export"
        if (this.props.isApproveImport) data.map(function (node, index) {
            delete node["TYPE"]
            Object.keys(node).map(function (node1, index) {

                if (isNaN(node[node1]) == false && node[node1] != null && ArrSpecial.includes(node1) == false && node[node1] != '') {

                    node[node1] = parseFloat(node[node1])
                }
            })

        })

        const wb = new Workbook()
        const ws = XLSX.utils.json_to_sheet(data)

        wb.SheetNames = [filename]
        // wb.Sheets[''] = ws
        wb.Sheets[filename] = ws;

        const wbout = XLSX.write(wb, { raw: true, header: 1, bookType: 'xlsx', bookSST: true, type: 'binary', Props: { Author: "Fss" } })


        let url = window.URL.createObjectURL(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }))

        download(url, filename + '.xlsx')
        window.$("#loadingscreen").hide()
    }


    render() {


        let IsAdd = 'Y'
        // if (this.props.data) {
        //     IsAdd = this.props.data.ISADD;
        // }

        let isCustomTitle = this.props.titleButton ? true : false;
        if (IsAdd == "Y") {
            return <button
                style={this.props.style}
                className="btn btndangeralt"
                disabled={this.props.disabled}
                onClick={this.onClick.bind(this)}
                id={this.props.id}>
                {
                    isCustomTitle ?
                        <React.Fragment>
                            {this.props.titleButton} <span className="fa fa-download" ></span>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <span className="fas fa-cloud-download-alt" ></span> {this.props.strings.export}
                        </React.Fragment>
                }
            </button>
        }
        else {
            return null
        }
    }

}
ButtonExport.defaultProps = {

    strings: {
        create: 'Thêm',
        edit: 'Sửa',
        delete: 'Hủy',
        approve: 'Duyệt',
        delay: 'Từ chối',
        //export:'Kết xuất'

    },
}
const stateToProps = state => ({

});


const decorators = flow([
    connect(stateToProps),
    translate('ButtonSystem')
]);

module.exports = decorators(ButtonExport);