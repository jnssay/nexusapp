"use client"; // Ensures this is a client-side component

import { useEffect, useState } from "react";
import IdeaBoard from "~/app/_components/IdeaBoard";
import { useInitData } from '~/telegram/InitDataContext';

export default function EventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useInitData();

  // Fetch the event data based on eventId and userId
  useEffect(() => {
    if (user) { // Wait until user is available
      const fetchEvent = async () => {
        try {
          // Include the userId as a query parameter
          const response = await fetch(`/api/events/${params.id}?userId=${user.id}`);
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
  }, [params.id, user]);

  if (loading) {
    return <div className="flex mt-10 w-full items-center justify-center">Loading event details...</div>;
  }

  if (!event) {
    return <div>No event found.</div>;
  }

  if (!user) {
    return <div>No user found.</div>;
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-tl from-primary">
      <IdeaBoard event={event} />
    </main>
  );
}
