import {
  getCurrentEvent,
  getEventsById,
} from "core-integration/src/store/events/reducers";
import { formatRawAsLocal } from "core-integration/src/utils/datetime";
import Button from "plos/src/components/buttons/Button/Button";
import Dialog from "plos/src/components/Dialog";
import HorizontalDivider from "plos/src/components/HorizontalDivider";
import ButtonLink from "plos/src/components/links/ButtonLink";
import ExternalLink from "plos/src/components/links/ExternalLink";
import useIsMobile from "plos/src/hooks/useIsMobile";
import { contentMain } from "plos/src/layouts";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { useAdobeContext } from "../../../contexts/AdobeContext";
import FPLChallengeLogo from "../../../img/fpl-challenge-logo.svg?react";
import adobeXFpl from "../../../img/FPLxAdobeModal.png";
import adobeXFplMobile from "../../../img/FPLxAdobeModalMobile.png";
import { ControlArrowRight } from "../../icons/Arrows";
import {
  adobeImageContainer,
  adobeXFplImage,
  challengeCopy,
  challengePanelContent,
  festiveChallengePanelBackground,
  teamSavedModalContainer,
} from "./teamSavedModal.css";

interface BaseModalProps {
  isOpen: boolean;
  closeDialog: () => void;
  children: ReactNode;
  headerVariant?: "standard" | "gradient";
}

const TeamSavedModalBase = ({
  isOpen,
  closeDialog,
  children,
  headerVariant = "standard",
}: BaseModalProps) => (
  <Dialog
    isOpen={isOpen}
    handleClose={closeDialog}
    headerVariant={headerVariant}
  >
    <div className={teamSavedModalContainer}>{children}</div>
  </Dialog>
);

const DefaultTeamSavedContent = () => (
  <>
    <h3>Team Saved</h3>
    <p>
      Dive into your leagues to track your performance, compare and see how you
      measure up against other managers.
    </p>
    <HorizontalDivider />
    <ButtonLink to="../leagues" size="small">
      View my Leagues
      <ControlArrowRight />
    </ButtonLink>
  </>
);

const PlayChallengePanel = () => {
  const eventsById = useSelector(getEventsById);
  const currentEvent = useSelector(getCurrentEvent);

  return (
    <>
      <h3>Team Saved</h3>
      <div className={festiveChallengePanelBackground}>
        <div className={challengePanelContent}>
          <FPLChallengeLogo />
          <p className={challengeCopy}>
            Play the Festive Fixtures event in FPL Challenge for the chance to
            win £500 of club merchandise every Gameweek.
          </p>
          <ButtonLink
            to="https://fplchallenge.premierleague.com/"
            styleVariant="glass"
            textWrap
          >
            Select your FPL Challenge lineup now!
            <div>
              <ControlArrowRight />
            </div>
          </ButtonLink>
        </div>
      </div>
      {/* No longer show the chips messaging once GW19 starts and the refresh has happened */}
      {currentEvent && currentEvent.id < 19 && (
        <>
          <HorizontalDivider />
          <strong>Use Your Chips</strong>
          <p>
            Use them or lose them! FPL chips will be refreshed in Gameweek 20 -
            use your existing chips before the Gameweek 19 deadline of{" "}
            {formatRawAsLocal(eventsById[19].deadline_time)}.
          </p>
          <p>
            <ExternalLink href="https://www.premierleague.com/en/news/4362085/when-to-use-your-remaining-chips-in-fpl-before-the-gw19-cut-off">
              Learn more about the chip refresh.
            </ExternalLink>
          </p>
        </>
      )}
    </>
  );
};

const ChallengeTeamSavedContent = () => (
  <>
    <PlayChallengePanel />
  </>
);

interface AdobeTeamSavedContentProps {
  handleCreateCrest: (img: Blob, prompt: string) => Promise<void>;
  closeDialog: () => void;
}

const AdobeTeamSavedContent = ({
  handleCreateCrest,
  closeDialog,
}: AdobeTeamSavedContentProps) => {
  const { embed } = useAdobeContext();
  const isMobile = useIsMobile();
  const adobeImage = isMobile ? adobeXFplMobile : adobeXFpl;

  return (
    <>
      <div className={adobeImageContainer}>
        <img
          src={adobeImage}
          className={adobeXFplImage}
          alt="Adobe x FPL Badge Creator"
        />
      </div>
      <div className={contentMain}>
        <h3>Your team, your badge.</h3>
        <p>
          Create your team badge to enter the Adobe Express Badge League to
          compete for a VIP Premier League Experience.
        </p>
        <Button
          onPress={() => {
            closeDialog();
            embed.createImage(async (img, prompt) => {
              await handleCreateCrest(img, prompt);
            });
          }}
          size="small"
        >
          Generate Team Badge
          <ControlArrowRight />
        </Button>
        <HorizontalDivider />
        <p>Your Team has been Saved</p>
      </div>
    </>
  );
};

const AfconContent = () => {
  const eventsById = useSelector(getEventsById);
  return (
    <>
      <h3>AFCON Transfers</h3>
      <p>
        All Managers in Fantasy Premier League will be given extra free
        transfers in Gameweek 16 to help plan around this season’s Africa Cup of
        Nations (AFCON).
      </p>
      <p>
        Your total number of free transfers will be topped up to the maximum
        possible number of five immediately after the Gameweek 15 deadline (
        {formatRawAsLocal(eventsById[15].deadline_time)}), ahead of Gameweek 16.
        The transfers do not need to be used in Gameweek 16, they can be carried
        over between Gameweeks and used at any time.
      </p>
      <p>
        <ExternalLink href="https://www.premierleague.com/en/news/4461660/fpl-managers-to-have-five-free-transfers-on-saturday-all-you-need-to-know">
          Learn more about AFCON transfers.
        </ExternalLink>
      </p>
      <HorizontalDivider />
      <ButtonLink to="../leagues" size="small">
        View my Leagues
        <ControlArrowRight />
      </ButtonLink>
    </>
  );
};

export type TeamSavedPromotion = "default" | "challenge" | "adobe" | "afcon";

interface TeamSavedModalProps {
  isOpen: boolean;
  closeDialog: () => void;
  currentPromotion: TeamSavedPromotion;
  handleCreateCrest: (img: Blob, prompt: string) => Promise<void>;
}

const TeamSavedModal = ({
  isOpen,
  closeDialog,
  currentPromotion,
  handleCreateCrest,
}: TeamSavedModalProps) => {
  const baseProps = { isOpen, closeDialog };

  switch (currentPromotion) {
    case "adobe":
      return (
        <TeamSavedModalBase {...baseProps} headerVariant="gradient">
          <AdobeTeamSavedContent
            handleCreateCrest={handleCreateCrest}
            closeDialog={closeDialog}
          />
        </TeamSavedModalBase>
      );
    case "challenge":
      return (
        <TeamSavedModalBase {...baseProps}>
          <ChallengeTeamSavedContent />
        </TeamSavedModalBase>
      );
    case "afcon":
      return (
        <TeamSavedModalBase {...baseProps}>
          <AfconContent />
        </TeamSavedModalBase>
      );
    default:
      return (
        <TeamSavedModalBase {...baseProps}>
          <DefaultTeamSavedContent />
        </TeamSavedModalBase>
      );
  }
};

export default TeamSavedModal;
