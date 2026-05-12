import adobeExpressDark from "../../../img/adobe/adobe-express-logo-dark.png";
import adobeExpress from "../../../img/adobe/adobe-express-logo.png";
import { adobeExpressLogo } from "./adobeExpressLogo.css";

const AdobeExpressLogo = ({ variant }: { variant: "panel" | "sheet" }) => (
  <picture>
    <source srcSet={adobeExpressDark} media="(prefers-color-scheme: dark)" />
    <img
      src={adobeExpress}
      alt="Adobe Express Logo"
      className={adobeExpressLogo[variant]}
    />
  </picture>
);

export default AdobeExpressLogo;
