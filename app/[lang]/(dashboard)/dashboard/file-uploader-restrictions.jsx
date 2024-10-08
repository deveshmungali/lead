"use client";
import { Fragment, useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useToast } from "@/components/ui/use-toast";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const FileUploaderRestrictions = () => {
  const [files, setFiles] = useState([]); // State for files selected for upload
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]); // State to store uploaded files
  const [selectedFiles, setSelectedFiles] = useState([]); // State to track selected files for bulk delete
  const [isSelectAll, setIsSelectAll] = useState(false); // State to track Select All checkbox
  const { toast } = useToast();

  useEffect(() => {
    // Fetch the uploaded files on component mount
    const fetchUploadedFiles = async () => {
      const response = await fetch("/api/upload-lead");
      const data = await response.json();
      setUploadedFiles(data); // Ensure data includes file name, path, and status
    };

    fetchUploadedFiles();
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 5,
    maxSize: 2 * 1024 * 1024, // 2MB in bytes
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "text/csv": [".csv"],
    },
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles.map((file) => Object.assign(file)));
    },
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          if (error.code === "file-too-large") {
            toast({
              color: "destructive",
              title: "Error",
              description: `The file ${file.name} is too large. Maximum allowed size is 2 MB.`,
            });
          } else if (error.code === "too-many-files") {
            toast({
              color: "destructive",
              title: "Error",
              description: `Too many files. You can only upload up to 2 files.`,
            });
          } else if (error.code === "file-invalid-type") {
            toast({
              color: "destructive",
              title: "Error",
              description: `Invalid file type: ${file.name}. Only Excel files or CSV are allowed.`,
            });
          }
        });
      });
    },
  });

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        color: "destructive",
        title: "Error",
        description: "Please select files before uploading.",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const response = await fetch("/api/upload-lead", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { files: newFiles } = await response.json();
        setUploadedFiles([...newFiles, ...uploadedFiles]); // Update file list with newly uploaded files
        toast({
          color: "success",
          title: "Success",
          description: "Files uploaded successfully!",
        });
        setFiles([]); // Clear files after successful upload
      } else {
        const errorData = await response.json();
        toast({
          color: "destructive",
          title: "Error",
          description: `Failed to upload files: ${errorData.message || "Unknown error"}`,
        });
      }
    } catch (error) {
      toast({
        color: "destructive",
        title: "Error",
        description: `An error occurred during file upload: ${error.message}`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Function to remove a file from the selected list (before uploading)
  const handleRemoveFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const handleDeleteFile = async (fileName) => {
    try {
      const response = await fetch(`/api/delete-file?fileName=${fileName}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.file_name !== fileName));
        toast({
          color: "success",
          title: "Success",
          description: `File ${fileName} deleted successfully!`,
        });
      } else {
        toast({
          color: "destructive",
          title: "Error",
          description: `Failed to delete file: ${fileName}`,
        });
      }
    } catch (error) {
      toast({
        color: "destructive",
        title: "Error",
        description: `Error occurred during file deletion: ${error.message}`,
      });
    }
  };

  const handleImportUrls = async (fileName) => {
    try {
      const response = await fetch(`/api/insert-urls?fileName=${fileName}`, {
        method: "POST",
      });

      if (response.ok) {
        toast({
          color: "success",
          title: "Success",
          description: "URLs imported successfully!",
        });

        // Update the file status to "imported"
        setUploadedFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.file_name === fileName ? { ...file, status: "imported" } : file
          )
        );
      } else {
        toast({
          color: "destructive",
          title: "Error",
          description: "Failed to import URLs.",
        });
      }
    } catch (error) {
      toast({
        color: "destructive",
        title: "Error",
        description: "Error occurred during URL import.",
      });
    }
  };

  // Handle selecting/deselecting a single file
  const handleSelectFile = (fileName) => {
    setSelectedFiles((prevSelected) =>
      prevSelected.includes(fileName)
        ? prevSelected.filter((name) => name !== fileName)
        : [...prevSelected, fileName]
    );
  };

  // Handle selecting/deselecting all files
  const handleSelectAll = () => {
    if (isSelectAll) {
      setSelectedFiles([]); // Deselect all files
    } else {
      const allFileNames = uploadedFiles.map((file) => file.file_name);
      setSelectedFiles(allFileNames); // Select all files
    }
    setIsSelectAll(!isSelectAll); // Toggle select all
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) {
      toast({
        color: "destructive",
        title: "Error",
        description: "Please select files to delete.",
      });
      return;
    }

    try {
      const response = await fetch(`/api/delete-file`, {
        method: "DELETE", // Change to DELETE method
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: selectedFiles }), // Sending the files array in the body
      });

      if (response.ok) {
        setUploadedFiles((prevFiles) =>
          prevFiles.filter((file) => !selectedFiles.includes(file.file_name))
        );
        setSelectedFiles([]); // Clear selected files after deletion
        setIsSelectAll(false); // Reset select all state
        toast({
          color: "success",
          title: "Success",
          description: "Files deleted successfully!",
        });
      } else {
        toast({
          color: "destructive",
          title: "Error",
          description: "Failed to delete files.",
        });
      }
    } catch (error) {
      toast({
        color: "destructive",
        title: "Error",
        description: `Error occurred during bulk deletion: ${error.message}`,
      });
    }
  };

  return (
    <Fragment>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <div className="w-full text-center border-dashed border rounded-md py-[52px] flex items-center flex-col">
          <div className="h-12 w-12 inline-flex rounded-md bg-muted items-center justify-center mb-3">
            <Upload className="h-6 w-6 text-default-500" />
          </div>
          <h4 className="text-2xl font-medium mb-1 text-card-foreground/80">
            Drop files here or click to upload.
          </h4>
        </div>
      </div>

      {files.length ? (
        <Fragment>
          <div>
            {files.map((file) => (
              <div key={file.name} className="flex justify-between border px-3.5 py-3 my-6 rounded-md">
                <div className="flex gap-3 items-center">
                  <Icon icon="tabler:file-spreadsheet" className="h-6 w-6" />
                  <div>
                    <div className="text-sm text-card-foreground">{file.name}</div>
                    <div className="text-xs font-light text-muted-foreground">
                      {(Math.round(file.size / 1024)).toFixed(1)} KB
                    </div>
                  </div>
                </div>
                {/* Add file removal button */}
                <Button
                  size="icon"
                  color="destructive"
                  variant="outline"
                  className="border-none rounded-full"
                  onClick={() => handleRemoveFile(file.name)} // Call remove file handler
                >
                  <Icon icon="tabler:x" className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button color="destructive" onClick={() => setFiles([])} disabled={isUploading}>
              Remove All
            </Button>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload Files"}
            </Button>
          </div>
        </Fragment>
      ) : null}

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Uploaded Files</h3>
        {uploadedFiles.length > 0 ? (
          <Fragment>
            {/* Select All Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isSelectAll}
                onChange={handleSelectAll}
              />
              <span className="ml-2">Select All</span>
            </div>

            <ul className="space-y-3 mt-4">
              {uploadedFiles.map((file) => (
                <li key={file.file_name} className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.file_name)}
                      onChange={() => handleSelectFile(file.file_name)}
                    />
                    <Icon icon="tabler:file-spreadsheet" className="h-6 w-6 text-default-600" />
                    <span className="text-sm font-medium">{file.file_name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <a href={file.file_path} download className="text-blue-600 hover:underline">
                      Download
                    </a>
                    <Button
                      onClick={() => handleImportUrls(file.file_name)}
                      disabled={file.status === "imported"}
                    >
                      {file.status === "imported" ? "Imported" : "Import URLs"}
                    </Button>
                    <Button
                      color="destructive"
                      onClick={() => handleDeleteFile(file.file_name)}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            {selectedFiles.length > 0 && (
              <div className="flex justify-end mt-4">
                <Button color="destructive" onClick={handleBulkDelete}>
                  Delete Selected Files
                </Button>
              </div>
            )}
          </Fragment>
        ) : (
          <p className="text-sm text-muted-foreground">No files uploaded yet.</p>
        )}
      </div>
    </Fragment>
  );
};

export default FileUploaderRestrictions;
