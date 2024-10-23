import { HydrateClient } from "~/trpc/server";
import IdeaForm from "~/app/_components/IdeaForm";
import { notFound } from "next/navigation";

export default async function NewIdeaPage({ params }: { params: { id: string } }) {
  const eventId = params.id;

  // Use the full URL for server-side fetching
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/events/${eventId}`);

  if (!res.ok) {
    console.log("fetch failed for page")
    return notFound();
  }

  const eventDetails = await res.json();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-t from-secondary to-background">
        {eventDetails?.status === "CONFIRMED" ? (
          <p className="text-center text-lg font-semibold text-foreground">
            Event already confirmed!
          </p>
        ) : (
          <IdeaForm eventId={eventId} eventName={eventDetails?.name || "Unnamed Event"} />
        )}
      </main>
    </HydrateClient>
  );
}