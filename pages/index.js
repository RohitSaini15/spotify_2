import Sidebar from "../components/Sidebar";
import Center from "../components/Center";
import { useSession, getSession } from "next-auth/react";
import Player from "../components/Player";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="bg-black overflow-hidden h-screen">
      <main className="flex">
        <Sidebar />
        <Center />
      </main>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const sess = await getSession(context);

  return {
    props: { sess },
  };
}
