import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="py-20 px-4 text-white text-center"
        style={{
          background: "linear-gradient(135deg, #0d4a6b 0%, #1a5276 100%)",
        }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          📦 Thư Viện Xuất Nhập Khẩu
        </h1>
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
          Tra cứu văn bản pháp lý, thủ tục hải quan và biểu thuế xuất nhập
          khẩu Việt Nam
        </p>
      </section>

      {/* Navigation Cards */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
            Chọn tính năng bạn cần
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Tra cứu văn bản */}
            <Link href="/tra-cuu-van-ban">
              <div className="bg-white rounded-xl border-2 border-blue-200 p-8 hover:border-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
                <div className="text-5xl mb-4">📄</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Tra cứu Văn bản
                </h3>
                <p className="text-gray-500 text-sm">
                  Tìm kiếm văn bản pháp lý, thông tư, nghị định liên quan đến
                  xuất nhập khẩu
                </p>
              </div>
            </Link>

            {/* Card 2: Tra cứu HS Code */}
            <Link href="/tra-cuu-hs-code">
              <div className="bg-white rounded-xl border-2 border-blue-200 p-8 hover:border-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer h-full relative">
                <span className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Mới
                </span>
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Tra cứu HS Code
                </h3>
                <p className="text-gray-500 text-sm">
                  Tra cứu mã hàng hoá HS Code, biểu thuế xuất nhập khẩu theo
                  các hiệp định FTA
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
