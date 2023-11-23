import { NextRequest } from "next/server";
export function getOffsetAndLimitFromReq(
  request: NextRequest,
  maxLimit = 100,
  maxOffset = 1000
) {
  const url = new URL(request.url);
  const requestLimit = url.searchParams.get("limit");
  const requestoffset = url.searchParams.get("offset");
  const q = url.searchParams.get("q");
  const queryLimit = parseInt((requestLimit as string) || "0");
  const queryOffset = parseInt((requestoffset as string) || "0");

  let limit = 10;
  if (queryLimit > 0 && queryLimit < maxLimit) {
    limit = queryLimit;
  } else if (queryLimit > maxLimit) {
    limit = maxLimit;
  }

  const offset = queryOffset < maxOffset ? queryOffset : 0;
  return { limit, offset, q };
}
