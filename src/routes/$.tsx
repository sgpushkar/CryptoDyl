// File: src/routes/$.tsx
import { createFileRoute } from "@tanstack/react-router";
import { cryptodylBrandImage, cryptodylLogoImage } from "@/lib/assets";
import { SplashScreen } from "@/lib/splash-screen";
import { lazy, Suspense } from "react";

const App = lazy(() => import("@/cryptodyl/App"));

export const Route = createFileRoute("/$")({
  ssr: false,
  component: SpaShell,
  head: () => ({
    meta: [
      { title: "CryptoDyl — Premium Crypto Guides, Casinos & Passive Income" },
      {
        name: "description",
        content:
          "CryptoDyl is a futuristic crypto ecosystem with elite reviews, passive income guides, and casino bonuses — built for Web3 natives.",
      },
      { property: "og:title", content: "CryptoDyl — Premium Crypto Ecosystem" },
      {
        property: "og:description",
        content:
          "Elite crypto guides, casino reviews, and passive income strategies.",
      },
      { property: "og:image", content: cryptodylBrandImage },
    ],
  }),
});

function SpaShell() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <App />
    </Suspense>
  );
}
