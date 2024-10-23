"use client";

import { useEffect, useState } from "react";
import IdeaBoard from "~/app/_components/IdeaBoard";
import { Spinner } from "~/components/ui/spinner";
import { useInitData } from '~/telegram/InitDataContext';
import { useSearchParams, useRouter } from 'next/navigation'; // Updated import
import { Toaster } from "~/components/ui/toaster"
import { useToast } from "~/hooks/use-toast"



export default function EventPage({ params }: { params: { id: string } }) {
  const { user } = useInitData();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams(); // Use this to read query params
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const message = searchParams.get('message'); // Retrieve the message query parameter

    if (message === 'event-confirmed') {
      // Show popup notification using `shadcn` toast
      toast({
        title: "Event already confirmed!",
        description: "Cannot add ideas to a confirmed event.",
        variant: "default", // Use the appropriate variant if needed
      });

      // Remove the query parameter to avoid showing the message again on a page refresh
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("message");
      router.replace(`/event/${params.id}?${newSearchParams.toString()}`);
    }
  }, [searchParams, router, params.id, toast]);


  // Fetch the event data based on eventId and userId
  useEffect(() => {
    if (user) { // Wait until user is available
      const fetchEvent = async () => {
        try {
          // Include the userId as a query parameter
          const response = await fetch(`/api/events/${params.id}?userId=${user.id}`);

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
  }, [params.id, user]);

  if (loading) {
    return <Spinner className="mt-10 text-foreground" size="large" />;
  }

  if (!event) {
    return <div>No event found.</div>;
  }

  if (!user) {
    return <div>No user found.</div>;
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-t from-secondary to-background">
      <IdeaBoard event={event} />
      <Toaster />
    </main>
  );
}
