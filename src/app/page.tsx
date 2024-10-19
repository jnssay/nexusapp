import { HydrateClient } from "~/trpc/server";
import { redirect } from 'next/navigation';
import { Spinner } from "~/components/ui/spinner";

export default function Home({ searchParams }: { searchParams: { event?: string } }) {
  if (searchParams?.event) {
    redirect(`/event/${searchParams.event}`);
  }

  return (
    <HydrateClient>
      <main>
        <Spinner className="mt-10 text-foreground" size="large" />
      </main>
    </HydrateClient>
  );
}
