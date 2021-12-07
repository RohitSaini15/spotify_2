import spotifyApi from "../lib/spotify.js";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

export default function useSpotify() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      if (session.error === "RefreshAccessTokenError") {
        signIn();
      }
      spotifyApi.setAccessToken(session.user.accessToken);
    }
  }, [session]);

  return spotifyApi;
}
