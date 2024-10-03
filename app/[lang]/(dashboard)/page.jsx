"use client";

import React, { useState } from "react";
import Card from "@/components/ui/card-snippet";  // Keep this one
import FileUploaderRestrictions from "./file-uploader-restrictions";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [processing, setProcessing] = useState(false);  // Processing state to manage button state
  const [message, setMessage] = useState("");  // Message state for feedback

  // Function to handle opening URLs one by one in the same tab
  const handleExtractLeads = async () => {
    setProcessing(true);
    try {
      const response = await fetch("/api/extract-leads", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      // Check if data exists and contains URLs
      if (response.ok && data && data.length > 0) {
        // Open the URLs one by one in the same tab
        openURLsInSameTab(data);
        setMessage("Leads extraction process started!");
      } else {
        setMessage("No sheets found or error occurred while extracting leads.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error occurred while processing.");
    } finally {
      setProcessing(false);
    }
  };

  // Helper function to open URLs in the same tab sequentially using a delay
  const openURLsInSameTab = (urls) => {
    let index = 0;

    // Open a new tab
    const newTab = window.open("", "_blank");

    const loadNextURL = () => {
      if (index >= urls.length) {
        newTab.close(); // Close the tab once all URLs have been processed
        setMessage("All URLs processed successfully!");
        return;
      }

      const { sheet_url } = urls[index];
      const dynamicUrl = `https://leadrocks.io/my?position=&company=${sheet_url}&geo=&industry=&team_size=&revenue_range=&total_funding=`;

      // Load the current URL in the new tab
      newTab.location.href = dynamicUrl;

      console.log(`Opened URL: ${dynamicUrl}`);

      // Move to the next URL after 5 seconds (or any desired delay)
      setTimeout(() => {
        index++;
        loadNextURL(); // Load the next URL after the delay
      }, 5000); // Adjust the delay time as needed for page load
    };

    // Start the process with the first URL
    loadNextURL();
  };

  return (
    <div>
      <div className="text-2xl font-semibold mb-6">LeadRocks Lead Extraction</div>
      <div className="space-y-5">
        <Card title="Upload Files with Restrictions">
          <p className="text-sm text-default-400 dark:text-default-600 mb-4 max-w-2xl">
            File upload has restrictions; not all types are accepted. Only compatible files can be uploaded to this platform.
          </p>
          <FileUploaderRestrictions />
        </Card>

        {/* Add Extract Leads button */}
        <Button onClick={handleExtractLeads} disabled={processing}>
          {processing ? "Processing..." : "Extract Leads"}
        </Button>

        {/* Show message to the user */}
        {message && <p className="mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default Page;
