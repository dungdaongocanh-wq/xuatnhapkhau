/**
 * Script to import HS Code data from Excel file into PostgreSQL database.
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/import-excel.ts --file=./data/hs-code.xlsx
 */

import * as XLSX from "xlsx";
import * as path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Parse CLI arguments
function getArg(name: string): string | undefined {
  const prefix = `--${name}=`;
  const arg = process.argv.find((a) => a.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : undefined;
}

// Check if a string looks like a numeric HS code (contains at least one digit)
function isNumericCode(value: string): boolean {
  return /\d/.test(value);
}

// Safely get a string value from a cell
function cellValue(row: string[], key: number): string | undefined {
  const val = row[key];
  if (val === undefined || val === null || val === "") return undefined;
  return String(val).trim() || undefined;
}

async function importExcel(filePath: string) {
  console.log(`Reading file: ${filePath}`);

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Convert to array of arrays (raw)
  const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    raw: false,
  });

  console.log(`Total rows in sheet: ${rows.length}`);

  let imported = 0;
  let skipped = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i] as string[];

    // Skip empty rows
    if (!row || row.length === 0) {
      skipped++;
      continue;
    }

    // Column mapping (0-indexed):
    // col 1 (B) = maHang, col 2 (C) = moTaViet, col 3 (D) = donViTinh
    // col 4 (1) = nkTt, col 5 (2) = nkUuDai, col 6 (3) = vat
    // col 7 (4) = acfta, col 8 (5) = atiga, col 9 (6) = aicep
    // col 10 (7) = vjepa, col 11 (8) = akfta, col 12 (9) = aanzfta
    // col 13 (10) = aifta, col 14 (11) = vkfta, col 15 (12) = vcfta
    // col 16 (13) = vneaeu, col 17 (14) = cptpp, col 18 (15) = ahkfta
    // col 19 (16) = vncu, col 20 (17) = evfta, col 21 (18) = ukvfta
    // col 22 (19) = vifta
    // col 30 (27) = ttDb, col 31 (28) = xk, col 32 (29) = xkCpTpp
    // col 33 (30) = xkEv, col 34 (31) = xkUkv, col 35 (32) = thueBvMt
    // col 5 (F) = chinhSachMatHang, col 6 (G) = giamVat

    const maHangRaw = row[1] ? String(row[1]).trim() : "";
    const moTaViet = row[2] ? String(row[2]).trim() : "";

    // Skip header rows that contain column labels
    const headerKeywords = ["mã hàng", "b", "c", "d", "hàng hóa", "heading"];
    if (
      headerKeywords.some(
        (kw) =>
          maHangRaw.toLowerCase() === kw ||
          moTaViet.toLowerCase().includes("mô tả hàng")
      )
    ) {
      skipped++;
      continue;
    }

    // Skip rows with no meaningful data
    if (!maHangRaw && !moTaViet) {
      skipped++;
      continue;
    }

    // Determine if this is a header/group row
    const isHeader = !maHangRaw || !isNumericCode(maHangRaw);

    const maHang = maHangRaw || moTaViet.slice(0, 20);

    try {
      await prisma.hsCode.create({
        data: {
          maHang: maHang.slice(0, 20),
          moTaViet: moTaViet || undefined,
          donViTinh: row[3] ? String(row[3]).trim().slice(0, 50) || undefined : undefined,
          nkTt: cellValue(row, 4),
          nkUuDai: cellValue(row, 5),
          vat: cellValue(row, 6),
          acfta: cellValue(row, 7),
          atiga: cellValue(row, 8),
          aicep: cellValue(row, 9),
          vjepa: cellValue(row, 10),
          akfta: cellValue(row, 11),
          aanzfta: cellValue(row, 12),
          aifta: cellValue(row, 13),
          vkfta: cellValue(row, 14),
          vcfta: cellValue(row, 15),
          vneaeu: cellValue(row, 16),
          cptpp: cellValue(row, 17),
          ahkfta: cellValue(row, 18),
          vncu: cellValue(row, 19),
          evfta: cellValue(row, 20),
          ukvfta: cellValue(row, 21),
          vifta: cellValue(row, 22),
          ttDb: cellValue(row, 30),
          xk: cellValue(row, 31),
          xkCpTpp: cellValue(row, 32),
          xkEv: cellValue(row, 33),
          xkUkv: cellValue(row, 34),
          thueBvMt: cellValue(row, 35),
          chinhSachMatHang: row[5] ? String(row[5]).trim() || undefined : undefined,
          giamVat: row[6] ? String(row[6]).trim().slice(0, 20) || undefined : undefined,
          isHeader,
        },
      });
      imported++;
      if (imported % 500 === 0) {
        console.log(`Imported ${imported} records...`);
      }
    } catch (err) {
      console.error(`Row ${i + 1} error:`, err);
      skipped++;
    }
  }

  console.log(`\nImport complete!`);
  console.log(`  Imported: ${imported}`);
  console.log(`  Skipped:  ${skipped}`);
}

const filePath = getArg("file");
if (!filePath) {
  console.error("Error: Please provide --file=path/to/file.xlsx");
  process.exit(1);
}

const resolvedPath = path.resolve(filePath);

importExcel(resolvedPath)
  .catch((e) => {
    console.error("Import failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
