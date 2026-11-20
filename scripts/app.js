// ==========================================================================
// GongU365 Mobile Web App — Login & Registration Flow (Dark Mode)
// ==========================================================================

const state = {
  screen: "welcome", // 'welcome' | 'register' | 'register-terms' | 'phone-login' | 'otp-verify' | 'profile-setup' | 'voucher-success' | 'home' | 'email-login' | 'support'
  authModal: null, // null | { type: 'apple' | 'oauth', provider, domain }
  pendingAction: null, // null | { label, requireOtp: boolean }
  faceIdEnabled: true,
  agreedTerms: true,
  phone: "0987 768 189",
  otpDigits: ["", "", "", "", "", ""],
  otpCountdown: 30,
  emailCountdown: 30,
  emailCodeSent: false,
  showPassword: false,
  toast: "",
  profile: {
    accountId: "nhungbui.gong365",
    password: "••••••••",
    nickname: "Nhung Bùi",
    day: "15",
    month: "08",
    year: "1998",
    email: "nhungbui@gmail.com",
    emailOtp: "",
    country: "Việt Nam",
  },
  profileError: "",
  session: {
    loggedIn: false,
    provider: "",
    phoneVerified: false,
    emailVerified: false,
    voucherClaimed: false,
  },
};

let otpTimerHandle = null;
let emailTimerHandle = null;
let toastTimerHandle = null;

const ICONS = {
  cartLogo: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M3 4h2l2.4 10.5a1 1 0 0 0 1 .8h9.8a1 1 0 0 0 1-.8L21 7H6.2"/></svg>`,
  google: `<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1C3.3 21.4 7.3 24 12 24z"/><path fill="#FBBC05" d="M5.3 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.3C.5 8.2 0 10.1 0 12s.5 3.8 1.3 5.4l4-3.1z"/><path fill="#EA4335" d="M12 4.7c1.8 0 3.4.6 4.6 1.8l3.4-3.4C17.9 1.1 15.2 0 12 0 7.3 0 3.3 2.6 1.3 6.6l4 3.1c.9-2.9 3.6-5 6.7-5z"/></svg>`,
  apple: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z"/></svg>`,
  kakao: `<svg width="18" height="18" viewBox="0 0 24 24" fill="#17191B"><path d="M12 3C6.477 3 2 6.463 2 10.737c0 2.757 1.842 5.176 4.614 6.54l-1.176 4.327a.4.4 0 0 0 .61.436l5.04-3.357c.298.027.602.042.912.042 5.523 0 10-3.463 10-7.988C22 6.463 17.523 3 12 3z"/></svg>`,
  facebook: `<svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>`,
  zalo: `<svg width="18" height="18" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#0068FF"/><text x="12" y="16" text-anchor="middle" fill="#fff" font-size="9" font-weight="800" font-family="Inter, sans-serif">Zalo</text></svg>`,
  faceId: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M7 3H5a2 2 0 0 0-2 2v2M17 3h2a2 2 0 0 1 2 2v2M7 21H5a2 2 0 0 1-2-2v-2M17 21h2a2 2 0 0 0 2-2v-2"/><path d="M9 9v1M15 9v1M12 9v3.5a1 1 0 0 1-1 1"/><path d="M8.5 15.5a4.5 4.5 0 0 0 7 0"/></svg>`,
  back: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`,
};

function showToast(msg) {
  clearTimeout(toastTimerHandle);
  state.toast = msg;
  render();
  toastTimerHandle = setTimeout(() => {
    state.toast = "";
    render();
  }, 2600);
}

function startOtpTimer() {
  clearInterval(otpTimerHandle);
  state.otpCountdown = 30;
  otpTimerHandle = setInterval(() => {
    if (state.otpCountdown > 0) {
      state.otpCountdown -= 1;
      const btn = document.getElementById("resend-otp-btn");
      if (btn) {
        btn.disabled = state.otpCountdown > 0;
        btn.textContent =
          state.otpCountdown > 0
            ? `Gửi lại mã ${state.otpCountdown}s`
            : "Gửi lại mã";
      }
    } else {
      clearInterval(otpTimerHandle);
    }
  }, 1000);
}

function startEmailTimer() {
  clearInterval(emailTimerHandle);
  state.emailCountdown = 30;
  state.emailCodeSent = true;
  emailTimerHandle = setInterval(() => {
    if (state.emailCountdown > 0) {
      state.emailCountdown -= 1;
      const btn = document.getElementById("resend-email-btn");
      if (btn) {
        btn.disabled = state.emailCountdown > 0;
        btn.textContent =
          state.emailCountdown > 0
            ? `Gửi lại mã ${state.emailCountdown}s`
            : "Gửi lại mã";
      }
    } else {
      clearInterval(emailTimerHandle);
    }
  }, 1000);
}

function navigateTo(screen) {
  state.screen = screen;
  state.authModal = null;
  if (screen === "otp-verify") startOtpTimer();
  render();
}

function openSocialAuth(provider) {
  if (provider === "Apple") {
    state.authModal = { type: "apple", provider: "Apple" };
  } else {
    const domains = {
      Google: "accounts.google.com",
      Facebook: "m.facebook.com",
      Kakaotalk: "kauth.kakao.com",
      Zalo: "oauth.zaloapp.com",
    };
    state.authModal = {
      type: "oauth",
      provider,
      domain: domains[provider] || "auth.gongu365.vn",
    };
  }
  render();
}

function completeSocialAuth(provider) {
  state.authModal = null;
  state.session.loggedIn = true;
  state.session.provider = provider;

  if (state.pendingAction?.requireOtp && !state.session.phoneVerified) {
    showToast("Vui lòng xác minh thêm SĐT để hoàn tất thao tác");
    navigateTo("phone-login");
    return;
  }

  state.session.voucherClaimed = true;
  navigateTo("voucher-success");
}

function resetFlow() {
  clearInterval(otpTimerHandle);
  clearInterval(emailTimerHandle);
  state.screen = "welcome";
  state.authModal = null;
  state.pendingAction = null;
  state.otpDigits = ["", "", "", "", "", ""];
  state.profileError = "";
  state.emailCodeSent = false;
  state.session = {
    loggedIn: false,
    provider: "",
    phoneVerified: false,
    emailVerified: false,
    voucherClaimed: false,
  };
  render();
}

function renderSocialButtons() {
  return `
    <div class="social-stack">
      <button class="social-btn google" data-provider="Google">
        ${ICONS.google} <span>Tiếp tục với Google</span>
      </button>
      <button class="social-btn apple" data-provider="Apple">
        ${ICONS.apple} <span>Tiếp tục với Apple</span>
      </button>
      <button class="social-btn kakao" data-provider="Kakaotalk">
        ${ICONS.kakao} <span>Tiếp tục với Kakaotalk</span>
      </button>
      <button class="social-btn facebook" data-provider="Facebook">
        ${ICONS.facebook} <span>Tiếp tục với Facebook</span>
      </button>
      <button class="social-btn zalo" data-provider="Zalo">
        ${ICONS.zalo} <span>Tiếp tục với Zalo</span>
      </button>
    </div>`;
}

function render() {
  const root = document.getElementById("app-root");
  let html = state.toast ? `<div class="toast-banner">${state.toast}</div>` : "";

  if (state.screen === "welcome") {
    html += `
      <div class="auth-screen">
        <div class="auth-logo-row">
          <div class="auth-logo-mark">${ICONS.cartLogo}</div>
          <div class="auth-logo-text">GongU365</div>
        </div>
        <p class="auth-tagline">
          Đăng ký ngay và nhận đặc quyền <span class="pink">GongUser</span>
        </p>

        <div class="welcome-coupon-wrap">
          <div class="welcome-coupon">
            💝 Khám phá sản phẩm qua<br/>
            đánh giá nhận ngay <span class="coupon-pink">voucher giảm 20%!</span>
          </div>
          <div class="coupon-tail"></div>
        </div>

        <div class="quick-phone-box">
          <input id="quick-phone-input" class="gu-input" type="tel" placeholder="Nhập số điện thoại" value="${state.phone}" />
          <button id="quick-phone-submit" class="gu-btn-primary">Đăng nhập</button>
        </div>

        <div class="or-divider">Hoặc</div>
        ${renderSocialButtons()}

        <p class="terms-text">
          Khi tiếp tục, tôi đồng ý với <strong>Điều khoản Dịch vụ</strong> và <strong>Chính sách Quyền riêng tư</strong> của GongU365 theo Pháp luật Việt Nam.
        </p>

        <div style="text-align:center;margin-top:12px;font-size:13px;color:rgba(255,255,255,0.7);">
          Bạn chưa có tài khoản? <button id="goto-register" class="text-btn">Đăng ký</button>
        </div>

        <div class="auth-spacer"></div>

        <div class="bottom-links">
          <button class="bottom-link-btn pink" id="goto-email-login">Email / ID</button>
          <span class="bottom-link-sep">|</span>
          <button class="bottom-link-btn" id="goto-forgot">Quên mật khẩu</button>
          <span class="bottom-link-sep">|</span>
          <button class="bottom-link-btn" id="goto-support">Trung tâm hỗ trợ</button>
        </div>

        <div class="faceid-bar">
          <span class="faceid-label">${ICONS.faceId} Bật xác thực bằng Face ID ⓘ</span>
          <button id="toggle-faceid" class="gu-switch ${state.faceIdEnabled ? "on" : ""}" aria-label="Bật Face ID">
            <div class="gu-switch-knob"></div>
          </button>
        </div>
      </div>`;
  } else if (state.screen === "register") {
    html += `
      <div class="subscreen">
        <div class="subscreen-nav">
          <button class="back-btn" id="btn-back-welcome">${ICONS.back}</button>
          <span style="font-size:12.5px;font-weight:700;color:rgba(255,255,255,0.65);">Đăng ký tài khoản</span>
          <span style="width:36px"></span>
        </div>

        <div class="auth-logo-row" style="margin-top:4px;">
          <div class="auth-logo-mark">${ICONS.cartLogo}</div>
          <div class="auth-logo-text">GongU365</div>
        </div>
        <p class="auth-tagline">
          Tạo tài khoản mới để nhận đặc quyền <span class="pink">GongUser</span>
        </p>

        <div class="welcome-coupon-wrap">
          <div class="welcome-coupon">
            🎁 Tặng ngay <span class="coupon-pink">voucher giảm 20%</span><br/>
            khi hoàn tất đăng ký tài khoản mới!
          </div>
          <div class="coupon-tail"></div>
        </div>

        <div class="form-stack" style="margin-bottom:4px;">
          <div class="field-group">
            <label class="field-label">Số điện thoại đăng ký</label>
            <input id="reg-phone-input" class="gu-input" type="tel" placeholder="Nhập số điện thoại của bạn" value="${state.phone}" />
          </div>
          <button id="btn-reg-continue" class="gu-btn-primary">Tiếp tục đăng ký bằng SĐT</button>
        </div>

        <div class="or-divider">Hoặc đăng ký nhanh với</div>
        ${renderSocialButtons()}

        <div style="text-align:center;margin-top:16px;font-size:13px;color:rgba(255,255,255,0.7);">
          Bạn đã có tài khoản? <button id="btn-back-login-link" class="text-btn">Đăng nhập</button>
        </div>
      </div>`;
  } else if (state.screen === "register-terms") {
    html += `
      <div class="subscreen">
        <div class="subscreen-nav">
          <button class="back-btn" id="btn-back-register">${ICONS.back}</button>
          <span style="font-size:12.5px;font-weight:700;color:rgba(255,255,255,0.65);">Bước 1/3 • Đăng ký</span>
          <span style="width:36px"></span>
        </div>

        <h2 class="subscreen-title">Xác nhận số điện thoại đăng ký</h2>
        <p class="subscreen-subtitle">
          Hệ thống sẽ gửi mã OTP 6 chữ số đến số điện thoại <strong>${state.phone || "0987 768 189"}</strong> để tạo tài khoản GongUser mới.
        </p>

        <div class="form-stack">
          <input id="reg-terms-phone" class="gu-input" type="tel" value="${state.phone}" placeholder="Số điện thoại" />

          <div id="btn-toggle-terms" class="terms-check-row">
            <div class="terms-check-box ${state.agreedTerms ? "checked" : ""}">
              ${state.agreedTerms ? "✓" : ""}
            </div>
            <span>Tôi đồng ý với <strong>Điều khoản Dịch vụ</strong> &amp; <strong>Chính sách Quyền riêng tư</strong> của GongU365.</span>
          </div>

          <button id="btn-send-reg-otp" class="gu-btn-primary" ${!state.agreedTerms ? "disabled" : ""}>
            Gửi mã OTP đăng ký
          </button>
        </div>
      </div>`;
  } else if (state.screen === "phone-login") {
    html += `
      <div class="subscreen">
        <div class="subscreen-nav">
          <button class="back-btn" id="btn-back-welcome">${ICONS.back}</button>
          <span style="font-size:12.5px;font-weight:700;color:rgba(255,255,255,0.65);">Xác minh OTP</span>
          <span style="width:36px"></span>
        </div>

        <h2 class="subscreen-title">Đăng nhập bằng số điện thoại</h2>
        <p class="subscreen-subtitle">
          Áp dụng phương thức đăng nhập bằng số điện thoại giúp bạn có thể trải nghiệm chức năng mua sắm tốt hơn, tích điểm và nhận thông báo ưu đãi.
        </p>

        <div class="form-stack">
          <div class="field-group">
            <label class="field-label">Số điện thoại</label>
            <input id="phone-input" class="gu-input" type="tel" placeholder="VD: 0987 768 189" value="${state.phone}" />
          </div>
          <button id="btn-send-otp" class="gu-btn-primary">Gửi mã</button>
        </div>

        <div class="auth-spacer"></div>
        <div style="text-align:center;margin-top:16px;">
          <button class="text-btn" id="btn-other-method" style="color:rgba(255,255,255,0.65);">Sử dụng phương thức khác</button>
        </div>
      </div>`;
  } else if (state.screen === "otp-verify") {
    html += `
      <div class="subscreen">
        <div class="subscreen-nav">
          <button class="back-btn" id="btn-back-phone">${ICONS.back}</button>
          <span style="font-size:12.5px;font-weight:700;color:rgba(255,255,255,0.65);">Nhập mã OTP</span>
          <span style="width:36px"></span>
        </div>

        <h2 class="subscreen-title">Nhập mã xác minh OTP</h2>
        <p class="subscreen-subtitle">
          Mã gồm 6 chữ số đã được gửi tới số <strong>${state.phone || "0987 768 189"}</strong>.
        </p>

        <div class="otp-grid">
          ${state.otpDigits
            .map(
              (d, i) =>
                `<input class="otp-cell" maxlength="1" inputmode="numeric" data-otp-idx="${i}" value="${d}" />`
            )
            .join("")}
        </div>

        <div class="otp-helper-row">
          <button class="text-btn" id="btn-autofill-otp">Điền nhanh mã mẫu (123456)</button>
          <button class="text-btn" id="resend-otp-btn" ${state.otpCountdown > 0 ? "disabled" : ""}>
            ${state.otpCountdown > 0 ? `Gửi lại mã ${state.otpCountdown}s` : "Gửi lại mã"}
          </button>
        </div>

        <button id="btn-verify-otp" class="gu-btn-primary" ${state.otpDigits.join("").length < 6 ? "disabled" : ""}>
          Xác minh OTP
        </button>
      </div>`;
  } else if (state.screen === "profile-setup") {
    const p = state.profile;
    html += `
      <div class="subscreen">
        <div class="subscreen-nav">
          <button class="back-btn" id="btn-back-otp">${ICONS.back}</button>
          <span style="font-size:12.5px;font-weight:700;color:#52c41a;">✓ Xác minh thành công</span>
          <span style="width:36px"></span>
        </div>

        <h2 class="subscreen-title">Tiếp tục cài đặt</h2>
        <p class="subscreen-subtitle" style="margin-bottom:14px;">
          Hoàn thiện thông tin tài khoản và liên kết Email của bạn.
        </p>

        <div class="form-stack">
          <div class="field-group">
            <label class="field-label">ID tài khoản của bạn</label>
            <input id="pf-id" class="gu-input" value="${p.accountId}" placeholder="Nhập ID tài khoản" />
          </div>

          <div class="field-group">
            <label class="field-label">Mật khẩu</label>
            <div class="input-with-action">
              <input id="pf-pass" class="gu-input" type="${state.showPassword ? "text" : "password"}" value="${p.password}" placeholder="Nhập mật khẩu" />
              <button class="input-inline-action" id="btn-toggle-pass">${state.showPassword ? "Ẩn" : "Hiện"}</button>
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">Biệt danh của bạn</label>
            <input id="pf-nick" class="gu-input" value="${p.nickname}" placeholder="Nhập biệt danh" />
          </div>

          <div class="field-group">
            <label class="field-label">Ngày sinh của bạn</label>
            <div class="field-row-3">
              <input id="pf-day" class="gu-input" value="${p.day}" placeholder="Ngày" />
              <input id="pf-month" class="gu-input" value="${p.month}" placeholder="Tháng" />
              <input id="pf-year" class="gu-input" value="${p.year}" placeholder="Năm" />
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">Liên kết Email của bạn</label>
            <div class="input-with-action">
              <input id="pf-email" class="gu-input" type="email" value="${p.email}" placeholder="email@example.com" />
              <button class="input-inline-action" id="btn-send-email-code">Gửi mã</button>
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">Xác nhận Email</label>
            <div class="input-with-action">
              <input id="pf-email-otp" class="gu-input" maxlength="6" value="${p.emailOtp}" placeholder="Nhập mã gồm 6 chữ số" />
              <button class="input-inline-action" id="resend-email-btn" ${state.emailCodeSent && state.emailCountdown > 0 ? "disabled" : ""}>
                ${state.emailCodeSent && state.emailCountdown > 0 ? `Gửi lại mã ${state.emailCountdown}s` : "Mã mẫu: 686868"}
              </button>
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">Khu vực tài khoản của bạn</label>
            <select id="pf-country" class="gu-input">
              ${["Việt Nam", "Hàn Quốc", "Nhật Bản", "Singapore", "Hoa Kỳ"]
                .map(
                  (c) =>
                    `<option value="${c}" ${p.country === c ? "selected" : ""}>${c}</option>`
                )
                .join("")}
            </select>
          </div>

          ${state.profileError ? `<div class="field-error">${state.profileError}</div>` : ""}

          <button id="btn-complete-setup" class="gu-btn-primary" style="margin-top:6px;">
            HOÀN TẤT CÀI ĐẶT
          </button>
        </div>
      </div>`;
  } else if (state.screen === "voucher-success") {
    const userName = state.profile.nickname || "GongUser";
    html += `
      <div class="voucher-screen">
        <div style="width:68px;height:68px;border-radius:50%;background:#f6ffed;border:2px solid #52c41a;display:grid;place-items:center;font-size:30px;margin-bottom:14px;">
          🎉
        </div>
        <h2 style="font-size:21px;line-height:1.35;margin:0 0 8px;color:#ffffff;">
          Chúc mừng <span style="color:#eb2f96;">${userName}</span><br/>nhận Voucher GongU365 thành công!!
        </h2>
        <p style="font-size:13.5px;color:rgba(255,255,255,0.68);margin:0;">
          Đăng nhập qua <strong style="color:#ffffff;">${state.session.provider || "GongU365"}</strong> thành công.
        </p>

        <div class="voucher-card">
          <span class="voucher-tag">ĐẶC QUYỀN GONGUSER MỚI</span>
          <div class="voucher-value">GIẢM 20%</div>
          <p class="voucher-desc">Áp dụng cho đơn hàng đầu tiên trên GongU365</p>
        </div>

        <button id="btn-continue-shopping" class="gu-btn-primary">
          Tiếp tục mua sắm
        </button>
        <button id="btn-restart-demo" class="text-btn" style="margin-top:16px;color:rgba(255,255,255,0.65);">
          Đăng xuất / Thử luồng khác
        </button>
      </div>`;
  } else if (state.screen === "home") {
    html += `
      <div class="app-topbar">
        <div style="display:flex;align-items:center;gap:8px;color:#000;">
          ${ICONS.cartLogo}
          <span style="font-family:var(--gu-font-display);font-weight:800;font-size:18px;">GongU365</span>
        </div>
        <button id="btn-logout" class="text-btn" style="color:#000;font-size:12.5px;">Đăng xuất</button>
      </div>
      <div class="subscreen" style="padding-top:18px;">
        <div class="product-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <span style="font-size:12px;font-weight:700;color:#eb2f96;">BEAUTY REVIEW • HOT</span>
            <span style="font-size:12px;color:rgba(255,255,255,0.65);">${state.session.phoneVerified ? "✅ Đã xác minh SĐT" : "🔓 Social Login"}</span>
          </div>
          <h3 style="margin:0 0 6px;font-size:16px;">Serum Dưỡng Ẩm Phục Hồi GongU</h3>
          <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.65);line-height:1.45;">
            Đánh giá 4.9★ từ 1.240 GongUser. Trải nghiệm thử thao tác tương tác hoặc mua sắm bên dưới:
          </p>
          <div class="action-row">
            <button id="act-like" class="btn-outline">❤️ Thả tim</button>
            <button id="act-buy" class="gu-btn-primary" style="height:42px;">🛍️ Mua hàng</button>
          </div>
        </div>
      </div>`;
  } else if (state.screen === "email-login") {
    html += `
      <div class="subscreen">
        <div class="subscreen-nav">
          <button class="back-btn" id="btn-back-welcome">${ICONS.back}</button>
          <span style="font-size:12.5px;font-weight:700;color:rgba(255,255,255,0.65);">Email / ID</span>
          <span style="width:36px"></span>
        </div>
        <h2 class="subscreen-title">Đăng nhập bằng Email / ID</h2>
        <p class="subscreen-subtitle">Nhập Email hoặc Tên người dùng đã đăng ký trước đó.</p>
        <div class="form-stack">
          <div class="field-group">
            <label class="field-label">Email hoặc ID tài khoản</label>
            <input class="gu-input" placeholder="Email hoặc ID tài khoản" value="${state.profile.email}" />
          </div>
          <div class="field-group">
            <label class="field-label">Mật khẩu</label>
            <input class="gu-input" type="password" placeholder="Mật khẩu" value="12345678" />
          </div>
          <div style="text-align:right;">
            <button id="goto-forgot-from-email" class="text-btn">Quên mật khẩu?</button>
          </div>
          <button id="btn-email-signin" class="gu-btn-primary">Đăng nhập</button>
        </div>
      </div>`;
  } else if (state.screen === "support") {
    html += `
      <div class="subscreen">
        <div class="subscreen-nav">
          <button class="back-btn" id="btn-back-welcome">${ICONS.back}</button>
          <span style="font-size:12.5px;font-weight:700;color:rgba(255,255,255,0.65);">Quên mật khẩu</span>
          <span style="width:36px"></span>
        </div>
        <h2 class="subscreen-title">Khôi phục mật khẩu</h2>
        <p class="subscreen-subtitle">Nhập Email hoặc Số điện thoại đã đăng ký để nhận mã đặt lại mật khẩu.</p>
        <div class="form-stack" style="margin-bottom:18px;">
          <div class="field-group">
            <label class="field-label">Email hoặc Số điện thoại</label>
            <input class="gu-input" placeholder="VD: nhungbui@gmail.com" value="${state.profile.email}" />
          </div>
          <button id="btn-send-recovery" class="gu-btn-primary">Gửi mã khôi phục</button>
        </div>
        <div style="background:#141414;border:1px solid rgba(255,255,255,0.14);border-radius:12px;padding:14px;font-size:13.5px;line-height:1.7;color:#ffffff;">
          <strong>Trung tâm hỗ trợ GongU365</strong><br/>
          Hotline: <strong>1900 365 365</strong><br/>Email: <strong>support@gongu365.vn</strong>
        </div>
      </div>`;
  }

  if (state.authModal?.type === "apple") {
    html += `
      <div class="phone-overlay" id="modal-backdrop">
        <div class="apple-sheet">
          <div class="apple-sheet-head">
            <span class="apple-sheet-title">Đăng nhập bằng Apple</span>
            <button class="apple-close" id="modal-close">✕</button>
          </div>
          <div class="apple-app-row">
            <div class="auth-logo-mark" style="width:44px;height:44px;border-radius:11px;background:#000;color:#fff;">${ICONS.cartLogo}</div>
            <div class="apple-app-desc">Đăng nhập vào GongU365 bằng Tài khoản Apple của bạn.</div>
          </div>
          <div class="apple-account-card">
            <div class="apple-avatar">NB</div>
            <div>
              <div style="font-weight:700;font-size:14.5px;color:#000;">Nhung Bùi</div>
              <div style="font-size:12.5px;color:#737373;">Tài khoản của bạn</div>
            </div>
          </div>
          <button class="apple-signin-cta" id="modal-confirm">Đăng nhập</button>
        </div>
      </div>`;
  } else if (state.authModal?.type === "oauth") {
    html += `
      <div class="phone-overlay center" id="modal-backdrop">
        <div class="ios-alert">
          <p class="ios-alert-title">“GongU365” muốn sử dụng “${state.authModal.domain}” để đăng nhập</p>
          <p class="ios-alert-body">Việc này cho phép ứng dụng và trang web chia sẻ thông tin về bạn</p>
          <div class="ios-alert-actions">
            <button class="ios-alert-btn" id="modal-close">Huỷ</button>
            <button class="ios-alert-btn confirm" id="modal-confirm">Tiếp tục</button>
          </div>
        </div>
      </div>`;
  }

  root.innerHTML = html;
  bindEvents();
}

function bindEvents() {
  const qs = (id) => document.getElementById(id);

  qs("quick-phone-input")?.addEventListener("input", (e) => (state.phone = e.target.value));
  qs("quick-phone-submit")?.addEventListener("click", () => navigateTo("phone-login"));

  qs("goto-register")?.addEventListener("click", () => navigateTo("register"));
  qs("btn-back-login-link")?.addEventListener("click", () => navigateTo("welcome"));
  qs("reg-phone-input")?.addEventListener("input", (e) => (state.phone = e.target.value));
  qs("btn-reg-continue")?.addEventListener("click", () => navigateTo("register-terms"));
  qs("btn-back-register")?.addEventListener("click", () => navigateTo("register"));
  qs("reg-terms-phone")?.addEventListener("input", (e) => (state.phone = e.target.value));
  qs("btn-toggle-terms")?.addEventListener("click", () => {
    state.agreedTerms = !state.agreedTerms;
    render();
  });
  qs("btn-send-reg-otp")?.addEventListener("click", () => navigateTo("otp-verify"));

  document.querySelectorAll(".social-btn[data-provider]").forEach((btn) => {
    btn.addEventListener("click", () => openSocialAuth(btn.dataset.provider));
  });

  qs("toggle-faceid")?.addEventListener("click", () => {
    state.faceIdEnabled = !state.faceIdEnabled;
    render();
  });

  qs("goto-email-login")?.addEventListener("click", () => navigateTo("email-login"));
  qs("goto-forgot")?.addEventListener("click", () => navigateTo("support"));
  qs("goto-support")?.addEventListener("click", () => navigateTo("support"));
  qs("goto-forgot-from-email")?.addEventListener("click", () => navigateTo("support"));

  qs("btn-send-recovery")?.addEventListener("click", () => {
    showToast("✉️ Đã gửi mã khôi phục về Email/SĐT của bạn!");
  });

  qs("btn-back-welcome")?.addEventListener("click", () => navigateTo("welcome"));
  qs("btn-other-method")?.addEventListener("click", () => navigateTo("welcome"));
  qs("btn-back-phone")?.addEventListener("click", () => navigateTo("phone-login"));
  qs("btn-back-otp")?.addEventListener("click", () => navigateTo("otp-verify"));

  qs("phone-input")?.addEventListener("input", (e) => (state.phone = e.target.value));
  qs("btn-send-otp")?.addEventListener("click", () => {
    if (!state.phone.trim()) state.phone = "0987 768 189";
    navigateTo("otp-verify");
  });

  document.querySelectorAll(".otp-cell").forEach((cell) => {
    cell.addEventListener("input", (e) => {
      const idx = Number(cell.dataset.otpIdx);
      const val = e.target.value.replace(/\D/g, "").slice(-1);
      state.otpDigits[idx] = val;
      cell.value = val;
      if (val && idx < 5) {
        document.querySelector(`.otp-cell[data-otp-idx="${idx + 1}"]`)?.focus();
      }
      const verifyBtn = qs("btn-verify-otp");
      if (verifyBtn) verifyBtn.disabled = state.otpDigits.join("").length < 6;
    });
  });

  qs("btn-autofill-otp")?.addEventListener("click", () => {
    state.otpDigits = ["1", "2", "3", "4", "5", "6"];
    render();
  });

  qs("resend-otp-btn")?.addEventListener("click", () => {
    startOtpTimer();
    render();
  });

  qs("btn-verify-otp")?.addEventListener("click", () => {
    state.session.loggedIn = true;
    state.session.phoneVerified = true;
    state.session.provider = state.session.provider || "OTP SĐT";
    navigateTo("profile-setup");
  });

  qs("btn-toggle-pass")?.addEventListener("click", () => {
    state.showPassword = !state.showPassword;
    render();
  });

  qs("btn-send-email-code")?.addEventListener("click", () => {
    startEmailTimer();
    render();
  });

  qs("resend-email-btn")?.addEventListener("click", () => {
    state.profile.emailOtp = "686868";
    render();
  });

  qs("pf-id")?.addEventListener("input", (e) => (state.profile.accountId = e.target.value));
  qs("pf-pass")?.addEventListener("input", (e) => (state.profile.password = e.target.value));
  qs("pf-nick")?.addEventListener("input", (e) => (state.profile.nickname = e.target.value));
  qs("pf-day")?.addEventListener("input", (e) => (state.profile.day = e.target.value));
  qs("pf-month")?.addEventListener("input", (e) => (state.profile.month = e.target.value));
  qs("pf-year")?.addEventListener("input", (e) => (state.profile.year = e.target.value));
  qs("pf-email")?.addEventListener("input", (e) => (state.profile.email = e.target.value));
  qs("pf-email-otp")?.addEventListener("input", (e) => (state.profile.emailOtp = e.target.value));
  qs("pf-country")?.addEventListener("change", (e) => (state.profile.country = e.target.value));

  qs("btn-complete-setup")?.addEventListener("click", () => {
    if (!state.profile.nickname.trim() || !state.profile.email.trim()) {
      state.profileError = "Vui lòng điền đầy đủ Biệt danh và Email liên kết.";
      render();
      return;
    }
    state.profileError = "";
    state.session.emailVerified = true;
    state.session.voucherClaimed = true;
    navigateTo("voucher-success");
  });

  qs("btn-continue-shopping")?.addEventListener("click", () => navigateTo("home"));
  qs("btn-restart-demo")?.addEventListener("click", resetFlow);
  qs("btn-logout")?.addEventListener("click", resetFlow);

  qs("act-like")?.addEventListener("click", () => showToast("❤️ Đã thả tim sản phẩm!"));
  qs("act-buy")?.addEventListener("click", () => {
    if (!state.session.phoneVerified) {
      state.pendingAction = { label: "Mua hàng", requireOtp: true };
      showToast("Mua hàng yêu cầu xác minh OTP Số điện thoại");
      navigateTo("phone-login");
    } else {
      showToast("🛍️ Đã thêm vào giỏ hàng (Đã xác minh OTP)!");
    }
  });

  qs("btn-email-signin")?.addEventListener("click", () => {
    state.session.loggedIn = true;
    state.session.provider = "Email / ID";
    state.session.emailVerified = true;
    state.session.voucherClaimed = true;
    navigateTo("voucher-success");
  });

  qs("modal-close")?.addEventListener("click", () => {
    state.authModal = null;
    render();
  });

  qs("modal-confirm")?.addEventListener("click", () => {
    if (state.authModal) completeSocialAuth(state.authModal.provider);
  });
}

document.addEventListener("DOMContentLoaded", render);
