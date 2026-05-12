import { ThunkDispatch } from "core-integration/src/store";
import { getElementControls } from "core-integration/src/store/elements/reducers";
import {
  showElementSummary,
  updateElementControlsAndMaxCost,
} from "core-integration/src/store/elements/thunks";
import { getAffordableElementsFromControls } from "core-integration/src/store/squad/reducers";
import { getTeamsById } from "core-integration/src/store/teams/reducers";
import { integerToMoney, isMoneyStat } from "core-integration/src/utils/money";
import { Alert } from "plos/src/components/alerts";
import ElementDialogButton from "plos/src/components/ElementDialogButton";
import ElementInTable from "plos/src/components/ElementInTable";
import PageTitle from "plos/src/components/PageTitle";
import { paginate, Paginator } from "plos/src/components/Paginator";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { Cell, Column, Table } from "plos/src/components/Table";
import { rowStyles } from "plos/src/components/Table/tables.css";
import { rightSidebarLayout } from "plos/src/layouts";
import { listTableElementWrap } from "plos/src/styles/listTables.css";
import { fixedTable, scrollContainer } from "plos/src/styles/utils.css";
import { useEffect, useState } from "react";
import { Row, TableBody, TableHeader } from "react-aria-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  getStatDetails,
  getStatFormattedLabel,
  isStatName,
  statDetails,
  StatName,
} from "../../utils/stats";
import { HelmetHead } from "../HelmetHead";
// TODO - temporarily commented out until fix for news containers to show correct content (see below)
// import { newsGrid3fr } from "../news/news.css";
// import NewsContainer from "../news/NewsContainer/NewsContainer";
// import { renderNewsContent } from "../scout/Scout";
import { InfoText } from "plos/src/components/tooltips/InfoText";
import { useTrackingContext } from "../../contexts/TrackingContext";
import { ElementFilterChipRow } from "../SquadSelectionFilters";
import {
  statsElementCell,
  statsElementCol,
  statsStatCell,
  statsStatCol,
  statsTableWrapper,
  statsWrapper,
} from "./statistics.css";

const DEFAULT_STATS: readonly StatName[] = [
  "now_cost",
  "selected_by_percent",
  "form",
  "total_points",
];

const Statistics = () => {
  const { firePageViewEvent } = useTrackingContext();
  const dispatch = useDispatch<ThunkDispatch>();
  const { statName } = useParams();

  const [page, setPage] = useState(1);

  const controls = useSelector(getElementControls);
  const currencyDivisor = 10;
  const elements = useSelector(getAffordableElementsFromControls);
  const teamsById = useSelector(getTeamsById);
  const showElementDialog = (elementId: number) => {
    dispatch(showElementSummary(elementId));
  };

  useEffect(() => {
    firePageViewEvent("fantasy stats");
  }, []);

  useEffect(() => {
    dispatch(
      updateElementControlsAndMaxCost({
        ...controls,
        filter: "all",
        sort: statName || "total_points",
        search: "",
      })
    );
  }, []);

  useEffect(() => {
    // Reset to page 1 whenever any filters change
    setPage(1);
  }, [controls.filter, controls.sort, controls.maxCost]);

  const { data, totalPages } = paginate(elements.data, page, 30);

  const sortString = String(controls.sort);

  // Use type guard to get properly typed StatName or null
  const currentStatName = isStatName(sortString) ? sortString : null;

  // Get stat detail if we have a valid StatName
  const statDetail = currentStatName ? getStatDetails(currentStatName) : null;

  // Check if current stat is NOT in the default stats (type-safe, no cast needed)
  const hasExtraStatSelected = currentStatName
    ? !DEFAULT_STATS.includes(currentStatName)
    : false;

  // Combine checks - !! ensures boolean type for hasValidExtraStat
  const hasValidExtraStat = hasExtraStatSelected && !!statDetail;

  const { now_cost, selected_by_percent, total_points } = statDetails;

  return (
    <div className={rightSidebarLayout}>
      <HelmetHead
        title="Fantasy Football Statistics | Fantasy Premier League"
        description="To view statistics for all Fantasy Premier League players, or select by position or team, visit the official website of the Premier League."
      />

      <div className={statsWrapper}>
        <PageTitle title="Stats" />
        <ElementFilterChipRow />
        {statDetail && (
          <Alert isContentCentered>{statDetail.description}</Alert>
        )}
        <SurfaceContainer>
          <div className={scrollContainer}>
            <div className={statsTableWrapper}>
              <Table className={fixedTable} aria-label="Statistics">
                <TableHeader>
                  <Column isRowHeader className={statsElementCol}>
                    Player
                  </Column>
                  <Column className={statsStatCol}>
                    <InfoText label={now_cost.label}>
                      {now_cost.shortName}
                    </InfoText>
                  </Column>
                  <Column className={statsStatCol}>
                    <InfoText label={selected_by_percent.label}>
                      {selected_by_percent.shortName}
                    </InfoText>
                  </Column>
                  <Column className={statsStatCol}>Form</Column>
                  <Column className={statsStatCol}>
                    <InfoText label={total_points.label}>
                      {total_points.shortName}
                    </InfoText>
                  </Column>
                  {hasValidExtraStat && statDetail && (
                    <Column className={statsStatCol}>
                      <InfoText label={statDetail.label}>
                        {getStatFormattedLabel(statDetail.key)}
                      </InfoText>
                    </Column>
                  )}
                </TableHeader>
                <TableBody>
                  {data.map((e) => (
                    <Row key={e.id} className={rowStyles}>
                      <Cell className={statsElementCell}>
                        <div className={listTableElementWrap}>
                          <ElementDialogButton
                            elementId={e.id}
                            variant="list"
                          />
                          <ElementInTable
                            element={e}
                            team={teamsById[e.team]}
                            actionMe={() => showElementDialog(e.id)}
                            renderDreamTeam={e.in_dreamteam}
                          />
                        </div>
                      </Cell>
                      <Cell className={statsStatCell}>
                        {integerToMoney(e.now_cost, currencyDivisor)}
                      </Cell>
                      <Cell className={statsStatCell}>
                        {e.selected_by_percent}%
                      </Cell>
                      <Cell className={statsStatCell}>{e.form}</Cell>
                      <Cell className={statsStatCell}>{e.total_points}</Cell>
                      {hasValidExtraStat && statDetail && (
                        <Cell className={statsStatCell}>
                          {isMoneyStat(statDetail.key)
                            ? integerToMoney(
                                e[statDetail.key] as number,
                                currencyDivisor
                              )
                            : e[statDetail.key]}
                        </Cell>
                      )}
                    </Row>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Paginator
              totalPages={totalPages}
              page={page}
              setPage={setPage}
              variant="text"
            />
          </div>
        </SurfaceContainer>
      </div>
      {/* TODO - Ask Pulse why no onDemandUrl (thumb) is returned and add stacked variant */}
      {/* <div className={contentMain}>
        <NewsSection title="FPL Stats Explained">
          <NewsTagNameList tagName="FPL%20site%20HP" layout="threeColGrid" />
        </NewsSection>

        <NewsSection title="Latest FPL News">
          <NewsTagNameList
            tagName="Fantasy%20Football%20Scout"
            layout="threeColGrid"
          />
        </NewsSection>
      </div> */}
    </div>
  );
};

export default Statistics;
