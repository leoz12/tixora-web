import { Metadata } from "next";
import api from "@/lib/api";
import { Event } from "@/types";
import EventDetailClient from "@/components/pages/EventDetailClient";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

async function getEvent(id: string): Promise<Event | null> {
  try {
    const response = await api.get<{ data: Event }>(`/events/${id}`);
    return response.data.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);

  return {
    title: event ? `${event.title} | Tixora` : "Event | Tixora",
    description: event?.description,
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;

  return <EventDetailClient eventId={id} />;
}
