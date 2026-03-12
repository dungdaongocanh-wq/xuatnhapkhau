"use client";

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

interface Props {
  data: HsCode[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRowClick: (item: HsCode) => void;
  searchQuery: string;
  isLoading: boolean;
}

// Highlight search term in text
function highlight(text: string | null, query: string): React.ReactNode {
  if (!text || !query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i}>{part}</mark>
    ) : (
      part
    )
  );
}

// Skeleton row
function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 13 }).map((_, i) => (
        <td key={i} className="px-3 py-2 border border-gray-200">
          <div className="skeleton h-4 w-full" style={{ minWidth: 40 }} />
        </td>
      ))}
    </tr>
  );
}

const columns = [
  { key: "maHang", label: "Mã hàng", width: "w-28" },
  { key: "moTaViet", label: "Mô tả hàng hoá", width: "w-64" },
  { key: "donViTinh", label: "ĐVT", width: "w-20" },
  { key: "nkTt", label: "NK TT", width: "w-16" },
  { key: "nkUuDai", label: "NK Ưu đãi", width: "w-20" },
  { key: "vat", label: "VAT", width: "w-16" },
  { key: "acfta", label: "ACFTA", width: "w-16" },
  { key: "atiga", label: "ATIGA", width: "w-16" },
  { key: "vjepa", label: "VJEPA", width: "w-16" },
  { key: "evfta", label: "EVFTA", width: "w-16" },
  { key: "cptpp", label: "CPTPP", width: "w-16" },
  { key: "xk", label: "XK", width: "w-16" },
  { key: "chinhSachMatHang", label: "Chính sách", width: "w-40" },
];

export default function HSCodeTable({
  data,
  total,
  page,
  totalPages,
  onPageChange,
  onRowClick,
  searchQuery,
  isLoading,
}: Props) {
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return (
      <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
        <p className="text-sm text-gray-500">
          Trang <strong>{page}</strong> / <strong>{totalPages}</strong>
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-100 transition-colors"
          >
            ← Trước
          </button>

          {pages.map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p as number)}
                className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                  p === page
                    ? "bg-[#0d4a6b] text-white border-[#0d4a6b]"
                    : "hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-100 transition-colors"
          >
            Tiếp →
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Results count */}
      {!isLoading && (
        <p className="text-sm text-gray-600 mb-3">
          Tìm thấy{" "}
          <strong className="text-[#0d4a6b]">{total.toLocaleString()}</strong>{" "}
          kết quả
          {searchQuery && (
            <>
              {" "}
              cho &ldquo;
              <strong>{searchQuery}</strong>&rdquo;
            </>
          )}
        </p>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="hs-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={col.width}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              : data.map((item) =>
                  item.isHeader ? (
                    <tr key={item.id} className="is-header">
                      <td className="px-3 py-2 border border-gray-200 font-bold text-gray-700">
                        {item.maHang}
                      </td>
                      <td
                        colSpan={12}
                        className="px-3 py-2 border border-gray-200 font-bold text-gray-700"
                      >
                        {item.moTaViet}
                      </td>
                    </tr>
                  ) : (
                    <tr
                      key={item.id}
                      onClick={() => onRowClick(item)}
                      className="cursor-pointer hover:bg-blue-50"
                    >
                      <td className="px-3 py-2 border border-gray-200 font-mono font-semibold text-[#0d4a6b]">
                        {highlight(item.maHang, searchQuery)}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 max-w-xs">
                        <div className="line-clamp-2">
                          {highlight(item.moTaViet, searchQuery)}
                        </div>
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-center text-xs">
                        {item.donViTinh}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-center">
                        {item.nkTt ?? "—"}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-center">
                        {item.nkUuDai ?? "—"}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-center">
                        {item.vat ?? "—"}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-center">
                        {item.acfta ?? "—"}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-center">
                        {item.atiga ?? "—"}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-center">
                        {item.vjepa ?? "—"}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-center">
                        {item.evfta ?? "—"}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-center">
                        {item.cptpp ?? "—"}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-center">
                        {item.xk ?? "—"}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-xs max-w-xs">
                        <div className="line-clamp-2">
                          {item.chinhSachMatHang ?? "—"}
                        </div>
                      </td>
                    </tr>
                  )
                )}

            {!isLoading && data.length === 0 && (
              <tr>
                <td
                  colSpan={13}
                  className="text-center py-10 text-gray-400 text-sm"
                >
                  Không tìm thấy kết quả phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
}
