import { Metadata } from "next";
import EventsPageClient from "@/components/pages/EventsPageClient";

export const metadata: Metadata = {
  title: "Events - Tixora",
  description: "Browse and book event tickets",
};

export default function Page() {
  return <EventsPageClient />;
}
