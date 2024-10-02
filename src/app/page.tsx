
import { HydrateClient } from "~/trpc/server";
import IdeaBoard from "./_components/IdeaBoard";
import { ThemeToggler } from "./_components/ThemeToggler";



export default async function Home() {



  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col">
        {/* Top bar with Theme Toggler */}
        <div className="flex justify-end p-4">
          <ThemeToggler />
        </div>
        {/* Main content */}
        <div className="flex flex-grow items-center justify-center">
          <IdeaBoard />
        </div>
      </main>
    </HydrateClient>
  );
}
