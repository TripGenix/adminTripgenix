import React, { useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

import PageBreadcrumb from "@/components/common/PageBreadcrumb";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import bookingApi from "@/api/ToursApi";


export default function ViewNewTours() {
const {id} = useParams();

    
  const form = useForm({
    defaultValues: {
      destinations: [],
    },
  });

  useEffect(() => {
    loadBooking();
  }, []);

  async function loadBooking() {
    try {
      const res = await bookingApi.getBookingById(id);

      const b = res.data;

      form.reset({
        referenceId: b.referenceId,

        nameOfBooker: b.bookingDetails.nameOfBooker,
        bookerEmail: b.bookingDetails.bookerEmail,
        bookerPhone: b.bookingDetails.bookerPhone,
        passportNumber: b.bookingDetails.passportNumber,
        flightNumber: b.bookingDetails.flightNumber,
        arrivalDate: b.bookingDetails.arrivalDateTime?.substring(0, 10),
        departureDate: b.bookingDetails.departureDateTime?.substring(0, 10),
        arrivalAirport: b.bookingDetails.departureAirport,

        startDate: b.tripDetails.startDate,
        endDate: b.tripDetails.endDate,
        startLocation: b.tripDetails.startLocation,
        endLocation: b.tripDetails.endLocation,

        destinations: b.tripDetails.destinations || [],

        estimatedCost: b.routeDetails.bookingPrice,
      });
    } catch (err) {
      console.error("Failed to load booking", err);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <PageBreadcrumb
        title="View Booking"
        paths={["Tours", `${form.watch("referenceId")}`,""]}
      />

      <Form {...form}>
        <form className="space-y-10">

          {/* HEADER */}
          <div className="text-xl font-semibold">
            Reference ID : {form.watch("referenceId")}
          </div>

          {/* BOOKER DETAILS */}
          <Section title="Booker Details">
            <Grid>
              <ReadonlyField
                form={form}
                name="nameOfBooker"
                label="Booker Name"
              />
              <ReadonlyField
                form={form}
                name="bookerEmail"
                label="Email"
              />
              <ReadonlyField
                form={form}
                name="bookerPhone"
                label="Phone"
              />
              <ReadonlyField
                form={form}
                name="flightNumber"
                label="Flight Number"
              />
              <ReadonlyField
                form={form}
                name="passportNumber"
                label="Passport Number"
              />
              <ReadonlyField
                form={form}
                name="arrivalDate"
                label="Arrival Date"
              />
              <ReadonlyField
                form={form}
                name="departureDate"
                label="Departure Date"
              />
              <ReadonlyField
                form={form}
                name="arrivalAirport"
                label="Arrival Airport"
              />
            </Grid>
          </Section>

          {/* TRIP DETAILS */}
          <Section title="Trip Details">
            <Grid>
              <ReadonlyField
                form={form}
                name="startDate"
                label="Start Date"
              />
              <ReadonlyField
                form={form}
                name="endDate"
                label="End Date"
              />
            </Grid>

            <ReadonlyField
              form={form}
              name="startLocation"
              label="Starting Location"
              full
            />

            <ReadonlyField
              form={form}
              name="endLocation"
              label="End Location"
              full
            />

            {/* DESTINATIONS (NO FormLabel here) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Destinations
              </label>

              {(form.watch("destinations") || []).map((d, i) => (
                <Input key={i} value={d} disabled />
              ))}
            </div>
          </Section>

          {/* ROUTE PREVIEW */}
          <Section title="Route Preview">
            <div className="h-40 bg-muted rounded flex items-center justify-center text-sm text-muted-foreground">
              Map Preview
            </div>
          </Section>

          {/* COST */}
          <div className="bg-muted p-4 rounded flex justify-between text-lg font-semibold">
            <span>Estimated Cost</span>
            <span>
              {form.watch("estimatedCost")?.toFixed(2)}
            </span>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-4">
            <Button variant="outline">Cancel</Button>
            <Button variant="secondary">Save</Button>
            <Button className="bg-blue-700 hover:bg-blue-900 text-white">
              Save & Send Driver Confirmation
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

/* =============================
   REUSABLE COMPONENTS
============================= */

function Section({ title, children }) {
  return (
    <div className="bg-white border rounded-md shadow p-6 space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Grid({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {children}
    </div>
  );
}

function ReadonlyField({ form, name, label, full }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={full ? "md:col-span-3" : ""}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
