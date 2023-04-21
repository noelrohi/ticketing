import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import { ChakraProvider } from "@chakra-ui/react";
import { ChakraNav } from "~/components/nav";
import "~/styles/globals.css";
// import { Nav } from "~/components/nav";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        {/* <Nav /> */}
        <ChakraNav/>

        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
