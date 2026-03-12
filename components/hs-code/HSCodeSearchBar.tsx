"use client";

import { useState, KeyboardEvent } from "react";

interface Props {
  onSearch: (query: string, type: string) => void;
  isLoading: boolean;
}

type SearchType = "all" | "code" | "name";

export default function HSCodeSearchBar({ onSearch, isLoading }: Props) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("all");

  const handleSearch = () => {
    onSearch(query.trim(), searchType);
  };

  const handleClear = () => {
    setQuery("");
    setSearchType("all");
    onSearch("", "all");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const searchTypes: { value: SearchType; label: string }[] = [
    { value: "all", label: "Tất cả" },
    { value: "code", label: "Theo mã HS" },
    { value: "name", label: "Theo tên hàng" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        🔍 Tìm kiếm HS Code
      </h2>

      {/* Search type selector */}
      <div className="flex flex-wrap gap-3 mb-4">
        {searchTypes.map((type) => (
          <label
            key={type.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name="searchType"
              value={type.value}
              checked={searchType === type.value}
              onChange={() => setSearchType(type.value)}
              className="accent-[#0d4a6b]"
            />
            <span className="text-sm text-gray-700 font-medium">
              {type.label}
            </span>
          </label>
        ))}
      </div>

      {/* Search input */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            searchType === "code"
              ? "Nhập mã HS Code... (vd: 0102, 01022100)"
              : searchType === "name"
              ? "Nhập tên hàng hoá... (vd: Bò thiến, Ngựa giống)"
              : "Nhập mã HS Code hoặc tên hàng hoá..."
          }
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d4a6b] focus:border-transparent"
          disabled={isLoading}
        />

        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-6 py-3 bg-[#e67e22] text-white rounded-lg font-semibold text-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isLoading ? "⏳ Đang tìm..." : "🔍 Tìm kiếm"}
          </button>

          <button
            onClick={handleClear}
            disabled={isLoading}
            className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-300 transition-colors disabled:opacity-50"
            title="Xóa tìm kiếm"
          >
            ✕ Xóa
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-400">
        Hỗ trợ tìm kiếm theo mã HS Code (gần đúng) và tên hàng hoá tiếng Việt
      </p>
    </div>
  );
}
