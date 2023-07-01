
import { toast } from 'react-toastify'
import RestfulUtils from 'app/utils/RestfulUtils'
export const checkOTP = (data) => {
    let api = '/OTP/CheckOTP'
    let obj = {}
    obj = data
    return new Promise((resolve, reject) => {
        RestfulUtils.post(api, obj).then(function (res) {
            if (res.EC != 0) {
                toast.error(res.EM, {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
                //successOTP=>OTP dung hay khong 
                //errnum=> ma loi khi check otp tra ve
                //count => bien dem sai otp  doi voi man hinh confirm login
                return resolve({ successOTP: false, errnum: res.EC, count: res.count });
            } else {
                return resolve({ successOTP: true, errnum: res.EC });
            }
        })
    })

}
export const genOTP = (data, msgsuccess) => {
    let api = '/OTP/genOTP'
    let obj = {}
    obj = data
    RestfulUtils.post(api, obj).then(function (res) {
        if (res.EC != 0) {
            toast.error(res.EM, {
                position: toast.POSITION.BOTTOM_RIGHT
            });

        } else {
            if (obj.OBJNAME != 'TRANS') {
                toast.success(msgsuccess, {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            }
        }
    })
}

