import Link from "next/link";

export const metadata = {
  title: "Tra cứu Văn bản Pháp lý | Thư Viện Xuất Nhập Khẩu",
};

export default function TraCuuVanBanPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 bg-gray-50">
      <div className="text-6xl mb-6">🚧</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-3">
        Tra cứu Văn bản Pháp lý
      </h1>
      <p className="text-gray-500 text-lg mb-6 text-center max-w-md">
        Tính năng đang được phát triển. Vui lòng quay lại sau!
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#0d4a6b] text-white rounded-lg hover:bg-[#1a5276] transition-colors"
      >
        ← Quay về trang chủ
      </Link>
    </div>
  );
}
