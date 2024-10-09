"use client";

import { useEffect, useState } from "react";
import IdeaBoard from "~/app/_components/IdeaBoard";
import DisplayInitData from "~/telegram/DisplayInitData";
import { useInitData } from '~/telegram/InitDataContext'; // Import useInitData

export default function EventPage() {
  const { user } = useInitData(); // Get the user
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

  // Fetch the event data based on eventId and userId
  useEffect(() => {
    if (eventId && user) { // Wait until both eventId and user are available
      const fetchEvent = async () => {
        try {
          // Include the userId as a query parameter
          const response = await fetch(`/api/events/${eventId}?userId=${user.id}`);

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
  }, [eventId, user]); // Run effect when eventId or user changes

  if (loading) {
    return <div className="flex mt-10 w-full items-center justify-center">Loading event details...</div>;
  }

  if (!event) {
    return <div>No event found.</div>;
  }

  return (
    <main className="flex min-h-screen bg-gradient-to-tl from-primary flex-col">
      <IdeaBoard event={event} />
      <DisplayInitData />
    </main>
  );
}
