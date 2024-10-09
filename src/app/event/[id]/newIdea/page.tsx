
import { HydrateClient } from "~/trpc/server";
import IdeaForm from "~/app/_components/IdeaForm";

export default async function Home() {

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col">
        <IdeaForm />
      </main>
    </HydrateClient>
  );
}
