/**
 *>>>>. Lưu ý khi viết code mới***
1. Để tránh hiện tượng lag do component bị render quá nhiều lần (ví dụ sự kiện onchange input),
cần hạn chế render những component nào không có thay đổi dữ liệu. Hiện tại trong code đang sử dụng
hàm ComponentShouldUpdate để check. Sau này khi viết thêm trường mới (input mới) thì cần
cập nhật hàm này, hoặc có thể thay đổi = PureComponent or React memo.

2. Với những logic được dùng đi dùng lại, cần viết hàm dùng chung (ví dụ onchange input), như vậy
code sẽ tối ưu và ngắn hơn.

3. Hạn chế dùng các hàm đã outdated của React, ví dụ ComponentWillMount or ComponentWillReceiveNextProps.
- Hàm willmout có thể viết tại hàm didmout
- Hàm receiveNextProps có thể thay thế = hàm ComponentDidUpdate

4. TUYỆT ĐỐI (NEVER) MODIFY (MUTATE) state trực tiếp: Không bao giờ sửa đổi state một cách trực tiếp

LÍ DO: sẽ dẫn tới những lần re-render không cần thiết và làm state bị lưu sai. Lỗi chỉ xảy ra  khi component
đủ lớn - ở đây luồng mở tài khoản cần tới từ 70 đến 90 inputs được lưu tại state (bị lưu sai do mutate state)

GIẢI PHÁP: Ví dụ với hàm onChange input, chỉ viết 1 hàm và được dùng chung cho tất cả input.

Bad code:
this.state['YOUR_INPUT_ID'] = event.target.value; -> mutate(modify) state directly
this.setState({...this.state})

Good code:
let stateCopy = {...this.state};
stateCopy['YOUR_INPUT_ID'] = event.target.value
this.setState({...stateCopy })

-> ở đây không nhất thiết phải merge state, vì react (code đúng chuẩn react) thì nó đã auto merge.


 *>>> MÔ TẢ LUỒNG MỞ, SỬA TÀI KHOẢN <<<
 1. Luồng mở tài khoản EKYC (role khách hàng vãng lai - chưa login);
  sửa thông tin tài khoản (role nhà đầu tư); xem/sửa/xóa/thêm mới tài khoản (role môi giới, admin -- nghiệp vụ)
  đều dùng chung component này (thư mục OpenAccount).

2. Luồng mở tài khoản = EKYC base trước, tuy nhiên, so với luồng mở tài khoản của web nghiệp vụ chỉ giống nhau
  tại step 3 (điền thông tin nhà đầu tư) -> giữa mở tài khoản = EKYC và mở = web nghiệp vụ sẽ dùng chung
  component 'CreateAccountStep3'

3. Đối với mở tài khoản EKYC: bao gồm các Step từ Step1 cho tới Step4 (trừ thư mục EditAccount)

4. Đối với mở/sửa của web nghiệp vụ (role amdin, môi giới) và sửa tài khoản (role nhà đầu tư): bao gồm
thư mục EditAccount và Step3 của mở tài khoản

5. Khi mở/sửa tài khoản, hệ thống đang chia thành 4 loại người dùng: cá nhân trong nước, cá nhân ngoài nước,
tổ chức trong nước và tổ chức ngoài nước.

- phân biệt giữa 4 loại người dùng này = trường userType (hoặc USER_TYPE_OBJ trong Helper)
- phân biệt là cá nhân hay tổ chức = trường CUSTYPE_CN và CUSTYPE_TC
- phân biệt là trong nước hay ngoài nước = trường GRINVESTOR_TN và GRINVESTOR_NN (group investor ==)) )
- phân biệt là đang mở tài khoản ekyc hay đang mở/sửa = web nghiệp vụ or nhà đầu tư = trường isLoggedOut,
check xem là có còn đăng nhập hay ko. ko đăng nhập (isLoggedOut = true) tức là mở = EKYC

6. Trong tất cả các bước mở/sửa tài khoản thì bước nhập thông tin nhà đầu tư là phức tạp nhất, cần break code ra.
bước này chính là bước 3 của mở tài khoản EKYC và là bước 1 của mở/sửa web nghiệp vụ;
và đều dùng chung file CreateAccountStep3.

Đối với file CreateAccountStep3, để break code nhỏ ra  thì: (code full logic thì tầm 4k dòng code như bản base:v)
- Logic ẩn hiện các inputs theo 4 loại tài khoản được viết tại file HideShowDataInput.js
- Các logic còn lại như gọi APIs, validate inputs... được viết file Step3Utils.

7. Sau này, khi muốn thêm trường mới hoặc ẩn hiện các trường đang có thì chỉ cần:
- Check xem đã khai báo tên biến state chưa
- Check file Step3Utils và khai báo array allow (cho phép ẩn hiện)

8. Với logic sửa thông tin nhà đầu tư, cần map lại key của api và key khai báo trong state,
bước này được khai báo trong Step3Utils.
Tương tự, khi submit api, cần map lại state và trường của api (cũng khai báo trong Step3Utils)
Lí do phải làm vậy vì api tạo tài khoản đang truyền theo dạng nối chuỗi và là api đã viết từ trước :v



 */