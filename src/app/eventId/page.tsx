
import { HydrateClient } from "~/trpc/server";
import IdeaBoard from "~/app/_components/IdeaBoard";

export default async function Home() {

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col">
        <IdeaBoard />
      </main>
    </HydrateClient>
  );
}
