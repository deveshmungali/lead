"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";

const LeadPage = () => {
  return (
    <div>
    

      <div className="lead-wrapper mt-6">
        <div className="grid grid-cols-12 gap-6">
          <Card className="col-span-12 xl:col-span-8">
            <CardHeader className="sm:flex-row sm:items-center gap-3">
              <div className="flex-1 text-xl font-medium text-default-700 whitespace-nowrap">Create Lead</div>
            
            </CardHeader>

            <CardContent>
              {/* Input fields for lead details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label htmlFor="first_name" className="text-sm font-medium">First Name</Label>
                  <Input id="first_name" placeholder="Enter first name" />

                  <Label htmlFor="last_name" className="text-sm font-medium">Last Name</Label>
                  <Input id="last_name" placeholder="Enter last name" />

                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email" />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="designation" className="text-sm font-medium">Designation</Label>
                  <Input id="designation" placeholder="Enter designation" />

                  <Label htmlFor="company" className="text-sm font-medium">Company</Label>
                  <Input id="company" placeholder="Enter company name" />

                  <Label htmlFor="link" className="text-sm font-medium">Website Link</Label>
                  <Input id="link" placeholder="Enter company website link" />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <Label htmlFor="linkedin_url" className="text-sm font-medium">LinkedIn URL</Label>
                  <Input id="linkedin_url" placeholder="Enter LinkedIn URL" />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex-wrap justify-end gap-4">
           
              <Button asChild className="group hover:bg-default-200 hover:text-default-900 text-xs font-semibold whitespace-nowrap">
                <Link href="">
                  <Icon icon="heroicons:paper-airplane" className="w-5 h-5 ltr:mr-2 rtl:ml-2 group-hover:text-default-900" />
                  Save Lead
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeadPage;
