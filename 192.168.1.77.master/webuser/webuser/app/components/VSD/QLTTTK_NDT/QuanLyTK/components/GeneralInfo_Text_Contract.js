import React from 'react';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';

class GeneralInfo_Text_Contract extends React.Component {
    constructor() {
        super();
        this.state = {}
    }


    render() {
        let { language } = this.props;

        return (
            <React.Fragment>
                {language === 'vie' ?
                    <React.Fragment>
                        <div style={{ maxHeight: '250px', overflow: 'auto', background: '#F3F3F3', padding: '10px' }}>
                            <p align="center">
                                <strong>CÁC ĐIỀU KHOẢN VÀ ĐIỀU KIỆN</strong>
                            </p>
                            <p>
                                Điều 1. Định nghĩa thuật ngữ
                            </p>
                            <p>
                                1.1. “Bên” là Nhà Đầu Tư hoặc SSIAM tùy theo ngữ cảnh và “Các Bên” là chỉ
                                cả Nhà Đầu Tư và SSIAM.
                            </p>
                            <p>
                                1.2. “Chứng Từ Điện Tử” là các thông tin liên quan đến việc thực hiện các
                                yêu cầu giao dịch của Nhà Đầu Tư được tạo ra, gửi đi, nhận và lưu trữ khi
                                sử dụng Dịch Vụ Giao Dịch Trực Tuyến và/hoặc thực hiện Giao Dịch Trực
                                Tuyến.
                            </p>
                            <p>
                                1.3. “Dịch Vụ Giao Dịch Trực Tuyến” là các dịch vụ do SSIAM cung cấp cho
                                Nhà Đầu Tư tùy từng thời điểm để Nhà Đầu Tư thực hiện các Giao Dịch Trực
                                Tuyến.
                            </p>
                            <p>
                                1.4. “Giao Dịch Trực Tuyến” là các giao dịch của Nhà Đầu Tư đối với các Sản
                                Phẩm của SSIAM mà các giao dịch đó (i) được thực hiện phù hợp với các dịch
                                vụ mà SSIAM cung cấp tùy từng thời kỳ; và (ii) thông qua hệ thống công nghệ
                                thông tin và môi trường mạng internet, mạng viễn thông hoặc các mạng mở
                                khác.
                            </p>
                            <p>
                                1.5. “Hệ Thống” là hệ thống do SSIAM thiết lập để quản lý và thực hiện các
                                Giao Dịch Trực Tuyến bao gồm trang thiết bị phần cứng, phần mềm, cơ sở dữ
                                liệu, hệ thống mạng viễn thông, mạng internet, mạng máy tính.
                            </p>
                            <p>
                                1.6. “Hợp Đồng Của Sản Phẩm” là văn bản thỏa thuận giữa Nhà Đầu Tư và SSIAM
                                liên quan đến việc tạo lập, quản lý Sản Phẩm, bao gồm nhưng không hạn chế
                                Giấy Đăng Ký Mở Tài Khoản Giao Dịch Chứng Chỉ Quỹ Mở, các văn bản, hợp đồng
                                khác tùy theo từng Sản Phẩm.
                            </p>
                            <p>
                                1.7. “Mật Khẩu Đăng Nhập” là mật khẩu để xác định Nhà Đầu Tư khi truy cập
                                vào Hệ Thống.
                            </p>
                            <p>
                                1.8. “Mật Khẩu Giao Dịch” là mật khẩu được sử dụng để Nhà Đầu Tư xác nhận
                                trước khi thực hiện một Giao Dịch Trực Tuyến. Mật Khẩu Giao Dịch tồn tại
                                theo một trong hai hình thức theo lựa chọn của Nhà Đầu Tư:
                            </p>
                            <p>
                                (1) Mật khẩu sử dụng một lần (OTP: one-tsimswe-oprad): do Hệ Thống cung
                                cấp, chỉ có hiệu lực duy nhất đối với một giao dịch tại một thời điểm nhất
                                định của một Nhà Đầu Tư cụ thể, và sẽ tự động hủy trong một thời gian xác
                                định.
                            </p>
                            <p>
                                (2) Mật khẩu tĩnh (PIN): do Nhà Đầu Tư tự thiết lập và có hiệu lực cho tới
                                khi Nhà Đầu Tư thay đổi.
                            </p>
                            <p>
                                1.9. “Sản Phẩm” là các sản phẩm, dịch vụ do SSIAM cung cấp tùy từng thời
                                kỳ, được phép thực hiện giao dịch trực tuyến phù hợp với quy định của pháp
                                luật,
                            </p>
                            <p>
                                1.10. “Sự Kiện Bất Khả Kháng” có nghĩa là bất kỳ sự kiện nào sau đây, mà
                                làm cho bất kỳ Bên nào hoặc các Bên không thể thực hiện được nghĩa vụ của
                                mình theo các điều khoản này, như là sự ngăn cấm hay hành động của chính
                                phủ hoặc cơ quan nhà nước, bạo loạn, chiến tranh, chiến sự, bạo động, đình
                                công, tranh chấp lao động khác và các ngừng trệ công việc khác, các tiện
                                ích công cộng bị ngừng hoạt động hoặc bị cản trở, dịch bệnh, hỏa hoạn, lũ
                                lụt, động đất, sóng thần hoặc thiên tai khác, và các sự kiện khác vượt quá
                                tầm kiểm soát hợp lý của các Bên.
                            </p>
                            <br clear="all" />
                            <p>
                                Điều 2. Nội dung thỏa thuận
                            </p>
                            <p>
                                2.1. SSIAM đồng ý cung cấp và Nhà Đầu Tư đồng ý sử dụng Dịch Vụ Giao Dịch
                                Trực Tuyến. Dịch Vụ Giao Dịch Trực Tuyến trong giai đoạn đầu sẽ được thực
                                hiện qua môi trường mạng internet và có thể được sửa đổi, bổ sung từng thời
                                kỳ theo thông báo của SSIAM.
                            </p>
                            <p>
                                2.2. SSIAM sẽ quy định và/hoặc điều chỉnh nội dung cụ thể của Dịch Vụ Giao
                                Dịch Trực Tuyến mà SSIAM cho là hợp lý tùy từng thời điểm và công bố rộng
                                rãi các nội dung này trên website chính thức của SSIAM.
                            </p>
                            <p>
                                2.3. Sau khi ký tên vào bản đăng ký này, Nhà Đầu Tư được quyền sử dụng Dịch
                                Vụ Giao Dịch Trực Tuyến và mặc nhiên chấp nhận các điều khoản, điều kiện
                                ràng buộc được SSIAM quy định cho Dịch Vụ Giao Dịch Trực Tuyến ở từng thời
                                điểm.
</p>
                            <p>
                                2.4. Việc cung cấp Dịch Vụ Giao Dịch Trực Tuyến của SSIAM và việc sử dụng
                                Dịch Vụ Giao Dịch Trực Tuyến và/hoặc thực hiện Giao Dịch Trực Tuyến của Nhà
                                Đầu Tư được ràng buộc bởi các điều khoản của Giấy Đăng Ký Dịch Vụ Giao Dịch
                                Trực Tuyến, Hợp Đồng Của Sản Phẩm, các thỏa thuận, cam kết liên quan mà Nhà
                                Đầu Tư đã ký kết với SSIAM và/hoặc các điều kiện, cách thức, quy định giao
                                dịch cụ thể được SSIAM hướng dẫn, thông báo trực tiếp cho Nhà Đầu Tư hoặc
                                trên website của SSIAM.
</p>
                            <p>
                                Điều 3. Các rủi ro phát sinh từ Giao Dịch Trực Tuyến
</p>
                            <p>
                                Việc sử dụng Dịch Vụ Giao Dịch Trực Tuyến và/hoặc thực hiện Giao Dịch Trực
                                Tuyến luôn tồn tại những rủi ro tiềm tàng do lỗi của Hệ Thống hoặc của bất
                                kỳ bên thứ ba nào khác. Nhà Đầu Tư cam kết chấp nhận mọi rủi ro, mất mát
                                hoặc thiệt hại nào khác phát sinh khi sử dụng Dịch Vụ Giao Dịch Trực Tuyến
                                và/hoặc thực hiện Giao Dịch Trực Tuyến do lỗi Hệ Thống, lỗi của bất kỳ bên
                                thứ ba hoặc do các hành động, thao tác của Nhà Đầu Tư ảnh hưởng đến việc sử
                                dụng Dịch Vụ Giao Dịch Trực Tuyến và/hoặc thực hiện Giao Dịch Trực Tuyến.
</p>
                            <p>
                                Điều 4. Thời gian cung cấp dịch vụ
</p>
                            <p>
                                4.1. SSIAM sẽ cung cấp Dịch Vụ Giao Dịch Trực Tuyến liên tục.
</p>
                            <p>
                                4.2. Thời gian ngưng cung cấp Dịch Vụ Giao Dịch Trực Tuyến do sửa chữa, bảo
                                trì, bảo dưỡng, nâng cấp Hệ Thống hoặc theo yêu cầu của cơ quan nhà nước có
                                thẩm quyền sẽ được SSIAM thông báo trước trên website của SSIAM.
</p>
                            <p>
                                Điều 5. Chi phí
</p>
                            <p>
                                5.1. Khi sử dụng Dịch Vụ Giao Dịch Trực Tuyến và hoặc thực hiện Giao Dịch
                                Trực Tuyến, Nhà Đầu Tư hiểu và đồng ý rằng SSIAM có thể ấn định một hoặc
                                nhiều khoản phí sử dụng dịch vụ (“Phí Dịch Vụ”). Để tránh nhầm lẫn, Phí
                                Dịch Vụ này không phải là các khoản phí/giá dịch vụ áp dụng đối với Sản
                                Phẩm và/hoặc phí/giá dịch vụ cho các hình thức sử dụng dịch vụ khác mà Nhà
                                Đầu Tư đã đăng ký với SSIAM đã được quy định trong Hợp Đồng Của Sản Phẩm và
                                các văn bản liên quan khác, bao gồm nhưng không hạn chế giá dịch vụ phát
                                hành, mua lại chứng chỉ quỹ mà Nhà Đầu Tư có trách nhiệm thanh toán đối với
                                mỗi giao dịch chứng chỉ quỹ mở.
</p>
                            <p>
                                5.2. Phí Dịch Vụ sẽ được SSIAM thông báo cho Nhà Đầu Tư khi đăng ký sử dụng
                                Dịch Vụ Giao Dịch Trực Tuyến và/hoặc thực hiện Giao Dịch Trực Tuyến. SSIAM
                                bảo lưu quyền ấn định, thay đổi đối với Phí Dịch Vụ và phương thức thanh
                                toán Phí Dịch Vụ tùy từng thời điểm.
</p>
                            <p>
                                Điều 6. Bảo mật
</p>
                            <p>
                                6.1. Trách nhiệm của Nhà Đầu Tư
</p>
                            <p>
                                6.1.1. Bảo mật Mật Khẩu Đăng Nhập, Mật Khẩu Giao Dịch của mình và chịu mọi
                                thiệt hại, mất mát phát sinh do Mật Khẩu Đăng Nhập, Mật Khẩu Giao Dịch bị
                                tiết lộ dưới bất cứ hình thức nào.
</p>
                            <p>
                                6.1.2. Trường hợp Nhà Đầu Tư phát hiện các thông tin cần bảo mật nêu trên
                                có thể không còn thuộc sự kiểm soát của mình thì cần lập tức thông báo cho
                                SSIAM biết và thực hiện theo chỉ dẫn của SSIAM.
</p>
                            <p>
                                6.2. Trách nhiệm của SSIAM
</p>
                            <p>
                                6.2.1. Bảo mật và lưu giữ thông tin của Nhà Đầu Tư (tên đăng nhập/Mật Khẩu
                                Đăng Nhập, thông tin giao dịch, và tất cả các thông tin khác của Nhà Đầu
                                Tư) trừ trường hợp phải cung cấp các thông tin này cho các cơ quan có thẩm
                                quyền theo quy định của pháp luật.
</p>
                            <p>
                                6.2.2. Hỗ trợ Nhà Đầu Tư khôi phục thông tin đăng nhập khi Nhà Đầu Tư yêu
                                cầu.
</p>
                            <p>
                                Điều 7. Cam kết của Nhà Đầu Tư
</p>
                            <p>
                                7.1. Cam kết đã đọc kỹ, hiểu rõ và tuân thủ đúng những hướng dẫn sử dụng
                                Dịch Vụ Giao Dịch Trực Tuyến do SSIAM cung cấp trực tiếp cho Nhà Đầu Tư
                                hoặc công bố rộng rãi trên website của SSIAM (“Hướng Dẫn Công Khai”). SSIAM
                                không chịu trách nhiệm đối với những Giao Dịch Trực Tuyến không thực hiện
                                được với bất kỳ lý do gì hay bất cứ thiệt hại nào xảy ra khi Nhà Đầu Tư
                                không thực hiện đúng những Hướng Dẫn Công Khai.
</p>
                            <p>
                                7.2. Mật Khẩu Giao Dịch là chữ ký điện tử của Nhà Đầu Tư (“Chữ Ký Điện Tử”)
                                và các Chứng Từ Điện Tử được Nhà Đầu Tư khởi tạo và/hoặc xác nhận và gửi có
                                Chữ Ký Điện Tử của Nhà Đầu Tư có giá trị pháp lý như các yêu cầu của Nhà
                                Đầu Tư gửi trực tiếp và hợp lệ tại quầy giao dịch.
</p>
                            <p>
                                7.3. Đồng ý rằng bất cứ hành động truy cập/giao dịch nào vào/trên tài khoản
                                giao dịch của Nhà Đầu Tư bằng tên truy cập với đúng Mật Khẩu Đăng Nhập và
                                Mật Khẩu Giao Dịch đều được coi là Nhà Đầu Tư truy cập/giao dịch.
</p>
                            <p>
                                7.4. Cung cấp đầy đủ/đăng ký các thông tin liên quan đến Nhà Đầu Tư và kịp
                                thời thông báo cho SSIAM khi có sự thay đổi các thông tin đó, chịu trách
                                nhiệm với thông tin cung cấp.
</p>
                            <p>
                                7.5. Chấp nhận rằng mọi trao đổi mà SSIAM gửi đến hoặc được gửi đi từ địa
                                chỉ email, điện thoại, fax hoặc phương tiện điện tử khác mà Nhà Đầu Tư đã
                                đăng ký cho SSIAM mặc nhiên được hiểu là được SSIAM gửi đến cho Nhà Đầu Tư
                                hoặc gửi từ Nhà Đầu Tư cho SSIAM.
</p>
                            <p>
                                7.6. Thanh toán đầy đủ Phí Dịch Vụ và lệ phí khác theo quy định của SSIAM
                                đã được Hướng Dẫn Công Khai tùy từng thời điểm.
</p>
                            <p>
                                7.7. Nhận thức và đồng ý những rủi ro có thể phát sinh từ Giao Dịch Trực
                                Tuyến và Bản Công Bố Rủi Ro mà SSIAM đã cung cấp cho Nhà Đầu Tư hoặc công
                                bố trên website của SSIAM.
</p>
                            <p>
                                7.8. Chịu trách nhiệm áp dụng mọi biện pháp hợp lý nhằm đảm bảo an toàn,
                                đảm bảo tính tương thích cho các loại máy móc, thiết bị kết nối, phần mềm
                                hệ thống, phần mềm ứng dụng... do Nhà Đầu Tư sử dụng khi kết nối, truy cập
                                vào Hệ Thống nhằm kiểm soát, phòng ngừa và ngăn chặn việc sử dụng hoặc truy
                                cập trái phép Dịch Vụ Giao Dịch Trực Tuyến.
</p>
                            <p>
                                Điều 8. Cam kết của SSIAM
</p>
                            <p>
                                8.1. SSIAM không có bất kỳ cam kết, đảm bảo hoặc ưu tiên chuyển tiếp, thực
                                hiện thành công các Giao Dịch Trực Tuyến của bất kỳ Nhà Đầu Tư nào khi sử
                                dụng Dịch Vụ Giao Dịch Trực Tuyến và/hoặc thực hiện Giao Dịch Trực Tuyến.
</p>
                            <p>
                                8.2. SSIAM tin rằng, SSIAM có thể theo toàn quyền đánh giá của mình từ chối
                                thực hiện hoặc xác minh, kiểm tra lại trước khi thực hiện những Giao Dịch
                                Trực Tuyến mà SSIAM thấy khả nghi, bất thường hoặc không hợp lệ.
</p>
                            <p>
                                8.3. Quản lý thông tin liên quan đến việc thực hiện giao dịch của Nhà Đầu
                                Tư theo đúng quy định pháp luật.
</p>
                            <p>
                                8.4. Cung cấp, hướng dẫn và hỗ trợ cho Nhà Đầu Tư sử dụng các Dịch Vụ Giao
                                Dịch Trực Tuyến và/hoặc thực hiện Giao Dịch Trực Tuyến, công khai các biểu
                                phí áp dụng.
</p>
                            <p>
                                8.5. Thông báo trước cho Nhà Đầu Tư trong trường hợp ngưng, tạm ngưng, thay
                                đổi/chỉnh sửa/thay thế cung cấp một phần hoặc toàn bộ Dịch Vụ Giao Dịch
                                Trực Tuyến; thay đổi các điều khoản áp dụng khi đăng ký Giao Dịch Trực
                                Tuyến cho phù hợp với quy định pháp luật.
</p>
                            <p>
                                8.6. Hướng dẫn và hỗ trợ các vấn đề kỹ thuật phát sinh khi Nhà Đầu Tư sử
                                dụng Dịch Vụ Giao Dịch Trực Tuyến và/hoặc thực hiện Giao Dịch Trực Tuyến.
                                Thường xuyên cập nhật các phiên bản mới của Hệ Thống cho Nhà Đầu Tư (nếu
                                có).
</p>
                            <p>
                                8.7. Lưu trữ các Chứng Từ Điện Tử liên quan đến các Giao Dịch Trực Tuyến
                                của Nhà Đầu Tư theo đúng các quy định của pháp luật và đảm bảo rằng các
                                bằng chứng này có thể truy cập và sử dụng để tham chiếu khi cần thiết.
</p>
                            <p>
                                8.8. Thực hiện ngay việc thông báo trên website của SSIAM và cho các đại lý
                                phân phối và nỗ lực tối đa để khắc phục sự cố khi xảy ra lỗi đường truyền
                                hoặc lỗi hệ thống dẫn đến Giao Dịch Trực Tuyến không thể thực hiện được để
                                Nhà Đầu Tư kịp thời tiến hành giao dịch trực tiếp với SSIAM hoặc các tổ
                                chức khác theo hướng dẫn của SSIAM.
</p>
                            <p>
                                8.9. Bồi thường thiệt hại cho Nhà Đầu Tư theo quy định của pháp luật trong
                                trường hợp phát sinh các thiệt hại do lỗi của SSIAM gây ra.
</p>
                            <p>
                                Điều 9. Miễn trừ trách nhiệm
</p>
                            <p>
                                9.1. SSIAM không chịu trách nhiệm đối với bất kỳ sai sót hoặc thiệt hại nào
                                phát sinh do:
</p>
                            <p>
                                9.1.1. Nhà Đầu Tư cung cấp thông tin chậm trễ, thiếu sót hay không chính
                                xác dẫn đến không sử dụng được Dịch Vụ Giao Dịch Trực Tuyến và/hoặc thực
                                hiện Giao Dịch Trực Tuyến.
</p>
                            <p>
                                9.1.2. Lỗi của bất kỳ bên thứ ba nào, bao gồm cả những đối tác của SSIAM
                                trong việc cung cấp Dịch Vụ Giao Dịch Trực Tuyến.
</p>
                            <p>
                                9.1.3. Lỗi của Hệ Thống hay bất kỳ phương tiện kỹ thuật nào liên quan, kể
                                cả trường hợp Hệ Thống từ chối thực hiện Giao Dịch Trực Tuyến của Nhà Đầu
                                Tư vì bất kỳ lý do nào.
</p>
                            <p>
                                9.1.4. SSIAM thực hiện chậm trễ hay không thể thực hiện được trách nhiệm
                                của mình theo đúng các điều khoản và quy định sử dụng Dịch Vụ Giao Dịch
                                Trực Tuyến này do có sự trục trặc về máy móc, xử lý dữ liệu, thông tin viễn
                                thông, thiên tai hay bất kỳ sự việc nào ngoài sự kiểm soát của SSIAM hay do
                                hậu quả của sự gian lận, giả mạo của bất kỳ bên thứ ba nào.
</p>
                            <p>
                                9.1.5. Việc Nhà Đầu Tư để mất, lộ tên đăng nhập, Mật Khẩu Đăng Nhập, Mật
                                Khẩu Giao Dịch dẫn đến người khác dùng những thông tin này để sử dụng Dịch
                                Vụ Giao Dịch Trực Tuyến và/hoặc thực hiện Giao Dịch Trực Tuyến hoặc tiếp
                                cận những thông tin mà Dịch Vụ Giao Dịch Trực Tuyến cung ứng.
</p>
                            <p>
                                9.2. Hai Bên không chịu trách nhiệm đối với bất kỳ sai sót nào xảy ra khi
                                thực hiện một phần hay toàn bộ các điều khoản được nêu tại đây nếu sai sót
                                đó là do Sự Kiện Bất Khả Kháng.
</p>
                            <p>
                                Điều 10. Sửa đổi, bổ sung và chấm dứt sử dụng dịch vụ
</p>
                            <p>
                                10.1. Các điều khoản này sẽ chấm dứt hiệu lực khi:
</p>
                            <p>
                                (i) Tài khoản của Nhà Đầu Tư bị đóng/chấm dứt vì bất kỳ lý do gì;
</p>
                            <p>
                                (ii) SSIAM thông báo trước cho Nhà Đầu Tư về việc ngừng hoặc chấm dứt các
                                điều khoản áp dụng khi đăng ký Dịch Vụ Giao Dịch Trực Tuyến vào bất kỳ thời
                                điểm nào mà không cần có sự đồng ý của Nhà Đầu Tư;
</p>
                            <p>
                                SSIAM notifies the InVestor in adVance of the termination or suspension of
                                terms applied when registering an Online Trading SerVice at any time
                                without the consent of the InVestor;
</p>
                            <p>
                                (iii) Nhà Đầu Tư yêu cầu ngừng sử dụng Dịch Vụ Giao Dịch Trực Tuyến mà
                                SSIAM cung cấp;
</p>
                            <p>
                                (iv) Xảy ra Sự Kiện Bất Khả Kháng;
</p>
                            <p>
                                (v) Theo quy định của pháp luật hiện hành.
</p>
                            <p>
                                Việc chấm dứt dịch vụ này không làm ảnh hưởng đến nghĩa vụ chưa thực hiện
                                của các bên phát sinh trước thời điểm chẩm dứt. Các bên có trách nhiệm hoàn
                                tất nghĩa vụ của mình đến thời điểm chấm dứt dịch vụ trong thời gian sớm
                                nhất có thể.
</p>
                            <p>
                                10.2. SSIAM bảo lưu quyền được sửa đổi, bổ sung Phí Dịch Vụ, Dịch Vụ Giao
                                Dịch Trực Tuyến vào bất kỳ thời điểm nào mà không cần phải có sự đồng ý
                                trước của Nhà Đầu Tư. SSIAM sẽ thông báo các sửa đổi, bổ sung nêu trên và
                                các thông tin liên quan khác công khai tại website của SSIAM hoặc gửi qua
                                địa chỉ email mà Nhà Đầu Tư đã đăng ký.
</p>
                            <p>
                                10.3. SSIAM không chịu trách nhiệm trong trường hợp Nhà Đầu Tư không nhận
                                được thông tin do:
</p>
                            <p>
                                - Hòm thư của Nhà Đầu Tư không nhận được email từ SSIAM vì bất cứ lý do gì;
</p>
                            <p>
                                - Nhà Đầu Tư thay đổi địa chỉ email mà không đăng ký lại với SSIAM.
</p>
                            <p>
                                Điều 11. Điều khoản chung
</p>
                            <p>
                                11.1. Các điều khoản áp dụng này là một bộ phận không thể tách rời của Hợp
                                Đồng Của Sản Phẩm.
</p>
                            <p>
                                11.2. Việc Nhà Đầu Tư đăng ký và sử dụng Dịch Vụ Giao Dịch Trực Tuyến không
                                làm miễn trừ quyền và nghĩa vụ của Nhà Đầu Tư được quy định tại Hợp Đồng
                                Của Sản Phẩm, các cam kết liên quan mà Nhà Đầu Tư đã ký kết với SSIAM
                                và/hoặc các điều kiện quy định về cách thức giao dịch cụ thể mà SSIAM đã
                                hướng dẫn hoặc được thông báo công khai cho Nhà Đầu Tư.
</p>
                            <p>
                                11.3. Việc đăng ký sử dụng Dịch Vụ Giao Dịch Trực Tuyến không loại trừ
                                quyền của Nhà Đầu Tư được thực hiện giao dịch qua các hình thức sử dụng
                                dịch vụ khác mà Nhà Đầu Tư đã đăng ký với SSIAM.
</p>
                            <p>
                                11.4. Nhà Đầu Tư cần thực hiện kiểm tra trực tiếp, thường xuyên theo dõi số
                                dư và diễn biến tài khoản giao dịch và kịp thời phản ánh cho SSIAM những
                                sai sót phát sinh (nếu có) trong quá trình sử dụng Dịch Vụ Giao Dịch Trực
                                Tuyến và/hoặc thực hiện Giao Dịch Trực Tuyến.
</p>
                            <p>
                                11.5. Các điều khoản này được điều chỉnh theo quy định của pháp luật Việt
                                Nam. Các tranh chấp phát sinh giữa Nhà Đầu Tư và SSIAM được giải quyết trên
                                cơ sở thương lượng giữa hai Bên. Trong trường hợp thương lượng không thành,
                                các Bên có quyền yêu cầu tòa án có thẩm quyền giải quyết theo quy định pháp
                                luật.
</p>
                        </div>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <div style={{ maxHeight: '250px', overflow: 'auto', background: '#F3F3F3', padding: '10px' }}>
                            <p align="center">
                                TERMS &amp; CONDITIONS (attached with Online Trading Service Registration
                                Form)
</p>
                            <p>
                                Article 1. Term definitions
</p>
                            <p>
                                1.1. “Party” is the Investor or SSIAM depending on the context and
                                “Parties” are both the Investor and SSIAM.
</p>
                            <p>
                                1.2. “Electronic Record” is data related to performing the Investor’s
                                transactions, which is created, generated, received and stored when the
                                Online Trading Service is used and/or the Online Trading is performed.
</p>
                            <p>
                                1.3. “Online Trading Service” is the services provided by SSIAM for the
                                Investors at certain time for the Investor’s Online Trading purpose
</p>
                            <p>
                                1.4. “Online Trading” is the transactions of the Investor for the Product
                                provided by SSIAM, which (i) are performed in accordance with the services
                                provided by SSIAM from time to time; and (ii) through information
                                technology system and internet, telecommunication network or other open
                                networks.
</p>
                            <p>
                                1.5. “System” is the system built by SSIAM in order to manage and perform
                                the Online Trading including hardware, software programs, database,
                                telecommunication network, internet, computer network.
</p>
                            <p>
                                1.6. “Product’s Contract” is the agreement by and between the Investor and
                                SSIAM related to the creation, management of the Product, including but not
                                limited to the Open-ended Fund Account Opening Application Form, other
                                required documents, contracts for each Product.
</p>
                            <p>
                                1.7. “Log-in Password” is the password to verify the Investor accessing the
                                System.
</p>
                            <p>
                                1.8. “Trading Password” is the password which is used to confirm once again
                                before executing an Online Trading. The Trading Password shall be one of
                                the two following types at the Investor’s discretion:
</p>
                            <p>
                                (1) One-time password (OTP): provided by the system, valid for only one
                                transaction at one certain time for a certain Investor, and will
                                automatically become invalid within a certain period of time.
</p>
                            <p>
                                (2) PIN code: established by the Investor and effective until being changed
                                by the Investor.
</p>
                            <p>
                                1.9. “Product” is any product, services provided by SSIAM from time to
                                time, pursuant to laws, which could be implemented online.
</p>
                            <p>
                                1.10. "Force Majeure" means any event including any act or restrictions of
                                the government or state authorities, riots, wars, civil commotions,
                                insurrections, strikes, other labor controversies and other work
                                stagnations, deactivated or prevented public utilities, epidemic diseases,
                                fires, floods, earthquakes, tsunamis or natural disasters, and other events
                                beyond the control of the two Parties otherwise unavoidable, which prevent
                                any Party or both Parties from fulfillment of all or part of these terms.
</p>
                            <p>
                                Article 2. Content
</p>
                            <p>
                                2.1. SSIAM agrees to provide and the Investor agrees to use the Online
                                Trading Service. The Online Trading Service in the first period shall be
                                performed through internet and could be amended, supplemented from time to
                                time in accordance with SSIAM’s notice.
</p>
                            <p>
                                2.2. SSIAM shall provide and/or revise specific terms of the Online Trading
                                Service which is considered reasonable by SSIAM from time to time and shall
                                publicize such terms on SSIAM’s website.
</p>
                            <p>
                                2.3. After signing on this Registration Form, the Investor is entitled to
                                use the Online Trading Service and automatically accepts the terms and
                                conditions for the Online Trading Service set out by SSIAM from time to
                                time.
</p>
                            <p>
                                2.4. The provision of the Online Trading Service of SSIAM and the use of
                                the Online Trading Service and/or the execution of the Online Trading of
                                the Investor are subject to the terms of the Online Trading Service
                                Registration Form, Product’s Contract, related agreements, commitments that
                                the Investor has signed with SSIAM and/or specific terms and conditions
                                which are instructed and directly notified to the Investor or on SSIAM’s
                                website.
</p>
                            <p>
                                Article 3. Risks from the Online Trading
</p>
                            <p>
                                There are potential risks in using the Online Trading Service and/or the
                                Online Trading performance due to faults of the System or any third party.
                                The Investor undertakes to accept all risks arising from using the Online
                                Trading Service and/or executing the Online Trading, due to faults of the
                                System, of any third party or the Investor‘s acts affecting using the
                                Online Trading Service and/or executing the Online Trading.
</p>
                            <p>
                                Article 4. Time of service supply
</p>
                            <p>
                                4.1. SSIAM shall provide the Online Trading Service continuously.
</p>
                            <p>
                                4.2. In case of suspending the Online Trading Service supply due to
                                amendments, maintenance and upgrading of the System or being requested by
                                competent authorities, SSIAM shall inform in advance.
</p>
                            <p>
                                Article 5. Fees
</p>
                            <p>
                                5.1. By using the Online Trading Service and/or executing the Online
                                Trading, the Investor understands and agrees that SSIAM may charge one or
                                more fees for use of Service ("Service Fee"). For the avoidance of doubt,
                                this Service Fee is not the service fee/ service price which is applied for
                                the Products and/or for other forms of service registered with SSIAM by the
                                Investor and prescribed in the Product’s Contracts and other related
                                documents, including but not limited to subscription fee, redemption fee
                                paid by the Investor for each open-ended fund certificate transaction.
</p>
                            <p>
                                5.2. The Service Fee shall be informed to the Investor by SSIAM when
                                registering the Online Trading Service and/or implementing the Online
                                Trading. SSIAM reserves the right to charge, revise the Service Fee and
                                Service Fee payment method from time to time.
</p>
                            <p>
                                Article 6. Confidentiality
</p>
                            <p>
                                6.1. Responsibilities of the Investor
</p>
                            <p>
                                6.1.1. Keep confidential the Log-in Password, Trading Password and be
                                responsible for all losses and damages due to reveal of the Log-in
                                Password, the Trading Password under any circumstance.
</p>
                            <p>
                                6.1.2. In case of discovering the above information out of the Investor’s
                                control, the Investor must inform SSIAM without delay and follow SSIAM’s
                                instructions.
</p>
                            <p>
                                6.2. Responsibilities of SSIAM
</p>
                            <p>
                                6.2.1. Keep confidential and store the Investor’s personal information
                                (username/the Log-in Password, transaction information and all other
                                information of the Investor), except for the case of providing this
                                information to the competent authorities as required by law.
</p>
                            <p>
                                6.2.2. Support the Investor to recover log-in information when requested by
                                the Investor.
</p>
                            <p>
                                Article 7. The Investor’s undertakings
</p>
                            <p>
                                7.1. Undertake to read carefully, understand clearly and comply with
                                guidelines of the Online Trading Service and/or executing Online Trading,
                                which are directly provided by SSIAM or publicized on its website (“Public
                                Instruction”). SSIAM is not responsible for unperformed Online Trading for
                                any reason or any damage if the Investor does not follow correctly the
                                Public Instruction.
</p>
                            <p>
                                7.2. Trading Password is deemed to be the Investor’s electronic signature
                                (“Electronic Signature”) and the Electronic Record created and/or confirmed
                                and sent with the Investor’s Electronic Signature has legal value similar
                                to the Investor’s order slip sent duly at the trading counter.
</p>
                            <p>
                                7.3. Agree that any access/transaction to/on the Investor’s trading account
                                by username with correct Log-in Password and Trading Password is regard as
                                the Investor’s access/transaction.
</p>
                            <p>
                                7.4. Fully provide/register information related to the Investor and quickly
                                inform SSIAM when that information is changed, be responsible for such
                                provided information.
</p>
                            <p>
                                7.5. Agree that all information or exchanges sent by SSIAM to or sent from
                                email, telephone, fax or other electronic means registered to the SSIAM by
                                the Investor are naturally regarded as sent by SSIAM to the Investor or
                                sent from the Investor to SSIAM.
</p>
                            <p>
                                7.6. Pay in full the Services Fee and other expenses in accordance with
                                SSIAM’s Public Instruction from time to time.
</p>
                            <p>
                                7.7. Acknowledge of and agree with the potential risks from the Online
                                Trading and the Risks Disclosure provided by SSIAM or publicized on its
                                website.
</p>
                            <p>
                                7.8. Be responsible for applying any reasonable measures in order to ensure
                                security and compatibility for all kinds of machines, connection equipment,
                                systematic software, application software, etc. used by the Investor to
                                connect, access to the System in order to control and prevent illegal use
                                and access to the Online Trading Service.
</p>
                            <p>
                                Article 8. SSIAM’s undertakings
</p>
                            <p>
                                8.1. SSIAM has no undertakings, assurance or providing priority regarding
                                transition and successful performance of any Online Trading when the
                                Investor uses the Online Trading Service and/or executes the Online
                                Trading.
</p>
                            <p>
                                8.2. SSIAM can, at its sole discretion, reject to perform or verify and
                                check again before performing any Online Transaction that SSIAM believes
                                invalid, unusual, and doubtable.
</p>
                            <p>
                                8.3. Manage information related to the Investor’s transactions as required
                                by law.
</p>
                            <p>
                                8.4. Supply, instruct and support the Investor to use the Online Trading
                                Service and/or perform the Online Trading, publicize applied the Service
                                Fee levels.
</p>
                            <p>
                                8.5. Inform the Investor in advance in the case of interruption, temporary
                                interruption, change/repair/replacement partly or wholly the Online Trading
                                Service; change the terms and conditions of this Registration Form in
                                accordance with applicable laws.
</p>
                            <p>
                                8.6. Instruct and support technical problems when the Investor uses the
                                Online Trading Service and/or executes the Online Trading. Regularly update
                                new versions of the System to the Investor (if any).
</p>
                            <p>
                                8.7. Store the Electronic Record related to the Investor’s Online Trading
                                in accordance with applicable laws and ensure that these documents are
                                accessible and usable for reference in necessary cases.
</p>
                            <p>
                                8.8. Immediately inform on SSIAM’s website and for distributors and make
                                best efforts to repair problems of transmission or systematic faults
                                causing the Online Trading unperformed in order for the Investor to timely
                                execute direct transaction with SSIAM or other institutions under
                                instruction by SSIAM.
</p>
                            <p>
                                8.9. Compensate the Investor as provided by law for any damages due to
                                SSIAM’s faults.
</p>
                            <p>
                                Article 9. Disclaimer
</p>
                            <p>
                                9.1. SSIAM shall be not responsible for any mistake or damage for the
                                following reasons:
</p>
                            <p>
                                9.1.1. The Investor does not provide information in time, or provide
                                incomplete or inexact information, which causes the Online Trading Service
                                unusable and/or the Online Trading unperformed.
</p>
                            <p>
                                9.1.2. Mistakes of any third party, even including SSIAM’s partners in
                                providing the Online Trading Service.
</p>
                            <p>
                                9.1.3. Faults of the System or any relevant technical mean, even including
                                the case that the System rejects to perform the Investor’s Online Trading
                                for any reason.
</p>
                            <p>
                                9.1.4. SSIAM performs with delay or cannot perform its duties according to
                                the terms and conditions of the Online Trading Services because of problems
                                regarding machines, data process, media, act of God or any event out of its
                                control or results of any third party’s fraud and fake.
</p>
                            <p>
                                9.1.5. The case that the Investor reveals username, the Log-in Password,
                                the Trading Password of the Investor, which enables other person to make
                                use of this information for using the Online Trading Service and/or
                                performing the Online Trading or accessing to the information provided by
                                the Online Trading Service.
</p>
                            <p>
                                9.2. The Parties are not responsible for any error in implementing one or
                                all of the terms stated herein if such error is due to the Force Majeure.
</p>
                            <p>
                                Article 10. Amendment, supplement and termination of the service
</p>
                            <p>
                                10.1. These terms shall terminate when:
</p>
                            <p>
                                (i) The Investor’s account has been closed/terminated for whatever reason;
</p>
                            <p>
                                (ii) SSIAM notifies the Investor in advance of the termination or
                                suspension of terms applied when registering an Online Trading Service at
                                any time without the consent of the Investor;
</p>
                            <p>
                                (iii) The Investor requests suspending the use of the Online Trading
                                Service provided by SSIAM;
</p>
                            <p>
                                (iv) Occurrence of the Force Majeure;
</p>
                            <p>
                                (v) In accordance with applicable laws.
</p>
                            <p>
                                The termination of this service shall not affect any obligation arising out
                                prior to the termination. The Parties has obliged to complete such
                                obligation till the date of termination as soon as possible.
</p>
                            <p>
                                10.2. SSIAM reserves the right to amend, supplement the Service Fee, the
                                Online Trading Service at any time without prior approval of the Investor.
                                SSIAM shall update such above amendments, supplements and related
                                information publicly on the SSIAM’s website or VIA the email address
                                registered by the Investor.
</p>
                            <p>
                                10.3. SSIAM is not responsible for the case that the Investor does not
                                receive information due to:
</p>
                            <p>
                                - The Investor’s mailbox cannot RECEIVE email from SSIAM for any reason.
</p>
                            <p>
                                - The Investor changes email address without re-registering with SSIAM.
</p>
                            <p>
                                Article 11. General terms
</p>
                            <p>
                                11.1. This term of use is an integrated part of the Product’s Contract.
</p>
                            <p>
                                11.2. The fact that the Investor registers and uses the Online Trading
                                Service does not waive the Investor’s rights and duties stipulated in the
                                Product’s Contract, related undertakings which the Investor has signed with
                                SSIAM and/or concrete conditions of trading instructed and publicized by
                                SSIAM.
</p>
                            <p>
                                11.3. Registering to use the Online Trading Service does not waive the
                                Investor’s right to execute transaction via other forms of Services which
                                the Investor has registered with SSIAM.
</p>
                            <p>
                                11.4. The Investor should directly and frequently check the trading account
                                status and balance and keeps SSIAM informed without delay of mistakes (if
                                any) arising from the process of using the Online Trading Service and/or
                                executing Online Trading.
</p>
                            <p>
                                11.5. These terms shall be construed to in accordance with the laws of
                                Vietnam. Any dispute or controversy arising between the Investor and SSIAM
                                relating to these terms will settle by negotiation between the Parties. In
                                case the negotiation fails, both Parties HAVE the rights to bring the case
                                to competent court in accordance with applicable laws.
</p>
                        </div>

                    </React.Fragment>
                }
            </React.Fragment>
        );
    }
}
const stateToProps = state => ({
    language: state.language.language,
    auth: state.auth
});


const decorators = flow([
    connect(stateToProps),
    translate('GeneralInfo_Text_Contract')
]);
module.exports = decorators(GeneralInfo_Text_Contract);
