import db from "@/lib/db";

export async function GET(req) {
  try {
    const [rows] = await db.execute("SELECT * FROM lead");
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch leads" }), { status: 500 });
  }
}
