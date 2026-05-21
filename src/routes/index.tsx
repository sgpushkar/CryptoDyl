// File: src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { cryptodylBrandImage, cryptodylLogoImage } from "@/lib/assets";
import { lazy, Suspense } from "react";

const App = lazy(() => import("@/cryptodyl/App"));

export const Route = createFileRoute("/")({
  ssr: false,
  component: Index,
  head: () => ({
    meta: [
      { title: "CryptoDyl — Premium Crypto Guides & Passive Income" },
      {
        name: "description",
        content: "CryptoDyl is a futuristic crypto ecosystem with elite reviews, passive income guides, and casino bonuses.",
      },
      { property: "og:title", content: "CryptoDyl — Premium Crypto Ecosystem" },
      {
        property: "og:description",
        content: "Elite crypto guides, casino reviews, and passive income strategies.",
      },
      { property: "og:image", content: cryptodylBrandImage },
    ],
  }),
});

function Index() {
  return (
    <Suspense
      fallback={
        <div className="splash-screen">
          <div className="terminal-loader">INITIALIZING CRYPTODYL...</div>
        </div>
      }
    >
      <App />
    </Suspense>
  );
}