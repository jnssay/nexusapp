"use client";

import { useEffect, useState } from "react";
import IdeaBoard from "~/app/_components/IdeaBoard";
import { Spinner } from "~/components/ui/spinner";
import { useInitData } from '~/telegram/InitDataContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { Toaster } from "~/components/ui/toaster"
import { useToast } from "~/hooks/use-toast"

export default function EventPage({ params }: { params: { id: string } }) {
  const { user } = useInitData();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  // Check and display message notification only once
  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'event-confirmed') {
      toast({
        title: "Event already confirmed!",
        description: "Cannot add ideas to a confirmed event.",
      });

      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("message");
      router.replace(`/event/${params.id}?${newSearchParams.toString()}`);
    }
  }, [searchParams, router, params.id, toast]);

  // Fetch event data only if user is loaded
  useEffect(() => {
    if (user) {
      const fetchEvent = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/events/${params.id}?userId=${user.id}`);
          if (!response.ok) throw new Error(`Failed to fetch event: ${response.status}`);
          const data = await response.json();
          setEvent(data);
        } catch (error) {
          console.error("Failed to fetch event:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [params.id, user]);

  if (loading) {
    return <div className="mt-10 flex w-full justify-center text-foreground"> LOADING EVENT DATA </div>;
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
