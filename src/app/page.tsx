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
        {/* <Spinner className="mt-10 text-foreground" size="large" /> */}
        <div className="mt-10 flex w-full justify-center text-foreground">
        REDIRECTING TO EVENT PAGE...
        </div>
      </main>
    </HydrateClient>
  );
}
