var _ = require('lodash');
var moment = require('moment');
function toNormalize(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace("Đ", "D")
}
module.exports = {

    paginate: function (array, page_size, page_number) {
        --page_number; // because pages logically start with 1, but technically with 0
        return array.slice(page_number * page_size, (page_number + 1) * page_size);
    },
    findArrVal: function (arr, id, filterval, isNotIn) {
        return _.filter(arr, item => {
            let itemval = item[id]
            if(isNotIn) return !(filterval.indexOf(itemval) > -1);
            return filterval.indexOf(itemval) > -1;
        })
    },
    findNormal: function (arr, filter) {
        return _.filter(arr, filter)
    },
    find: function (arr, filter) {
        // return arr.filter(function (item) {
        //     var rs = true
        //     for (let i = 0; i < filter.length; i++) {
        //         const element = filter[i];
        //         let itemval = item[element.id] ? item[element.id].toString().toUpperCase() : '';
        //         let elementval = element.value ? element.value.toString().toUpperCase() : '';
        //         if (itemval.indexOf(elementval) < 0) {
        //             rs = false;
        //             break;
        //         }
        //     }
        //     return rs;
        // });
        //filter = filter.map(item => { return { ...item, value: toNormalize(item.value ? item.value.toString().toUpperCase() : '') } })
        return _.filter(arr, item => {
            var rs = true
            for (let i = 0; i < filter.length; i++) {
                const element = filter[i];
                // let itemval = toNormalize(item[element.id] ? item[element.id].toString().toUpperCase() : '');
                // let elementval = toNormalize(element.value ? element.value.toString().toUpperCase() : '');
                // let itemval = '';
                // let elementval = element.value;
                // if (item.hasOwnProperty(element.id + '_NL'))
                //     itemval = item[element.id + '_NL'] ? item[element.id + '_NL'] : '';
                // else
                //     itemval = item[element.id] ? item[element.id] : '';
                let itemval = item[element.id] ? item[element.id].toString() : '';
                let elementval = element.value ? element.value.toString() : '';
                //truong hop filter <> thi negative =true
                let negative = false;
                if (!(elementval.indexOf('~!~') < 0)) {
                    negative = true;
                    elementval = elementval.replace('~!~', '')
                }
                if (!negative) {
                    if (itemval.indexOf(elementval) < 0) {
                        rs = false;
                        break;
                    }
                }
                else
                    if (!(itemval.indexOf(elementval) < 0)) {
                        rs = false;
                        break;
                    }
            }
            return rs;
        })
    },
    orderby: function (filteredData, sorted) {
        try {
            filteredData = _.orderBy(
                filteredData,
                sorted.map(sort => {
                    return row => {
                        if (row[sort.id] === null || row[sort.id] === undefined) {
                            return -Infinity;
                        }
                        if (moment(row[sort.id], "DD/MM/YYYY", true).isValid())
                            return new moment(row[sort.id], "DD/MM/YYYY") || '';
                        else if (!isNaN(row[sort.id]))
                            return parseFloat(row[sort.id]) || '';
                        else
                            return row[sort.id] || '';
                    };
                }),
                sorted.map(d => (d.desc ? "desc" : "asc"))
            )
        } catch (error) {

        }
        return filteredData;
    },
    generate_keySearch: function (data) {
        var sortSearch = data.sortSearch;
        var dataSort = '';
        //generate chuoi sort
        if (sortSearch != undefined && sortSearch.length > 0) {

            if (sortSearch[0].desc === false) {
                dataSort = sortSearch[0].id + " DESC";
            }
            else {
                dataSort = sortSearch[0].id + " ASC";
            }

        }


        var dataSearch = data.keySearch;

        var likeSearch = {};
        //generate ra chuoi like search
        if (dataSearch != undefined && dataSearch.length > 0) {
            dataSearch.forEach(function (item) {

                likeSearch[item.id] = '%' + item.value + '%';
            })
        }

        if (dataSort === '') {
            return keySearch = { where: { like: likeSearch } };
            // console.log('keysearch',keySearch);
        }
        else {
            console.log('dataSort', dataSort);
            return keySearch = { where: { like: likeSearch, sort: dataSort } };

        }


    },
    caculate_get: function () {

    }
}