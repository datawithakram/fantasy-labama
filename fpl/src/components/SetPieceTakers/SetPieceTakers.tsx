import { ThunkDispatch } from "core-integration/src/store";
import { getElements } from "core-integration/src/store/elements/reducers";
import { showElementSummary } from "core-integration/src/store/elements/thunks";
import { getTeams } from "core-integration/src/store/teams/reducers";
import { Badge } from "plos/src/components/Badge";
import { Button } from "plos/src/components/buttons/Button";
import PageTitle from "plos/src/components/PageTitle";
import Subheading from "plos/src/components/Subheading";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { WebViewContext } from "plos/src/contexts/WebViewContext";
import ExternalIcon from "plos/src/img/icons/external.svg?react";
import { externalLinkIcon } from "plos/src/components/links/links.css";
import { contentMain, rightSidebarLayout } from "plos/src/layouts";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
} from "react-aria-components";
import { useDispatch, useSelector } from "react-redux";
import { useTrackingContext } from "../../contexts/TrackingContext";
import ChevronDown from "../../img/icons/chevron-down.svg?react";
import Info from "../../img/icons/info.svg?react";
import { HelmetHead } from "../HelmetHead";
import ScoutNav from "../scout/ScoutNav";
import { reduceElementsBySetPieceTakers, reduceNotesByTeamId } from "./helpers";
import {
  badgeWrap,
  chevronDown,
  disclosureHeading,
  elementStyles,
  explainedSection,
  noteItem,
  noteLink,
  noteList,
  setPieceTakersStyles,
  setPieceTakersWrapper,
  setPieceTitle,
  teamContentInner,
  teamDetails,
  teamName,
} from "./setPieceTakers.css";
import { INote, ISPTElement, ISPTTeam, IStateNotes } from "./types";

const SetPieceTakers = () => {
  const dispatch = useDispatch<ThunkDispatch>();
  const teams = useSelector(getTeams);
  const elements = useSelector(getElements);
  const [notes, setNotes] = useState({} as IStateNotes);
  const setPieceTakersByTeamId = useMemo(
    () => reduceElementsBySetPieceTakers(elements, teams),
    [elements, teams]
  );
  const teamsArr: ISPTTeam[] = Object.keys(setPieceTakersByTeamId)
    .map((key: string) => setPieceTakersByTeamId[key])
    .sort((a, b) => a.team.name.localeCompare(b.team.name));

  const { isWebView } = useContext(WebViewContext);
  const { firePageViewEvent } = useTrackingContext();

  useEffect(() => {
    firePageViewEvent("fantasy scout", "set piece takers");
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/team/set-piece-notes/");
        const { last_updated, teams } = await res.json();
        setNotes({ last_updated, byId: reduceNotesByTeamId(teams) });
      } catch (error) {
        // continue regardless of error
      }
    }
    fetchData();
  }, []);

  const renderElements = (setPieceTypes: ISPTElement[]) => {
    if (setPieceTypes.length === 0) {
      return <div className={elementStyles}>No Set-Piece Takers</div>;
    }

    return setPieceTypes
      .sort((a: ISPTElement, b: ISPTElement) => a.order - b.order)
      .map((element: ISPTElement) => (
        <div className={elementStyles} data-testid="element" key={element.id}>
          <Info onClick={() => dispatch(showElementSummary(element.id))} />
          <span>{element.name}</span>
        </div>
      ));
  };

  return (
    <div className={rightSidebarLayout}>
      <div className={contentMain}>
        {!isWebView && (
          <>
            <PageTitle title="The Scout" />
            <ScoutNav />
          </>
        )}
        <HelmetHead
          title="Set-Piece Takers, Player Statistics | Fantasy Premier League"
          description="View each Premier League team's set-piece takers for penalties, free kicks and corners. For more information, visit the official website of the Premier League."
        />
        <section className={setPieceTakersStyles}>
          <DisclosureGroup
            className={setPieceTakersWrapper}
            allowsMultipleExpanded
          >
            {teamsArr.map((t: ISPTTeam) => {
              const teamNotes = notes.byId?.[t.team.id];
              return (
                <Disclosure key={t.team.id} data-testid="team">
                  <SurfaceContainer>
                    <Button className={disclosureHeading} slot="trigger">
                      <div className={teamDetails}>
                        <span className={badgeWrap}>
                          <Badge team={t.team} isPresentation />
                        </span>
                        <h3 className={teamName}>{t.team.name}</h3>
                      </div>
                      <ChevronDown className={chevronDown} />
                    </Button>
                    <DisclosurePanel>
                      <div className={teamContentInner}>
                        <div>
                          <h4 className={setPieceTitle}>Penalties</h4>
                          {renderElements(t.penalties)}
                        </div>
                        <div>
                          <h4 className={setPieceTitle}>Direct free-kicks</h4>
                          {renderElements(t.direct_freekicks)}
                        </div>
                        <div>
                          <h4 className={setPieceTitle}>
                            Corners &amp; indirect free-kicks
                          </h4>
                          {renderElements(t.corners_and_indirect_freekicks)}
                        </div>
                      </div>
                      {notes.byId && teamNotes && (
                        <ul
                          data-testid={`team-${t.team.id}-notes`}
                          className={noteList}
                        >
                          {teamNotes.notes.length > 0 &&
                            teamNotes.notes.map(
                              (note: INote, index: number) => (
                                <li
                                  className={noteItem}
                                  key={`note-team-${t.team.id}-${index}`}
                                  data-testid={`team-${t.team.id}-note`}
                                >
                                  {note.info_message ? (
                                    note.source_link ? (
                                      <a
                                        href={note.source_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={noteLink}
                                      >
                                        <span>
                                          {note.info_message}
                                          {note.external_link && (
                                            <ExternalIcon
                                              className={externalLinkIcon}
                                            />
                                          )}
                                        </span>
                                      </a>
                                    ) : (
                                      <span>{note.info_message}</span>
                                    )
                                  ) : null}
                                </li>
                              )
                            )}
                        </ul>
                      )}
                    </DisclosurePanel>
                  </SurfaceContainer>
                </Disclosure>
              );
            })}
          </DisclosureGroup>
          <SurfaceContainer>
            <div className={explainedSection}>
              <Subheading>Set-Piece Takers Explained</Subheading>
              <p>
                This table displays a list of expected set-piece takers for each
                Premier League club. It’s based on a mix of information gathered
                from last season’s matches, pre-season friendlies and, where
                appropriate, a player’s role at a previous club and predicted
                role at their new club. As the season progresses, the table is
                constantly reviewed and updated as new information becomes
                available on assigned set-piece takers.
              </p>
            </div>
          </SurfaceContainer>
        </section>
      </div>
    </div>
  );
};

export default SetPieceTakers;
