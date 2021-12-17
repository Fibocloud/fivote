import Head from "next/head";
import { AppProps } from "next/app";
import "tailwindcss/tailwind.css";
import "styles/globals.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import SocketProvider from "context/socket";
import { createEmotionCache, MuiTheme } from "init";

const clientSideEmotionCache = createEmotionCache();

interface Props extends AppProps {
  emotionCache?: EmotionCache;
}

export default function _({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: Props) {
  return (
    <SocketProvider>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={MuiTheme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    </SocketProvider>
  );
}
