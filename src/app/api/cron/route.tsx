import { algoliaDB } from "@/lib/algoliaConn";
import airtableBase from "@/lib/airtableConn";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Configuración de Airtable
    const products = await airtableBase.table("productos-m9").select().all();
    const experimental = products.at(1);
    console.log(experimental);

    // Procesar y guardar en Algolia
    const productsToSave = products.map((record) => ({
      objectID: record.id,
      name: record.fields.name,
      description: record.fields.description,
    }));

    const algoliaResponse = await algoliaDB.saveObjects(productsToSave);
    return NextResponse.json({ message: "Sync successful", algoliaResponse });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" });
  }
}
