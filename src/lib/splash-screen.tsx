import { cryptodylLogoImage } from "@/lib/assets";

export function SplashScreen() {
  return (
    <div className="splash-screen" role="status" aria-live="polite">
      <div className="splash-screen__panel">
        <div className="splash-screen__brand">
          <img
            src={cryptodylLogoImage}
            alt=""
            aria-hidden="true"
            className="splash-screen__logo"
          />
          <div>
            <div className="splash-screen__eyebrow">CryptoDyl</div>
            <div className="splash-screen__title">Loading the market feed</div>
          </div>
        </div>

        <div className="splash-screen__bar" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
