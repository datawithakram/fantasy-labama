import playerComp1 from "../img/player-comps/player-comp-1-1x.png";
import playerComp1x2 from "../img/player-comps/player-comp-1-2x.png";
import playerComp2 from "../img/player-comps/player-comp-2-1x.png";
import playerComp2x2 from "../img/player-comps/player-comp-2-2x.png";
import playerComp3 from "../img/player-comps/player-comp-3-1x.png";
import playerComp3x2 from "../img/player-comps/player-comp-3-2x.png";
import playerComp4 from "../img/player-comps/player-comp-4-1x.png";
import playerComp4x2 from "../img/player-comps/player-comp-4-2x.png";
import playerComp5 from "../img/player-comps/player-comp-5-1x.png";
import playerComp5x2 from "../img/player-comps/player-comp-5-2x.png";

export interface IPlayerCompProps {
  images: Record<string, string>;
}

let choice = -1;

export const getPlayerComp = () => {
  const playerImages = [
    {
      x1: playerComp1,
      x2: playerComp1x2,
    },
    {
      x1: playerComp2,
      x2: playerComp2x2,
    },
    {
      x1: playerComp3,
      x2: playerComp3x2,
    },
    {
      x1: playerComp4,
      x2: playerComp4x2,
    },
    {
      x1: playerComp5,
      x2: playerComp5x2,
    },
  ];
  if (choice < 0) {
    choice = Math.floor(Math.random() * playerImages.length);
  }
  return playerImages[choice];
};
