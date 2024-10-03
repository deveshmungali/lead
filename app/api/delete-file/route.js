import db from "@/lib/db";
import path from "path";
import fs from "fs/promises";

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get("fileName");

  if (fileName) {
    // Handle single file deletion
    return await deleteFile(fileName);
  } else {
    // Handle bulk file deletion
    try {
      const { files } = await req.json(); // Get the list of files to delete

      if (!files || files.length === 0) {
        return new Response(JSON.stringify({ message: "No files provided" }), { status: 400 });
      }

      for (const file of files) {
        await deleteFile(file);
      }

      return new Response(JSON.stringify({ message: "Files deleted successfully" }), { status: 200 });
    } catch (error) {
      console.error("Error deleting files:", error);
      return new Response(JSON.stringify({ message: "Bulk file deletion failed" }), { status: 500 });
    }
  }
}

// Helper function to delete a file from the filesystem and database
async function deleteFile(fileName) {
  try {
    const filePath = path.join(process.cwd(), "public", "files", fileName);

    // Check if the file exists
    await fs.access(filePath);

    // Delete the file from the filesystem
    await fs.unlink(filePath);

    // Delete the file information from the database
    await db.execute("DELETE FROM uploaded_files WHERE file_name = ?", [fileName]);

    return new Response(JSON.stringify({ message: `File ${fileName} deleted successfully` }), { status: 200 });
  } catch (error) {
    console.error(`Error deleting file: ${fileName}`, error);
    return new Response(JSON.stringify({ message: `File deletion failed for ${fileName}` }), { status: 500 });
  }
}
