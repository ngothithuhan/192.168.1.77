import moment from 'moment'
function toNormalize(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace("Đ","D")
}
export const requestData = (pageSize, page, sorted, filtered, rawData) => {
    return new Promise((resolve, reject) => {

        // You can retrieve your data however you want, in this case, we will just use some local data.
        let filteredData = rawData;

        // You can use the filters in your request, but you are responsible for applying them.
        if (filtered.length) {
            filteredData = filtered.reduce((filteredSoFar, nextFilter) => {
                return filteredSoFar.filter(row => {
                    if (row[nextFilter.id] != null)
                        //return (toNormalize(row[nextFilter.id].toString().toUpperCase()) + "").includes(toNormalize(nextFilter.value.toUpperCase()));
                        return (row[nextFilter.id].toString() + "").includes(nextFilter.value);
                });
            }, filteredData);
        }


        if (sorted.length) {
            for (let i = 0; i < sorted.length; i++) {
                let filteredDatanull = filteredData.filter(nodes => nodes[sorted[i].id] != null)
                if (filteredDatanull.length != 0) {
                    let filteredDatanotnull = filteredDatanull[0][sorted[i].id]
                    if (moment(filteredDatanotnull, "DD/MM/YYYY", true).isValid() == true) {
                        filteredData = _.sortBy(filteredData, function (dateObj) {
                            return new moment(dateObj[sorted[i].id], "DD/MM/YYYY") || '';
                        });
                        filteredData = sorted[i].desc == false ? filteredData : filteredData.reverse()
                    } else if (isNaN(filteredDatanotnull) == false) {
                        filteredData = _.sortBy(filteredData, function (num) {
                            return parseFloat(num[sorted[i].id]) || '';

                        })
                        filteredData = sorted[i].desc == false ? filteredData : filteredData.reverse()

                    } else {
                        filteredData = _.sortBy(filteredData, function (str) {
                            return str[sorted[i].id] || '';
                        })
                        filteredData = sorted[i].desc == false ? filteredData : filteredData.reverse()
                    }
                }
            }
        }

        const sortedData = filteredData
        // You must return an object containing the rows of the current page, and optionally the total pages number.
        const res = {
            rows: sortedData.slice(pageSize * page, pageSize * page + pageSize),
            pages: Math.ceil(filteredData.length / pageSize),
            filteredData: sortedData,
        };

        // Here we'll simulate a server response with 500ms of delay.
        setTimeout(() => resolve(res), 500);
    });
};



