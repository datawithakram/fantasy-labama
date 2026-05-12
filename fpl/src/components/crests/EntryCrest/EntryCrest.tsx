import { RootState, ThunkDispatch } from "core-integration/src/store";
import { selectIsMyEntry } from "core-integration/src/store/player/reducers";
import { EntryCrestData, openCrestSheet } from "core-integration/src/store/ui";
import { ReactNode } from "react";
import { Button } from "react-aria-components";
import { useDispatch, useSelector } from "react-redux";
import AddCrestIcon from "../../../img/adobe/add-crest.svg?react";
import BlankCrestIcon from "../../../img/adobe/blank-crest.svg?react";
import PendingCrestIcon from "../../../img/adobe/pending-crest.svg?react";
import { fluidCrestImg } from "../sharedStyles.css";
import {
  crestButtonStyles,
  crestImgStyles,
  iconFillBlank,
  iconFillInteractive,
} from "./entryCrest.css";

interface CrestButtonProps {
  ariaLabel: string;
  children: ReactNode;
  onPress: () => void;
}

interface EntryCrestProps {
  entryCrestData: EntryCrestData;
  dimension?: number;
}

const CrestButton = ({ children, onPress, ariaLabel }: CrestButtonProps) => {
  return (
    <Button
      onPress={onPress}
      className={crestButtonStyles}
      aria-label={ariaLabel}
    >
      {children}
    </Button>
  );
};

const buildFastlyUrl = (src: string, dim: number) => {
  const url = new URL(src, window.location.origin).toString();
  return `${url}?width=${dim}&height=${dim}`;
};

const EntryCrest = ({ entryCrestData, dimension }: EntryCrestProps) => {
  const mine = useSelector((state: RootState) =>
    selectIsMyEntry(state, entryCrestData.id)
  );

  const dispatch = useDispatch<ThunkDispatch>();

  const handleOpenSheet = () => {
    dispatch(openCrestSheet(entryCrestData));
  };

  const crestSrc = entryCrestData.club_badge_src;
  const iconSize = dimension
    ? { width: dimension, height: dimension }
    : undefined;

  // No crest
  if (!crestSrc) {
    if (mine) {
      return (
        <CrestButton
          onPress={handleOpenSheet}
          ariaLabel="Create your team badge"
        >
          <AddCrestIcon
            className={iconFillInteractive}
            aria-hidden="true"
            {...iconSize}
          />
        </CrestButton>
      );
    }
    return (
      <BlankCrestIcon
        className={iconFillBlank}
        aria-hidden="true"
        {...iconSize}
      />
    );
  }

  // Pending
  if (crestSrc === "Pending") {
    if (mine) {
      return (
        <CrestButton
          onPress={handleOpenSheet}
          ariaLabel="Badge pending moderation: View more information"
        >
          <PendingCrestIcon
            className={iconFillInteractive}
            aria-hidden="true"
            {...iconSize}
          />
        </CrestButton>
      );
    }
    return (
      <PendingCrestIcon
        title="Badge pending moderation"
        role="img"
        className={iconFillInteractive}
        {...iconSize}
      />
    );
  }

  const optimizedSrc =
    dimension && crestSrc ? buildFastlyUrl(crestSrc, dimension) : null;

  // Crest exists
  if (optimizedSrc) {
    return (
      <CrestButton
        onPress={handleOpenSheet}
        ariaLabel={`View ${entryCrestData.name} badge`}
      >
        <img
          srcSet={`${optimizedSrc}&dpr=1.5 1.5x, ${optimizedSrc}&dpr=2 2x`}
          src={optimizedSrc}
          alt=""
          width={dimension}
          height={dimension}
          className={crestImgStyles}
        />
      </CrestButton>
    );
  }

  return (
    <CrestButton
      onPress={handleOpenSheet}
      ariaLabel={`View ${entryCrestData.name} badge`}
    >
      <img src={crestSrc} alt="" className={fluidCrestImg} />
    </CrestButton>
  );
};

export default EntryCrest;
