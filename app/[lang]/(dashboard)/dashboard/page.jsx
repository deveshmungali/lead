import React from "react";
import Card from "@/components/ui/card-snippet";
import FileUploaderRestrictions from "./file-uploader-restrictions";

const page = () => {
  return (
    <div>
      <div className="text-2xl font-semibold mb-6">Start Your Content...</div>
      <div className="space-y-5">
        <Card title="Upload Files with Restrictions">
          <p className="text-sm text-default-400 dark:text-default-600 mb-4 max-w-2xl">
            File upload has restrictions; not all types are accepted. Only
            compatible files can be uploaded to this platform.
          </p>
          <FileUploaderRestrictions />
        </Card>
      </div>
    </div>
  );
};

export default page;
