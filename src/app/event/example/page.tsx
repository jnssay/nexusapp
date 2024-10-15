"use client";

import { useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function RedirectToEvent() {
  const router = useRouter();

  useEffect(() => {
    const fetchEventIdAndRedirect = async () => {
      try {
        const res = await fetch('/api/seed');

        if (!res.ok) {
          throw new Error(`Failed to fetch event ID: ${res.status}`);
        }

        const data = await res.json();
        const eventId = data.eventId;

        // Redirect to the dynamic event page
        router.push(`/event/${eventId}`);
      } catch (error) {
        console.error("Failed to fetch event ID:", error);
      }
    };

    fetchEventIdAndRedirect();
  }, [router]);

  return <div>Loading...</div>;
}
