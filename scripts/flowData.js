// ==========================================================================
// GongU365 Login Flow Data & Business Rules (from Figma Flow)
// ==========================================================================

export const TRIGGER_GROUPS = [
  {
    id: "social",
    title: "Cách 1: Login Social (Thao tác thông thường)",
    badge: "Yêu cầu Social Login",
    badgeClass: "social",
    description:
      "Các thao tác tương tác cộng đồng chỉ yêu cầu đăng nhập nhanh qua nền tảng Social (Google, Apple, Kakaotalk, Facebook, Zalo).",
    triggers: [
      { id: "like", label: "❤️ Nhấn Thả tim" },
      { id: "share", label: "🔗 Share" },
      { id: "save", label: "🔖 Lưu" },
      { id: "see-more", label: "👀 Xem thêm hạng mục ẩn" },
      { id: "review", label: "✍️ Viết đánh giá / Bình luận" },
      { id: "report", label: "🚩 Báo cáo nội dung (Report)" },
      { id: "follow", label: "➕ Theo dõi (Follow)" },
    ],
    targetScreen: "welcome",
    requiredMethod: "SOCIAL",
  },
  {
    id: "otp",
    title: "Cách 2: OTP Số điện thoại & Liên kết Email",
    badge: "Yêu cầu OTP SĐT",
    badgeClass: "otp",
    description:
      "Các thao tác liên quan đến giao dịch, điểm thưởng, voucher và hồ sơ làm đẹp bắt buộc xác minh OTP Số điện thoại & liên kết Email.",
    triggers: [
      { id: "buy", label: "🛍️ Nhấn Mua hàng" },
      { id: "gift", label: "🎁 Nhận quà" },
      { id: "earn-point", label: "⭐ Tích điểm" },
      { id: "voucher", label: "🎟️ Nhận Voucher" },
      { id: "beauty-profile", label: "💄 Điền Beauty Profile" },
      { id: "redeem", label: "💎 Đổi điểm" },
      { id: "link-social", label: "🔗 Liên kết tài khoản Social" },
    ],
    targetScreen: "phone-login",
    requiredMethod: "OTP",
  },
  {
    id: "hybrid",
    title: "Cách 3: Login Social → Xác minh SĐT bắt buộc",
    badge: "Social + OTP Verify",
    badgeClass: "hybrid",
    description:
      "User đã đăng nhập bằng Social trước đó, khi thực hiện thao tác mua sắm/tích điểm sẽ được yêu cầu liên kết & xác minh OTP Số điện thoại.",
    triggers: [
      { id: "social-then-buy", label: "🔄 Đã Login Social → Nhấn Mua hàng" },
    ],
    targetScreen: "phone-login",
    requiredMethod: "HYBRID",
  },
];

export const FLOW_STEPS = [
  {
    id: "welcome",
    num: 1,
    label: "Màn hình Đăng ký / Đăng nhập",
    desc: "Logo GongU365, Voucher 20%, Social & SĐT",
    spec: [
      "Hiển thị Logo GongU365 và thông điệp đặc quyền GongUser (#EB2F96).",
      "Welcome Coupon (#DEFF99): Khám phá sản phẩm qua đánh giá nhận ngay voucher giảm 20%!",
      "Hỗ trợ 5 nền tảng Social: Google, Apple, Kakaotalk, Facebook, Zalo + Email/SĐT.",
      "Có switch 'Bật xác thực bằng Face ID' ở chân màn hình.",
      "Tuân thủ Điều khoản Dịch vụ & Chính sách Quyền riêng tư theo Pháp luật Việt Nam.",
    ],
  },
  {
    id: "phone-login",
    num: 2,
    label: "Đăng nhập bằng Số điện thoại",
    desc: "Nhập SĐT (VD: 0987 768 189) & Gửi mã OTP",
    spec: [
      "Bắt buộc khi User chọn Mua hàng, Nhận quà, Tích điểm, Nhận Voucher, Beauty Profile, Đổi điểm.",
      "Validate định dạng số điện thoại Việt Nam (10 số, bắt đầu bằng 0).",
      "Hiển thị giải thích mục đích: trải nghiệm mua sắm tốt hơn & gửi thông báo ưu đãi.",
      "Cho phép quay lại 'Sử dụng phương thức khác'.",
    ],
  },
  {
    id: "otp-verify",
    num: 3,
    label: "Xác minh mã OTP (6 chữ số)",
    desc: "Nhập mã OTP & đếm ngược Gửi lại mã 30s",
    spec: [
      "Gồm 6 ô nhập mã OTP tự động chuyển ô khi nhập.",
      "Đồng hồ đếm ngược 30s trước khi cho phép bấm 'Gửi lại mã'.",
      "Xác minh thành công → chuyển sang màn hình 'Tiếp tục cài đặt' (nếu là user mới) hoặc hoàn tất ngay.",
    ],
  },
  {
    id: "profile-setup",
    num: 4,
    label: "Xác minh thành công & Cài đặt",
    desc: "ID, Mật khẩu, Biệt danh, Ngày sinh, Email, Quốc gia",
    spec: [
      "Header xác nhận: 'Xác minh thành công — Tiếp tục cài đặt'.",
      "Các trường bắt buộc: ID tài khoản, Mật khẩu, Biệt danh, Ngày/Tháng/Năm sinh.",
      "Liên kết Email + nhập mã xác nhận Email 6 chữ số (Gửi lại mã 30s).",
      "Chọn Khu vực tài khoản (Quốc gia). Nút CTA: 'HOÀN TẤT CÀI ĐẶT'.",
    ],
  },
  {
    id: "voucher-success",
    num: 5,
    label: "Nhận Voucher GongU365 thành công",
    desc: "Chúc mừng nhận Voucher 20% & Tiếp tục mua sắm",
    spec: [
      "Hiển thị thông báo: 'Chúc mừng [Tên User] nhận Voucher GongU365 thành công!!'",
      "Cấp ngay Voucher giảm 20% dành cho thành viên mới GongUser.",
      "Nút 'Tiếp tục mua sắm' đưa user về app với trạng thái đã xác thực đầy đủ.",
    ],
  },
];

export const DESIGN_TOKENS_PREVIEW = [
  { name: "Primary Lime", value: "#C8FF32" },
  { name: "Welcome Coupon", value: "#DEFF99" },
  { name: "Secondary Pink", value: "#EB2F96" },
  { name: "Hot Magenta", value: "#FF1494" },
  { name: "Apple Black", value: "#030F16" },
  { name: "Kakao Yellow", value: "#FFE500" },
  { name: "Success Green", value: "#52C41A" },
  { name: "Border Light", value: "#E8E9EB" },
];
