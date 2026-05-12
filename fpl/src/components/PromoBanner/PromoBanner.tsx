import { breakpoints } from "plos/src/styles/breakpoints";
import { imgWrap, promoImg, promoLink } from "./promoBanner.css";

const promoUrl =
  "https://www.premierleague.com/en/news/4610531/premier-league-last-fan-standing-play-our-exciting-new-game";
const photoResourcesBase =
  "https://resources.premierleague.pulselive.com/photo-resources/2026/03/09";
const desktopSrc = `${photoResourcesBase}/f5907003-ee11-4743-be30-86aec45eb937/LFS2526_DesktopPromo-Leaderboard-1-.png?width=946&height=116`;
const mobileSrc1x = `${photoResourcesBase}/91cca285-27c9-4eb1-b4d2-bc725a742593/LFS2526_LaunchAsset-Button-1-4x3.png?width=375&height=281`;
const mobileSrc2x = `${photoResourcesBase}/91cca285-27c9-4eb1-b4d2-bc725a742593/LFS2526_LaunchAsset-Button-1-4x3.png?width=750&height=562`;

const PromoBanner = () => (
  <a className={promoLink} href={promoUrl}>
    <span className={imgWrap}>
      <picture>
        <source media={`(min-width: ${breakpoints[1]})`} srcSet={desktopSrc} />
        <img
          className={promoImg}
          src={mobileSrc1x}
          srcSet={`${mobileSrc1x}, ${mobileSrc2x} 2x`}
          alt="Play Last Fan Standing"
          decoding="async"
        />
      </picture>
    </span>
  </a>
);

export default PromoBanner;
