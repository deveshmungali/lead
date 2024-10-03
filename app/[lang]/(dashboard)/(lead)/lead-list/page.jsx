"use client"
import {Fragment} from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import LeadListTable from "./lead-list-table"
const LeadListPage = () => {
  return (
    <Fragment>
    
      <Card className="mt-6">
      
      </Card>
      <Card className="mt-6">
        <CardContent className="p-0">
          <LeadListTable />
        </CardContent>
      </Card>
    </Fragment>
  )
}

export default LeadListPage;