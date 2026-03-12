import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? "";
    const type = searchParams.get("type") ?? "all";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10))
    );
    const skip = (page - 1) * limit;

    let where: Prisma.HsCodeWhereInput = {};

    if (q.trim()) {
      const term = `%${q.trim()}%`;
      if (type === "code") {
        where = {
          maHang: { contains: q.trim(), mode: "insensitive" },
        };
      } else if (type === "name") {
        where = {
          moTaViet: { contains: q.trim(), mode: "insensitive" },
        };
      } else {
        // type === "all" — search both maHang and moTaViet
        // Use raw SQL for ILIKE with unaccent-like support via OR
        const [rows, countResult] = await Promise.all([
          prisma.$queryRaw<Record<string, unknown>[]>`
            SELECT * FROM "HsCode"
            WHERE "maHang" ILIKE ${term}
               OR "moTaViet" ILIKE ${term}
            ORDER BY id ASC
            LIMIT ${limit} OFFSET ${skip}
          `,
          prisma.$queryRaw<[{ count: bigint }]>`
            SELECT COUNT(*) as count FROM "HsCode"
            WHERE "maHang" ILIKE ${term}
               OR "moTaViet" ILIKE ${term}
          `,
        ]);

        const total = Number(countResult[0].count);
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
          data: rows,
          total,
          page,
          limit,
          totalPages,
        });
      }
    }

    const [data, total] = await Promise.all([
      prisma.hsCode.findMany({
        where,
        orderBy: { id: "asc" },
        skip,
        take: limit,
      }),
      prisma.hsCode.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error("HS Code API error:", error);
    return NextResponse.json(
      { error: "Lỗi server, vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
