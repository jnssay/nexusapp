import { HydrateClient } from "~/trpc/server";
import IdeaForm from "~/app/_components/IdeaForm";
import { notFound } from "next/navigation";

export default async function NewIdeaPage({ params }: { params: { id: string } }) {
  const eventId = params.id;

  // Use the full URL for server-side fetching
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/events/${eventId}`);

  if (!res.ok) {
    return notFound();
  }

  const eventDetails = await res.json();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col">
        {/* Pass event ID and event name to the IdeaForm component */}
        <IdeaForm eventId={eventId} eventName={eventDetails?.name || "Unnamed Event"} />
      </main>
    </HydrateClient>
  );
}
