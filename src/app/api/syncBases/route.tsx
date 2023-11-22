// pages/api/sync.js
import { algoliaDB } from "@/lib/algoliaConn";
import airtableBase from "@/lib/airtableConn";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Configuración de Airtable
    const products = await airtableBase.table("productos-m9").select().all();

    // Procesar y guardar en Algolia
    const productsToSave = products.map((record) => ({
      ...record.fields,
      objectID: record.id,
    }));

    const algoliaResponse = await algoliaDB.saveObjects(productsToSave);
    return NextResponse.json({ message: "Sync successful", algoliaResponse });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" });
  }
}
