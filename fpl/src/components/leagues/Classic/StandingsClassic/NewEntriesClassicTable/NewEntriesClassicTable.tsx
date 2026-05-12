import { RootState } from "core-integration/src/store";
import { getClassicNewEntries } from "core-integration/src/store/leagues/reducers";
import Subheading from "plos/src/components/Subheading";
import { Column, Table } from "plos/src/components/Table";
import { rowStyles } from "plos/src/components/Table/tables.css";
import ButtonLink from "plos/src/components/links/ButtonLink";
import RouterLink from "plos/src/components/links/RouterLink";
import { fixedTable } from "plos/src/styles/utils.css";
import { Cell, Row, TableBody, TableHeader } from "react-aria-components";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { ControlArrowLeft, ControlArrowRight } from "../../../../icons/Arrows";
import {
  nextButton,
  pager,
} from "../../../shared/styles/leaguesTableStyles.css";
import { getQueryParam, updateQueryParams } from "../utils";
import {
  newEntriesTableCell,
  newEntriesTableCol,
} from "./newEntriesClassicTable.css";

interface NewEntriesClassicTableProps {
  leagueNumber: number;
}

const NewEntriesClassicTable = ({
  leagueNumber,
}: NewEntriesClassicTableProps) => {
  const location = useLocation();

  const pageNewEntries = getQueryParam({ location, key: "page_new_entries" });
  const pageNewEntriesAsNumber = pageNewEntries
    ? parseInt(pageNewEntries, 10)
    : 1;

  const newEntries = useSelector((state: RootState) =>
    getClassicNewEntries(state, leagueNumber, pageNewEntriesAsNumber)
  );

  const previousLink = updateQueryParams({
    location,
    newParams: { page_new_entries: pageNewEntriesAsNumber - 1 },
  });
  const nextLink = updateQueryParams({
    location,
    newParams: { page_new_entries: pageNewEntriesAsNumber + 1 },
  });

  return (
    <>
      {newEntries && newEntries.results.length > 0 && (
        <>
          <Subheading>New entries</Subheading>
          <Table className={fixedTable} aria-label="New Entries">
            <TableHeader>
              <Column className={newEntriesTableCol}>Team</Column>
              <Column isRowHeader className={newEntriesTableCol}>
                Manager
              </Column>
            </TableHeader>
            <TableBody>
              {newEntries.results.map((ne) => (
                <Row key={ne.entry} className={rowStyles}>
                  <Cell className={newEntriesTableCell}>{ne.entry_name}</Cell>
                  <Cell className={newEntriesTableCell}>
                    <RouterLink to={`/entry/${ne.entry}/history`}>
                      {ne.player_first_name} {ne.player_last_name}
                    </RouterLink>
                  </Cell>
                </Row>
              ))}
            </TableBody>
          </Table>
          {/*  TODO update to new Pager Buttons */}
          {newEntries && (
            <div className={pager}>
              {pageNewEntriesAsNumber > 1 && (
                <ButtonLink to={previousLink} styleVariant="tonal" size="small">
                  <ControlArrowLeft />
                  <span>Previous</span>
                </ButtonLink>
              )}
              {newEntries.has_next && (
                <ButtonLink
                  to={nextLink}
                  styleVariant="tonal"
                  size="small"
                  className={nextButton}
                >
                  <span>Next</span>
                  <ControlArrowRight />
                </ButtonLink>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default NewEntriesClassicTable;
