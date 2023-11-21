import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import { BasketProvider } from "@/components/basketProvider";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <BasketProvider>
        <Component {...pageProps} />
      </BasketProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
