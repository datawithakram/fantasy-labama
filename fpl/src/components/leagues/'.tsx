import { RootState, ThunkDispatch } from "core-integration/src/store";
import { getLeagueCupStatus } from "core-integration/src/store/leagues/reducers";
import { fetchLeagueCupStatus } from "core-integration/src/store/leagues/thunks";
import MoreLink from "plos/src/components/links/MoreLink";
import PageTitle from "plos/src/components/PageTitle";
import Subheading from "plos/src/components/Subheading";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { rightSidebarLayout } from "plos/src/layouts";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { HelmetHead } from "../HelmetHead";
import { standingsMainContent } from "./Classic/StandingsClassic/standingsClassic.css";

const CupNotStarted = () => {
  const { leagueId } = useParams();
  const reduxDispatch = useDispatch<ThunkDispatch>();

  const leagueNumber = Number(leagueId!) || 0;

  const cupStatus = useSelector((state: RootState) =>
    leagueNumber ? getLeagueCupStatus(state, leagueNumber) : null
  );

  useEffect(() => {
    if (leagueNumber && !cupStatus) {
      reduxDispatch(fetchLeagueCupStatus(leagueNumber));
    }
  }, [leagueNumber, cupStatus, reduxDispatch]);

  if (!cupStatus) {
    return null;
  }

  return (
    <>
      <HelmetHead
        title={`${cupStatus.name} - Pre Cup Match Info | Fantasy Premier League`}
        description={`To view the ${cupStatus.name} pre cup match info, as well as creating & joining new leagues, visit the official website of the Premier League.`}
      />
      <div className={rightSidebarLayout}>
        <SurfaceContainer>
          <div className={standingsMainContent}>
            <PageTitle title={cupStatus.name} />
            <MoreLink
              to={`/leagues/${leagueNumber}/standings/c`}
              variant="light"
            >
              View league standings
            </MoreLink>

            {cupStatus.qualification_event ? (
              <>
                <Subheading>{`The Cup is scheduled to start in GW${
                  cupStatus.qualification_event + 1
                }`}</Subheading>

                {cupStatus.has_byes ? (
                  <>
                    <p>
                      Fixtures will be determined at the end of Gameweek{" "}
                      {cupStatus.qualification_event}.{" "}
                      {cupStatus.qualification_numbers > 2 && (
                        <>
                          If there are {cupStatus.qualification_numbers} teams
                          in the associated league, then each team will have an
                          opponent in Gameweek{" "}
                          {cupStatus.qualification_event + 1}. If there are{" "}
                          {cupStatus.qualification_numbers === 4
                            ? "3 teams in the league, 1 team "
                            : `between
                    ${cupStatus.qualification_numbers / 2 + 1} and ${
                                cupStatus.qualification_numbers - 1
                              } teams in the league, some teams `}
                          will receive a bye in Gameweek{" "}
                          {cupStatus.qualification_event + 1} based on their
                          score in Gameweek {cupStatus.qualification_event}.
                        </>
                      )}
                    </p>

                    <p>
                      The starting round of the cup is determined by the number
                      of teams in the associated league and the final will be
                      contested in Gameweek 38.
                    </p>

                    <p>
                      You will not be entered into the cup if you have joined
                      the league after the Gameweek prior to the cup starting.
                    </p>

                    <Subheading>How the cup works</Subheading>
                    <p>
                      Each team will be randomly drawn against another unless
                      they have received a bye. The winner (the team with the
                      highest Gameweek score minus any transfer points), will
                      progress to the next round and another random draw, the
                      losers are out! This process continues until the final
                      round when the two remaining teams contest the cup final.
                      If a cup match is drawn, then the following tie-breaks
                      will be applied until a winner is found:
                    </p>
                    <ol>
                      <li>Most goals scored in the Gameweek</li>
                      <li>Fewest goals conceded in the Gameweek</li>
                      <li>Virtual coin toss</li>
                    </ol>
                  </>
                ) : (
                  <>
                    <p>
                      The top {cupStatus.qualification_numbers} ranked managers
                      in Gameweek {cupStatus.qualification_event} will be
                      entered into the first round of the cup in Gameweek{" "}
                      {cupStatus.qualification_event + 1}. The final will be
                      contested in Gameweek 38.
                    </p>

                    <Subheading>How the cup works</Subheading>
                    <p>
                      Each qualifying team will be randomly drawn against
                      another in the first round. The winner (the team with the
                      highest Gameweek score minus any transfer points), will
                      progress to the second round and another random draw, the
                      losers are out! This process continues until the final
                      round when the two remaining teams contest the cup final.
                      If a cup match is drawn, then the following tie-breaks
                      will be applied until a winner is found:
                    </p>
                    <ol>
                      <li>Most goals scored in the Gameweek</li>
                      <li>Fewest goals conceded in the Gameweek</li>
                      <li>Virtual coin toss</li>
                    </ol>
                  </>
                )}
              </>
            ) : (
              <p>There is no information available for this cup yet.</p>
            )}
          </div>
        </SurfaceContainer>
      </div>
    </>
  );
};

export default CupNotStarted;
