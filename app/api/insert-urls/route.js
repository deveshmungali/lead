import db from "@/lib/db";
import * as XLSX from "xlsx";
import path from "path";
import fs from "fs/promises";

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get("fileName");

  if (!fileName) {
    return new Response(JSON.stringify({ message: "File name is missing" }), { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), "public", "files", fileName);
    const fileBuffer = await fs.readFile(filePath);

    let urls = [];
    if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      // Process Excel file without headers
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Reads data as array, no headers

      // Assuming only the first column has the URLs
      urls = sheetData.map((row) => row[0]).filter(Boolean); // Get first column data and filter empty values
    } else if (fileName.endsWith(".csv")) {
      // Process CSV file without headers
      const csv = require("csv-parser");
      const fileStream = await fs.createReadStream(filePath);
      await new Promise((resolve, reject) => {
        fileStream
          .pipe(csv({ headers: false })) // No headers in the CSV
          .on("data", (row) => {
            if (row[0]) {
              urls.push(row[0]); // Get the first column data
            }
          })
          .on("end", resolve)
          .on("error", reject);
      });
    }

    // Insert URLs into the uploaded_sheets table
    if (urls.length > 0) {
      for (const url of urls) {
        await db.execute("INSERT INTO uploaded_sheets (sheet_url) VALUES (?)", [url]);
      }
    }

    // Mark the file as 'imported' in the uploaded_files table
    await db.execute("UPDATE uploaded_files SET status = 'imported' WHERE file_name = ?", [fileName]);

    return new Response(JSON.stringify({ message: "URLs imported successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error processing file:", error);
    return new Response(JSON.stringify({ message: "Error processing file" }), { status: 500 });
  }
}
