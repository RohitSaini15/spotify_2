import { useSession, signOut } from "next-auth/react";
import { ChevronDoubleDownIcon } from "@heroicons/react/outline";
import { shuffle } from "lodash";
import { useState, useEffect } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

export default function Center() {
  const [color, setColor] = useState(null);
  const { data: session } = useSession();
  const spotifyApi = useSpotify();

  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getPlaylist(playlistId)
        .then((data) => {
          setPlaylist(data.body);
        })
        .catch((e) => console.log("error occur in fetching playlist"));
    }
  }, [spotifyApi, playlistId]);

  return (
    <div className="flex-grow h-screen overflow-y-scroll">
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center bg-black bg-black-300 space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2"
          onClick={signOut}
        >
          <img
            className="w-10 h-10 rounded-full"
            src={session?.user?.image}
            alt=""
          ></img>
          <h2 className="text-white">{session?.user?.name}</h2>
          <ChevronDoubleDownIcon className="h-5 w-5 text-white" />
        </div>
      </header>

      <section
        className={
          "flex items-end space-x-7 bg-gradient-to-b to-black text-white h-80 p-8 " +
          color
        }
      >
        <img
          src={playlist?.images?.[0].url}
          className="h-44 w-44 shadow-2xl"
          alt=""
        ></img>

        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold ">
            {playlist?.name}
          </h1>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  );
}
