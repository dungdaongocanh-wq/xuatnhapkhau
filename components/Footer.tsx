import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="text-white mt-auto"
      style={{ backgroundColor: "#0d4a6b" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-lg font-bold mb-3">📦 Về chúng tôi</h3>
            <p className="text-blue-200 text-sm leading-relaxed">
              Thư Viện Xuất Nhập Khẩu là nền tảng tra cứu văn bản pháp lý, HS
              Code và biểu thuế xuất nhập khẩu Việt Nam.
            </p>
          </div>

          {/* Column 2: Quick links */}
          <div>
            <h3 className="text-lg font-bold mb-3">🔗 Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/tra-cuu-van-ban"
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  Tra cứu văn bản
                </Link>
              </li>
              <li>
                <Link
                  href="/tra-cuu-hs-code"
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  Tra cứu HS Code
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-lg font-bold mb-3">📞 Liên hệ</h3>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li>📧 contact@thuvienvxnk.vn</li>
              <li>🌐 thuvienxuatnhapkhau.vn</li>
              <li>📍 Việt Nam</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-blue-800 text-center text-blue-300 text-sm">
          © 2025 Thư Viện Xuất Nhập Khẩu. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
