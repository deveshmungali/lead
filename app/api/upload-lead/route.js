import db from "@/lib/db";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic"; // Disable caching

export async function POST(req) {
  try {
    const uploadDir = path.join(process.cwd(), "public", "files");

    // Ensure the directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const formData = await req.formData(); // Get form data from the request
    const files = formData.getAll("files"); // Extract the uploaded files

    const insertedFiles = [];

    // Save each file and insert into the database
    for (const file of files) {
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      const fileData = Buffer.from(await file.arrayBuffer());

      // Write the file to the upload directory
      await fs.writeFile(filePath, fileData);

      const relativePath = `/files/${fileName}`;

      // Insert file information into the database
      await db.execute("INSERT INTO uploaded_files (file_name, file_path) VALUES (?, ?)", [fileName, relativePath]);

      insertedFiles.push({ fileName, filePath: relativePath });
    }

    return new Response(JSON.stringify({ message: "File(s) uploaded successfully", files: insertedFiles }), { status: 200 });
  } catch (error) {
    console.error("Error processing file upload:", error);
    return new Response(JSON.stringify({ message: "File upload failed" }), { status: 500 });
  }
}

// Make sure this API returns the 'status' for each uploaded file
export async function GET() {
  try {
    const [rows] = await db.execute("SELECT file_name, file_path, status FROM uploaded_files ORDER BY uploaded_at DESC");
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching uploaded files from database:", error);
    return new Response(JSON.stringify({ message: "Database error" }), { status: 500 });
  }
}

