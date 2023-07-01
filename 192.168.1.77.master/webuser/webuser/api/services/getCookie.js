
module.exports = {
    getCookie: function getCookie(data, cname) {
        try {
            var name = cname + "=";
            // var decodedCookie = decodeURIComponent(document.cookie);
            var ca = data.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        } catch (ex) {
            sails.log.info('ex getcookie', ex);
            return "";
        }
    }
}
