import { RootState, ThunkDispatch } from "core-integration/src/store";
import { joinPrivateLeague } from "core-integration/src/store/leagues/thunks";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import { ILoggedInPlayer } from "core-integration/src/store/player/types";
import { getRegions } from "core-integration/src/store/regions/reducers";
import { Button } from "plos/src/components/buttons/Button";
import { Cell } from "plos/src/components/Table";
import { textTruncate } from "plos/src/styles";
import { Row } from "react-aria-components";
import { useDispatch, useSelector } from "react-redux";
import { ukISOCodes } from "../../../../../utils/regions";
import {
  cellStyles,
  joinButtonStyles,
  optionsCellStyles,
} from "../leagueTypeTable.css";
import { ITNTLeagueRowProps } from "./types";

const TNTLeagueRow = ({ leagues }: ITNTLeagueRowProps) => {
  const dispatch = useDispatch<ThunkDispatch>();

  const player = useSelector(
    (state: RootState) => getPlayerData(state) as ILoggedInPlayer
  );
  const regions = useSelector((state: RootState) => getRegions(state));

  const permittedRegionIds = regions
    .filter((region) => ukISOCodes.includes(region.iso_code_long))
    .map((region) => region.id);
  const hasTNTLeague = leagues.some(
    (league) =>
      league.name === "TNT Sports League" && league.league_type === "s"
  );
  const isEligibleRegion = permittedRegionIds.includes(Number(player?.region));

  if (hasTNTLeague || !isEligibleRegion) return null;
  return (
    <Row key={"TNT"}>
      <Cell className={cellStyles}>
        <div className={textTruncate}>TNT Sports League</div>
      </Cell>
      <Cell />
      <Cell />
      <Cell className={optionsCellStyles}>
        <Button
          onPress={() => dispatch(joinPrivateLeague({ code: "tnt" }))}
          styleVariant="tonal"
          size="small"
          className={joinButtonStyles}
        >
          Join
        </Button>
      </Cell>
    </Row>
  );
};

export default TNTLeagueRow;
