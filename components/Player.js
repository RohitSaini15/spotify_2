import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/outline";

import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  RewindIcon,
  VolumeUpIcon,
  SwitchHorizontalIcon,
} from "@heroicons/react/solid";

import { debounce } from "lodash";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import useSongInfo from "../hooks/useSongInfo";

function Player() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(
    currentTrackIdState
  );
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now Playing: " + data.body?.item);
        setCurrentTrackId(data.body?.item?.id);
      });

      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        setIsPlaying(data.body?.is_playing);
      });
    }
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [spotifyApi, currentTrackId]);

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi
          .pause()
          .catch((error) => console.log("playing error", error));
        setIsPlaying(false);
      } else {
        spotifyApi.play().catch((error) => console.log("playing error", error));
        setIsPlaying(true);
      }
    });
  };

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi
        .setVolume(volume)
        .catch((error) => console.log("volume error", error));
    }, 500),
    []
  );

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  return (
    <div
      className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2
    md:px-8"
    >
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album?.images?.[0].url}
          alt=""
        ></img>
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0].name}</p>
        </div>
      </div>

      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon className="button" />

        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button h-10 w-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button h-10 w-10" />
        )}

        <FastForwardIcon className="button" />
        <ReplyIcon className="button" />
      </div>

      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon
          onClick={() => {
            setVolume(max(0, volume - 10));
          }}
          className="button"
        />
        <input
          type="range"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
        ></input>
        <VolumeUpIcon
          onClick={() => setVolume(min(100, volume + 10))}
          className="button"
        />
      </div>
    </div>
  );
}

export default Player;
