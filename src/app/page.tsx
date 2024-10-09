import { HydrateClient } from "~/trpc/server";
import Link from 'next/link';
import { Button } from "~/components/ui/button";
import DisplayInitData from "~/telegram/DisplayInitData";


export default async function Home() {

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center gap-2">
        event page with ideas is at:
        <Link href={`/example`} className="mb-10"><Button>/example</Button></Link>
        idea creation form page is at:
        <Link href={`/newIdea`}><Button>/newIdea</Button></Link>
        <DisplayInitData />
      </main>
    </HydrateClient>
  );
}
