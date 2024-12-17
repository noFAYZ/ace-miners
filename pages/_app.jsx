import { chainURL } from "@/constant/consonants";
import { Polygon } from "@thirdweb-dev/chains";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import { ThemeProvider } from "next-themes";
import "../styles/globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function MyApp({ Component, pageProps }) {
  const queryClient = new QueryClient();
  const activeChainId = ChainId.Mumbai;

  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider
        chainRpc={{
          activeChainId: chainURL,
        }}
        activeChain={Polygon}
        desiredChainId={activeChainId}
        clientId="4fa9fe82f6216150b9907c61892801fe"
        autoConnect={true}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <div className="overlay-noise-effect fixed inset-0 z-[99] mix-blend-overlay pointer-events-none"></div>
          <Component {...pageProps} />
        </ThemeProvider>
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
