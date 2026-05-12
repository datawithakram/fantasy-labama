import { RootState } from "core-integration/src/store";
import { getEntry } from "core-integration/src/store/entries/reducers";
import {
  getCurrentEvent,
  getEventsById,
} from "core-integration/src/store/events/reducers";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import PageTitle from "plos/src/components/PageTitle";
import Subheading from "plos/src/components/Subheading";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import {
  contentMain,
  homeImage,
  homeImageContainer,
  homeStep,
  homeSteps,
  pagePadding,
} from "plos/src/layouts";
import { visuallyHidden } from "plos/src/styles/utils.css";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useTrackingContext } from "../contexts/TrackingContext";
import competeAgainstFriends from "../img/home/compete-against-friends.png";
import competeAgainstFriendsx2 from "../img/home/compete-against-friends_x2.png";
import createLeagues from "../img/home/create-and-join-leagues.png";
import createLeaguesx2 from "../img/home/create-and-join-leagues_x2.png";
import pickYourSquad from "../img/home/pick-your-squad.png";
import pickYourSquadx2 from "../img/home/pick-your-squad_x2.png";
import { HelmetHead } from "./HelmetHead";
import LatestAlert from "./LatestAlert";
import LoginPromo from "./Login/LoginPromo";
import { PromoBanner } from "./PromoBanner";
import { shouldShowPromoBanner } from "./PromoBanner/utils";
import { NewsPlaylist } from "./news/NewsPlaylist";
import { NewsSection } from "./news/NewsSection";
import Status from "./status/Status";

const Home = () => {
  const { firePageViewEvent } = useTrackingContext();

  const player = useSelector(getPlayerData);
  const entry = useSelector((state: RootState) =>
    player?.entry ? getEntry(state, player.entry) : null
  );

  const now = useSelector(getCurrentEvent);
  const eventsById = useSelector(getEventsById);

  useEffect(() => {
    firePageViewEvent("fantasy home");
  }, []);

  // Dev mode only ability to throw an error for sentry testing
  if (import.meta.env.DEV) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("testError") === "true") {
      throw new Error("Test route error");
    }
  }

  // Delay rendering until entry is available
  if (player && player.entry && !entry) {
    return null;
  }

  // Show the status page if you have a team and the game has started
  if (now && player && entry) {
    return <Status entry={entry} now={now} />;
  }

  const showPromoBanner = shouldShowPromoBanner(
    eventsById?.[31]?.deadline_time
  );

  return (
    <>
      <HelmetHead
        title="Fantasy Premier League, Official Fantasy Football Game of the Premier League"
        description="Official Fantasy Premier League 2025/26. Free to play fantasy football game, set up your fantasy football team at the Official Premier League site."
      />
      <div className={pagePadding}>
        <div className={contentMain}>
          <div className={visuallyHidden}>
            <PageTitle title="Home" />
          </div>
          <LatestAlert />
          {showPromoBanner && <PromoBanner />}
          <LoginPromo />
          <div className={homeSteps}>
            <div className={homeStep}>
              <SurfaceContainer>
                <div className={contentMain}>
                  <div className={homeImageContainer}>
                    <img
                      srcSet={`${pickYourSquad}, ${pickYourSquadx2} 2x`}
                      alt=""
                      className={homeImage}
                    />
                  </div>
                  <Subheading>Pick Your Squad</Subheading>
                  <p>
                    Use your budget of £100m to pick a squad of 15 players from
                    the Premier League.
                  </p>
                </div>
              </SurfaceContainer>
            </div>

            <div className={homeStep}>
              <SurfaceContainer>
                <div className={contentMain}>
                  <div className={homeImageContainer}>
                    <img
                      srcSet={`${createLeagues}, ${createLeaguesx2} 2x`}
                      alt=""
                      className={homeImage}
                    />
                  </div>
                  <Subheading>Create and Join Leagues</Subheading>
                  <p>
                    Play against friends and family, colleagues or a web
                    community in invitational leagues and cups.
                  </p>
                </div>
              </SurfaceContainer>
            </div>

            <div className={homeStep}>
              <SurfaceContainer>
                <div className={contentMain}>
                  <div className={homeImageContainer}>
                    <img
                      srcSet={`${competeAgainstFriends}, ${competeAgainstFriendsx2} 2x`}
                      alt=""
                      className={homeImage}
                    />
                  </div>
                  <Subheading>Compete Against Friends</Subheading>
                  <p>
                    Play against friends and family, colleagues or a web
                    community in invitational leagues and cups.
                  </p>
                </div>
              </SurfaceContainer>
            </div>
          </div>
          <NewsSection title="Latest from The Scout">
            <NewsPlaylist
              layout="scrollableRow"
              playlistId={4349947}
              variant="scrollable"
            />
          </NewsSection>
        </div>
      </div>
    </>
  );
};

export default Home;
