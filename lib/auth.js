import db from "@/lib/db"; // MySQL connection

// A simple function to run queries
export const runQuery = async (query, params = []) => {
  try {
    const [rows] = await db.execute(query, params);
    return rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw new Error("Database query failed");
  }
};
