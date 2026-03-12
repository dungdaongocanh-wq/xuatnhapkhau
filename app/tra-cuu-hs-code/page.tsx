"use client";

import { useState, useCallback } from "react";
import HSCodeSearchBar from "@/components/hs-code/HSCodeSearchBar";
import HSCodeTable from "@/components/hs-code/HSCodeTable";
import HSCodeDetailModal from "@/components/hs-code/HSCodeDetailModal";

interface HsCode {
  id: number;
  maHang: string;
  moTaViet: string | null;
  donViTinh: string | null;
  nkTt: string | null;
  nkUuDai: string | null;
  vat: string | null;
  acfta: string | null;
  atiga: string | null;
  aicep: string | null;
  vjepa: string | null;
  akfta: string | null;
  aanzfta: string | null;
  aifta: string | null;
  vkfta: string | null;
  vcfta: string | null;
  vneaeu: string | null;
  cptpp: string | null;
  ahkfta: string | null;
  vncu: string | null;
  evfta: string | null;
  ukvfta: string | null;
  vifta: string | null;
  ttDb: string | null;
  xk: string | null;
  xkCpTpp: string | null;
  xkEv: string | null;
  xkUkv: string | null;
  thueBvMt: string | null;
  chinhSachMatHang: string | null;
  giamVat: string | null;
  isHeader: boolean;
}

interface ApiResponse {
  data: HsCode[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function TraCuuHsCodePage() {
  const [data, setData] = useState<HsCode[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HsCode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchData = useCallback(
    async (query: string, type: string, page: number) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          q: query,
          type,
          page: String(page),
          limit: "50",
        });
        const res = await fetch(`/api/hs-code?${params.toString()}`);
        if (!res.ok) throw new Error("Lỗi tải dữ liệu");
        const json: ApiResponse = await res.json();
        setData(json.data);
        setTotal(json.total);
        setCurrentPage(json.page);
        setTotalPages(json.totalPages);
        setHasSearched(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleSearch = (query: string, type: string) => {
    setSearchQuery(query);
    setSearchType(type);
    setCurrentPage(1);
    fetchData(query, type, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchData(searchQuery, searchType, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRowClick = (item: HsCode) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div
        className="py-10 px-4 text-white"
        style={{
          background: "linear-gradient(135deg, #0d4a6b 0%, #1a5276 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            🔍 Tra cứu HS Code — Biểu thuế xuất nhập khẩu
          </h1>
          <p className="text-blue-100">
            Tra cứu mã hàng hoá HS Code, thuế suất nhập khẩu, xuất khẩu và các
            hiệp định FTA (EVFTA, CPTPP, ACFTA, ATIGA...)
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <HSCodeSearchBar onSearch={handleSearch} isLoading={isLoading} />

        {/* Results */}
        {hasSearched && (
          <div className="mt-6">
            <HSCodeTable
              data={data}
              total={total}
              page={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onRowClick={handleRowClick}
              searchQuery={searchQuery}
              isLoading={isLoading}
            />
          </div>
        )}

        {!hasSearched && (
          <div className="mt-10 text-center text-gray-400">
            <div className="text-5xl mb-3">📋</div>
            <p className="text-lg">
              Nhập mã HS Code hoặc tên hàng hoá để bắt đầu tra cứu
            </p>
            <p className="text-sm mt-2">
              Ví dụ: <strong>0102</strong>, <strong>Bò thiến</strong>,{" "}
              <strong>01022100</strong>
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <HSCodeDetailModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
