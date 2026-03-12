"use client";

import { useEffect } from "react";

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
  item: HsCode | null;
  isOpen: boolean;
  onClose: () => void;
}

interface TaxField {
  label: string;
  value: string | null | undefined;
}

function TaxBadge({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
      <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
      <p className="text-base font-bold text-[#0d4a6b]">
        {value ?? <span className="text-gray-300 font-normal">—</span>}
      </p>
    </div>
  );
}

export default function HSCodeDetailModal({ item, isOpen, onClose }: Props) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const importTaxes: TaxField[] = [
    { label: "NK Thông thường", value: item.nkTt },
    { label: "NK Ưu đãi (MFN)", value: item.nkUuDai },
    { label: "VAT", value: item.vat },
    { label: "ACFTA", value: item.acfta },
    { label: "ATIGA", value: item.atiga },
    { label: "AiCEP", value: item.aicep },
    { label: "VJEPA", value: item.vjepa },
    { label: "AKFTA", value: item.akfta },
    { label: "AANZFTA", value: item.aanzfta },
    { label: "AIFTA", value: item.aifta },
    { label: "VKFTA", value: item.vkfta },
    { label: "VCFTA", value: item.vcfta },
    { label: "VNEAEU", value: item.vneaeu },
    { label: "CPTPP", value: item.cptpp },
    { label: "AHKFTA", value: item.ahkfta },
    { label: "VNCU", value: item.vncu },
    { label: "EVFTA", value: item.evfta },
    { label: "UKVFTA", value: item.ukvfta },
    { label: "VIFTA", value: item.vifta },
  ];

  const exportTaxes: TaxField[] = [
    { label: "XK", value: item.xk },
    { label: "XK CP TPP", value: item.xkCpTpp },
    { label: "XK EV", value: item.xkEv },
    { label: "XK UKV", value: item.xkUkv },
  ];

  const otherTaxes: TaxField[] = [
    { label: "TT ĐB", value: item.ttDb },
    { label: "Thuế BV MT", value: item.thueBvMt },
    { label: "Giảm VAT", value: item.giamVat },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-start justify-between p-5 rounded-t-2xl text-white"
            style={{ background: "linear-gradient(135deg, #0d4a6b, #1a5276)" }}
          >
            <div>
              <p className="text-blue-200 text-sm mb-1">Mã hàng</p>
              <h2 className="text-2xl font-bold font-mono">{item.maHang}</h2>
              {item.moTaViet && (
                <p className="text-blue-100 mt-1 text-sm">{item.moTaViet}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white ml-4 mt-1 p-1 rounded-lg hover:bg-white/20 transition-colors flex-shrink-0"
              aria-label="Đóng"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Basic info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 font-medium mb-1">
                  Đơn vị tính
                </p>
                <p className="font-semibold text-gray-800">
                  {item.donViTinh ?? "—"}
                </p>
              </div>
              {item.chinhSachMatHang && (
                <div className="col-span-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-amber-700 font-medium mb-1">
                    📋 Chính sách mặt hàng
                  </p>
                  <p className="text-sm text-gray-700">
                    {item.chinhSachMatHang}
                  </p>
                </div>
              )}
            </div>

            {/* Import taxes */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                  Nhập khẩu
                </span>
                Thuế suất nhập khẩu
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {importTaxes.map((tax) => (
                  <TaxBadge key={tax.label} label={tax.label} value={tax.value} />
                ))}
              </div>
            </div>

            {/* Export taxes */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                  Xuất khẩu
                </span>
                Thuế suất xuất khẩu
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {exportTaxes.map((tax) => (
                  <TaxBadge key={tax.label} label={tax.label} value={tax.value} />
                ))}
              </div>
            </div>

            {/* Other taxes */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs">
                  Khác
                </span>
                Thuế khác
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {otherTaxes.map((tax) => (
                  <TaxBadge key={tax.label} label={tax.label} value={tax.value} />
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 pb-5">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-[#0d4a6b] text-white rounded-lg font-semibold hover:bg-[#1a5276] transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
