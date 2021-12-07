import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";

function MyApp({ Component, pageProps: { sess, ...pageProps } }) {
  return (
    <SessionProvider session={sess}>
      <RecoilRoot>
        <Component {...pageProps} />;
      </RecoilRoot>
    </SessionProvider>
  );
}

export default MyApp;
