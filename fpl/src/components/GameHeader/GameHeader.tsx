import headlineLogo from "../../img/headline-logo.svg";
import { getPlayerComp } from "../../utils/player-comps";
import {
  gameHeaderContainerStyles,
  gameHeaderLogoStyles,
  gameHeaderStyles,
  playerLockupStyles,
} from "./GameHeader.css";
import Nav from "./Nav";

const GameHeader = () => (
  <header className={gameHeaderContainerStyles}>
    <div className={gameHeaderStyles}>
      <h1>
        <img
          src={headlineLogo}
          className={gameHeaderLogoStyles}
          alt="Fantasy Premier League"
        />
      </h1>
      <img
        src={getPlayerComp().x1}
        srcSet={`${getPlayerComp().x1} 1x, ${getPlayerComp().x2} 2x`}
        alt="Player images"
        className={playerLockupStyles}
      />
    </div>
    <Nav />
  </header>
);

export default GameHeader;
