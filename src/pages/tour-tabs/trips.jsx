import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewTours from "./NewTours";
import ConfirmedTours from "./ConfirmedTours";
import OngoingTours from "./OngoingTours";
import CancelledTours from "./CancelledTours";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import AllTours from "./AllTours";

export default function Trips() {
  return (
    
    <div className="p-1">
      <PageBreadcrumb title="Tours" />

      <Tabs defaultValue="new" className="w-full">
        {/* ================= TAB HEADERS ================= */}
        <TabsList className="grid grid-cols-1 w-full  md:grid-cols-7 gap-1 min-h-[56px]">
          <TabsTrigger
            value="all"
            className="w-full data-[state=active]:bg-slate-800 data-[state=active]:text-white"
          >
            All
          </TabsTrigger>

          <TabsTrigger
            value="new"
            className="w-full text-blue-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            New Tours
          </TabsTrigger>

          <TabsTrigger
            value="passenger-confirmed"
            className="w-full text-green-600  data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Passenger Confirmed
          </TabsTrigger>

          <TabsTrigger
            value="driver-pending"
            className="w-full text-yellow-500 data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
          >
            Driver Pending
          </TabsTrigger>

          <TabsTrigger
            value="in-progress"
            className="w-full text-indigo-600 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
          >
            In Progress
          </TabsTrigger>

          <TabsTrigger
            value="finished"
            className="w-full text-emerald-600 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
          >
            Finished Tours
          </TabsTrigger>

          <TabsTrigger
            value="cancelled"
            className="w-full text-red-600 data-[state=active]:bg-red-600 data-[state=active]:text-white"
          >
            Cancelled Tours
          </TabsTrigger>
        </TabsList>

        {/* ================= TAB CONTENT ================= */}
        <div className="bg-white border rounded-md shadow-2xl md:pb-3 p-4">
          <TabsContent value="all">
            <AllTours />
          </TabsContent>
          <TabsContent value="new">
            <NewTours />
          </TabsContent>

          <TabsContent value="confirmed">
            <ConfirmedTours />
          </TabsContent>

          <TabsContent value="ongoing">
            <OngoingTours />
          </TabsContent>

          <TabsContent value="cancelled">
            <CancelledTours />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
