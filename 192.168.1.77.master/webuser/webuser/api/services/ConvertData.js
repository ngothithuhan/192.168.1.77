
var lodash = require('lodash')

module.exports = {
    convert_to_Object: function convert_to_Object(ret) {
        // return new Promise((resolve,reject)=>{
        var arr = [];
        for (var data of ret.rows) {
            var col = ret.col; var obj = {};
            for (var index in col) {
                obj[col[index]] = data[index];
            }
            arr.push(obj);
        }
        return arr;


    },
    convert_to_groupRow: async function (ret) {
        return new Promise((resolve) => {
            var arr = [];
            let CUSTODYCD = '';
            let rowParent = {};
            let count_row = 1;
            for (var data of ret.rows) {
                var col = ret.col; var obj = {};
                count++
                for (var index in col) {

                    rowParent[index] = data[col[index]]
                    if (index == "CUSTODYCD") {

                        if (CUSTODYCD != data[col[index]]) {
                            count = 1
                            CUSTODYCD = data[col[index]]
                        }
                        // else{

                        // }
                    }

                    obj[col[index]] = data[index];
                }
                if (count == 1)
                    arr.push(rowParent)
                arr.push(obj);
            }
            resolve(arr);


        })

    }
}