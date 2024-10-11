import { HydrateClient } from "~/trpc/server";
import Link from 'next/link';
import { Button } from "~/components/ui/button";
import DisplayInitData from "~/telegram/DisplayInitData";
import { redirect } from 'next/navigation';

export default function Home({ searchParams }: { searchParams: { event?: string } }) {
  if (searchParams?.event) {
    redirect(`/event/${searchParams.event}`);
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center gap-2">
        event page with ideas is at:
        <Link href={`/event/example`} className="mb-10"><Button>/event/example</Button></Link>
        idea creation form page is at:
        <Link href={`/newIdea`}><Button>/newIdea</Button></Link>
        <DisplayInitData />
      </main>
    </HydrateClient>
  );
}
