import { ThunkDispatch } from "core-integration/src/store";
import { clearCode, setCode } from "core-integration/src/store/leagues/thunks";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

// AutoJoin component simply stores the code in local storage and redirects
// the user somewhere sensible.

const AutoJoin = () => {
  const { code } = useParams();
  const reduxDispatch = useDispatch<ThunkDispatch>();
  const navigate = useNavigate();
  const player = useSelector(getPlayerData);

  useEffect(() => {
    if (code) {
      reduxDispatch(setCode(code));
    } else {
      reduxDispatch(clearCode());
    }
  });
  const next =
    player && player.entry ? "/my-team" : player ? "/squad-selection" : "/";

  // Need this to make sure LocationProvider is ready
  setTimeout(() => {
    return navigate(next, {
      replace: true,
    });
  }, 0);
  return <div />;
};

export default AutoJoin;
