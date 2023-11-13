import { NextResponse } from "next/server";
import { NextApiRequest } from "next";

export async function GET(request: NextApiRequest) {
    try {
        return NextResponse.json({ ok: "ok" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error });
    }
}
