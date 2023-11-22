import { NextRequest, NextResponse } from "next/server";
import { getOffsetAndLimitFromReq } from "@/tools/searchTools";
import { algoliaDB } from "@/lib/algoliaConn";
export async function GET(request: NextRequest) {
  const { limit, offset, q } = getOffsetAndLimitFromReq(request) as any;
  const results = await algoliaDB.search(q as string, {
    hitsPerPage: limit,
  });

  const response = {
    results: results.hits,
    pagination: {
      offset,
      limit,
      total: results.nbHits,
    },
  };
  return NextResponse.json({ response });
}
