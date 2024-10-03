"use client";

import { SiteLogo } from "@/components/svg";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Icon } from "@iconify/react";

const LeadPreview = () => {
  const lead = {
    first_name: "Thomas",
    last_name: "Shelby",
    email: "thomas.shelby@shelbycompany.com",
    designation: "CEO",
    company: "Shelby Company Limited",
    link: "https://shelbycompany.com",
    linkedin_url: "https://linkedin.com/in/thomasshelby",
  };

  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem>Pages</BreadcrumbItem>
        <BreadcrumbItem>Utility</BreadcrumbItem>
        <BreadcrumbItem>Lead Details</BreadcrumbItem>
      </Breadcrumbs>

      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-12">
          <Card>
            <CardContent>
              <div className="flex gap-6 flex-col md:flex-row pt-8">
                <div className="flex-1">
                  <Link href={lead.link}>
                    <SiteLogo className="w-10 h-10 text-primary mb-2.5" />
                    <span className="text-3xl font-bold text-primary-600">{lead.company}</span>
                  </Link>

                  <div className="mt-5">
                    <div className="text-lg font-semibold text-default-900">Lead For:</div>
                    <div className="text-lg font-medium text-default-800 mt-1">{`${lead.first_name} ${lead.last_name}`}</div>
                    <div className="text-base text-default-600 mt-1">{lead.designation}</div>
                    <div className="text-base text-default-600 mt-1">{lead.email}</div>

                    <div className="mt-4">
                      <Link href={lead.linkedin_url} className="text-blue-600 hover:underline">
                        LinkedIn Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-lg font-semibold text-default-900">Thank You!</div>
              <div className="mt-1 text-sm text-default-800">
                If you have any questions concerning this lead, use the following contact information:
              </div>
              <div className="text-xs text-default-800 mt-2">{lead.email}</div>
              <div className="text-xs text-default-800 mt-1">+880 624279888</div>
              <div className="mt-8 text-xs text-default-800">© 2024 {lead.company}</div>
            </CardContent>
          </Card>

          {/* Actions: Download & Print */}
          <div className="mt-8 flex gap-4 justify-end">
            <Button asChild variant="outline" className="text-xs font-semibold text-primary-500">
              <Link href="#">
                <Download className="w-3.5 h-3.5 ltr:mr-1.5 rtl:ml-1.5" />
                <span>Lead PDF</span>
              </Link>
            </Button>
            <Button className="text-xs font-semibold">
              <Icon icon="heroicons:printer" className="w-5 h-5 ltr:mr-1 rtl:ml-1" /> Print
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadPreview;
