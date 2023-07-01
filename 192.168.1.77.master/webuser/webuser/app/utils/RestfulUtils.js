import axios from 'axios';
//import { resolve } from 'url';

const USESOCKET = false;
module.exports = {
    post: function (url, body) {
        body = body ? body : { _csrf: "" }
        return new Promise(async (resolve, reject) => {
            if (iscsrf) {
                await axios.get(urlcsrf).then(csrfv => {
                    if (csrfv && csrfv.data && csrfv.data._csrf != undefined) {
                        body._csrf = csrfv.data._csrf;
                    }
                });
            }
            if (USESOCKET) {
                io.socket.post(url, body, function (resData, jwres) {
                    if (jwres.statusCode == "200") {
                        resolve(resData);
                    } else {
                        resolve(null)
                    }
                });
            } else {
                axios.post(url, body).then((res) => {
                    resolve(res.data);
                }).catch((err) => {
                    resolve(null);
                });
            }
        });
    },
    posttrans: function (url, body) {
        body = body ? body : { _csrf: "" }
        window.$("#loadingscreen").show()
        return new Promise(async (resolve, reject) => {
            if (iscsrf) {
                await axios.get(urlcsrf).then(csrfv => {
                    if (csrfv && csrfv.data && csrfv.data._csrf != undefined) {
                        body._csrf = csrfv.data._csrf;
                    }
                });
            }
            if (USESOCKET) {
                io.socket.post(url, body, function (resData, jwres) {
                    if (jwres.statusCode == "200") {
                        window.$("#loadingscreen").hide()
                        resolve(resData);
                    } else {
                        window.$("#loadingscreen").hide()
                        resolve(null)
                    }
                });
            } else {
                axios.post(url, body).then((res) => {
                    window.$("#loadingscreen").hide()
                    resolve(res.data);
                }).catch((err) => {
                    window.$("#loadingscreen").hide()
                    resolve(null);
                });
            }
        });
    }
}