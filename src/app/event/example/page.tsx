"use client";

import { useEffect, useState } from "react";
import IdeaBoard from "~/app/_components/IdeaBoard";

export default function EventPage() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eventId, setEventId] = useState<string | null>(null);

  // Fetch the event ID from the API
  useEffect(() => {
    const fetchEventId = async () => {
      try {
        const res = await fetch('/api/seed');

        if (!res.ok) {
          throw new Error(`Failed to fetch event ID: ${res.status}`);
        }

        const data = await res.json();
        setEventId(data.eventId); // Set the event ID
      } catch (error) {
        console.error("Failed to fetch event ID:", error);
      }
    };

    fetchEventId();
  }, []);

  // Fetch the event data based on eventId
  useEffect(() => {
    if (eventId) {
      const fetchEvent = async () => {
        try {
          const response = await fetch(`/api/events/${eventId}`);

          if (!response.ok) {
            throw new Error(`Failed to fetch event: ${response.status}`);
          }

          const data = await response.json();
          setEvent(data);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch event:", error);
          setLoading(false);
        }
      };

      fetchEvent();
    }
  }, [eventId]);

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
