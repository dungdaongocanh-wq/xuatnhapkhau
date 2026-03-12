/**
 * Script to import HS Code data from Excel file into PostgreSQL database.
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/import-excel.ts --file=./data/hs-code.xlsx
 *
 * Expected column structure (0-indexed from left; ExcelJS getCell uses 1-indexed):
 *
 *   0-idx  ExcelJS  Content
 *   -----  -------  -------
 *     0      1      col A  — unused (section number / row label)
 *     1      2      col B  → maHang
 *     2      3      col C  → moTaViet
 *     3      4      col D  → donViTinh
 *     4      5      tax header "(1)"  → nkTt
 *     5      6      tax header "(2)"  → nkUuDai
 *     6      7      tax header "(3)"  → vat
 *     7      8      tax header "(4)"  → acfta
 *     8      9      tax header "(5)"  → atiga
 *     9     10      tax header "(6)"  → aicep
 *    10     11      tax header "(7)"  → vjepa
 *    11     12      tax header "(8)"  → akfta
 *    12     13      tax header "(9)"  → aanzfta
 *    13     14      tax header "(10)" → aifta
 *    14     15      tax header "(11)" → vkfta
 *    15     16      tax header "(12)" → vcfta
 *    16     17      tax header "(13)" → vneaeu
 *    17     18      tax header "(14)" → cptpp
 *    18     19      tax header "(15)" → ahkfta
 *    19     20      tax header "(16)" → vncu
 *    20     21      tax header "(17)" → evfta
 *    21     22      tax header "(18)" → ukvfta
 *    22     23      tax header "(19)" → vifta
 *  23-29  24-30     tax headers "(20)"–"(26)" — unused
 *    30     31      tax header "(27)" → ttDb
 *    31     32      tax header "(28)" → xk
 *    32     33      tax header "(29)" → xkCpTpp
 *    33     34      tax header "(30)" → xkEv
 *    34     35      tax header "(31)" → xkUkv
 *    35     36      tax header "(32)" → thueBvMt
 *    36     37      spreadsheet header "F" → chinhSachMatHang
 *    37     38      spreadsheet header "G" → giamVat
 *
 * Note: "spreadsheet header F/G" refers to the column's header label in the data
 * table (a letter label printed in the header row), NOT the Excel column letter.
 */

import ExcelJS from "exceljs";
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

// Safely extract a trimmed string from an ExcelJS Cell value
function cellText(cell: ExcelJS.Cell): string {
  const v = cell.value;
  if (v === null || v === undefined) return "";
  if (typeof v === "object" && "richText" in v) {
    return (v as ExcelJS.CellRichTextValue).richText
      .map((r) => r.text)
      .join("")
      .trim();
  }
  return String(v).trim();
}

/**
 * Return undefined if the cell is empty; otherwise return the trimmed string,
 * optionally truncated to `maxLen` characters.
 */
function safeCell(cell: ExcelJS.Cell, maxLen?: number): string | undefined {
  const text = cellText(cell);
  if (!text) return undefined;
  return maxLen !== undefined ? text.slice(0, maxLen) : text;
}

interface RowRecord {
  maHang: string;
  moTaViet?: string;
  donViTinh?: string;
  nkTt?: string;
  nkUuDai?: string;
  vat?: string;
  acfta?: string;
  atiga?: string;
  aicep?: string;
  vjepa?: string;
  akfta?: string;
  aanzfta?: string;
  aifta?: string;
  vkfta?: string;
  vcfta?: string;
  vneaeu?: string;
  cptpp?: string;
  ahkfta?: string;
  vncu?: string;
  evfta?: string;
  ukvfta?: string;
  vifta?: string;
  ttDb?: string;
  xk?: string;
  xkCpTpp?: string;
  xkEv?: string;
  xkUkv?: string;
  thueBvMt?: string;
  chinhSachMatHang?: string;
  giamVat?: string;
  isHeader: boolean;
}

async function importExcel(filePath: string) {
  console.log(`Reading file: ${filePath}`);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error("No worksheets found in the Excel file.");
  }

  console.log(`Total rows in sheet: ${worksheet.rowCount}`);

  // --- Phase 1: collect all records synchronously ---
  const records: RowRecord[] = [];

  worksheet.eachRow((row) => {
    const maHangRaw = cellText(row.getCell(2)); // 0-idx 1 → col B
    const moTaViet = cellText(row.getCell(3));  // 0-idx 2 → col C

    // Skip header rows that contain column labels
    const lower = maHangRaw.toLowerCase();
    if (
      ["mã hàng", "b", "c", "d", "hàng hóa", "heading"].includes(lower) ||
      moTaViet.toLowerCase().includes("mô tả hàng")
    ) {
      return;
    }

    // Skip rows with no meaningful data
    if (!maHangRaw && !moTaViet) return;

    const isHeader = !maHangRaw || !isNumericCode(maHangRaw);
    const maHang = (maHangRaw || moTaViet).slice(0, 20);

    records.push({
      maHang,
      moTaViet:         safeCell(row.getCell(3)),          // 0-idx 2 → col C
      donViTinh:        safeCell(row.getCell(4), 50),       // 0-idx 3 → col D
      nkTt:             safeCell(row.getCell(5)),            // 0-idx 4
      nkUuDai:          safeCell(row.getCell(6)),            // 0-idx 5
      vat:              safeCell(row.getCell(7)),            // 0-idx 6
      acfta:            safeCell(row.getCell(8)),            // 0-idx 7
      atiga:            safeCell(row.getCell(9)),            // 0-idx 8
      aicep:            safeCell(row.getCell(10)),           // 0-idx 9
      vjepa:            safeCell(row.getCell(11)),           // 0-idx 10
      akfta:            safeCell(row.getCell(12)),           // 0-idx 11
      aanzfta:          safeCell(row.getCell(13)),           // 0-idx 12
      aifta:            safeCell(row.getCell(14)),           // 0-idx 13
      vkfta:            safeCell(row.getCell(15)),           // 0-idx 14
      vcfta:            safeCell(row.getCell(16)),           // 0-idx 15
      vneaeu:           safeCell(row.getCell(17)),           // 0-idx 16
      cptpp:            safeCell(row.getCell(18)),           // 0-idx 17
      ahkfta:           safeCell(row.getCell(19)),           // 0-idx 18
      vncu:             safeCell(row.getCell(20)),           // 0-idx 19
      evfta:            safeCell(row.getCell(21)),           // 0-idx 20
      ukvfta:           safeCell(row.getCell(22)),           // 0-idx 21
      vifta:            safeCell(row.getCell(23)),           // 0-idx 22
      // 0-idx 23-29 (ExcelJS 24-30) are unused tax cols (20)-(26)
      ttDb:             safeCell(row.getCell(31)),           // 0-idx 30
      xk:               safeCell(row.getCell(32)),           // 0-idx 31
      xkCpTpp:          safeCell(row.getCell(33)),           // 0-idx 32
      xkEv:             safeCell(row.getCell(34)),           // 0-idx 33
      xkUkv:            safeCell(row.getCell(35)),           // 0-idx 34
      thueBvMt:         safeCell(row.getCell(36)),           // 0-idx 35
      chinhSachMatHang: safeCell(row.getCell(37)),           // 0-idx 36, header "F"
      giamVat:          safeCell(row.getCell(38), 20),       // 0-idx 37, header "G"
      isHeader,
    });
  });

  console.log(`Collected ${records.length} records to insert.`);

  // --- Phase 2: insert records asynchronously, one at a time ---
  let imported = 0;
  let skipped = 0;

  for (const record of records) {
    try {
      await prisma.hsCode.create({ data: record });
      imported++;
      if (imported % 500 === 0) {
        console.log(`Imported ${imported} records...`);
      }
    } catch (err) {
      console.error(`Error inserting "${record.maHang}":`, err);
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
