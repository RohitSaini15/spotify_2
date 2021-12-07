import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  RssIcon,
} from "@heroicons/react/outline";
import useSpotify from "../hooks/useSpotify";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";

export default function Sidebar() {
  const spotifyApi = useSpotify();
  const [playlists, setPlaylists] = useState([]);
  const { data: session } = useSession();

  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [spotifyApi]);

  return (
    <div
      className="text-gray-500 p-5 text-sm border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide text-xs
     md:text-sm sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-36"
    >
      <div className="space-y-4">
        <button className="sidebarbtn">
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>

        <button className="sidebarbtn">
          <SearchIcon className="h-5 w-5" />
          <p>Search</p>
        </button>

        <button className="sidebarbtn">
          <LibraryIcon className="h-5 w-5" />
          <p>Your Library</p>
        </button>

        <hr className="border-t-[0.1px] border-gray-900" />

        <button className="sidebarbtn">
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>

        <button className="sidebarbtn">
          <HeartIcon className="h-5 w-5" />
          <p>Liked Songs</p>
        </button>

        <button className="sidebarbtn">
          <RssIcon className="h-5 w-5" />
          <p>Your episodes</p>
        </button>

        <hr className="border-t-[0.1px] border-gray-900" />

        {playlists.map((playlist) => {
          return (
            <div
              key={playlist.id}
              onClick={() => setPlaylistId(playlist.id)}
              className="hover:text-white cursor-pointer"
            >
              {playlist.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
