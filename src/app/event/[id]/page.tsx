"use client"; // Ensures this is a client-side component

import { useEffect, useState } from "react";
import IdeaBoard from "~/app/_components/IdeaBoard";

export default function EventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`);
        const data = await response.json();
        setEvent(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch event:", error);
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.id]);

  if (loading) {
    return <div>Loading event details...</div>;
  }

  if (!event) {
    return <div>No event found.</div>;
  }

  return (
    <main className="flex min-h-screen flex-col">
      <IdeaBoard event={event} />
    </main>
  );
}
