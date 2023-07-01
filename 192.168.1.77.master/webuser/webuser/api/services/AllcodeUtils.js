module.exports = {
    get_desc_with_cdval: async function (CDVAL) {
        return new Promise(async (resolve, reject) => {

            let data = await Allcode.findOne({ CDVAL: CDVAL }).exec((err, allcode) => {
                if (err) {
                    reject('err')
                }
                if (allcode) {
                    console.log('content', allcode.CDCONTENT)
                    resolve(allcode.CDCONTENT)
                }


            })
        })

    },
    get_status: function (CDTYPE, CDNAME, CDVAL) {
        return new Promise((resolve, reject) => {

            Allcode.findOne({ CDID: CDTYPE + "." + CDNAME + "." + CDVAL }).exec((err, allcode) => {
                if (err)
                    reject('Error find ')

                if (allcode)
                    resolve(allcode.CDCONTENT)

                resolve('Not find')

            })
        })

    },
}