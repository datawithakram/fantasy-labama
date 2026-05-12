import { ThunkDispatch } from "core-integration/src/store";
import { IElement } from "core-integration/src/store/elements/types";
import {
  getPlayerData,
  getWatched,
} from "core-integration/src/store/player/reducers";
import {
  addToWatchlist,
  removeFromWatchlist,
} from "core-integration/src/store/player/thunks";
import { Button } from "plos/src/components/buttons/Button";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const WatchlistButton = ({ element }: { element: IElement }) => {
  const dispatch = useDispatch<ThunkDispatch>();
  const [added, setAdded] = useState(false);
  const player = useSelector(getPlayerData);
  const watched = useSelector(getWatched);

  if (!player || !player.entry) return null;

  const addToWatched = (elementCode: number) =>
    dispatch(addToWatchlist(elementCode));
  const removeFromWatched = (elementCode: number) =>
    dispatch(removeFromWatchlist(elementCode));

  const inWatched = watched.indexOf(element.code) > -1;
  if (inWatched) {
    return added ? (
      <p>View your watchlist on the transfers page</p>
    ) : (
      <Button
        size="small"
        onPress={() => {
          removeFromWatched(element.code);
        }}
        fullWidth
      >
        Remove from Watchlist
      </Button>
    );
  }
  return (
    <Button
      size="small"
      onPress={() => {
        setAdded(true);
        addToWatched(element.code);
      }}
      fullWidth
    >
      Add to Watchlist
    </Button>
  );
};

export default WatchlistButton;
