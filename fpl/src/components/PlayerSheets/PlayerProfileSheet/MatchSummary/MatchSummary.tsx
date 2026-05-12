import { RootState } from "core-integration/src/store";
import {
  getFixturesWithBlanks,
  getHistory,
} from "core-integration/src/store/elements/reducers";
import {
  IElement,
  IElementFixture,
} from "core-integration/src/store/elements/types";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { useSelector } from "react-redux";
import { BlankMatch, FixtureItem, HistoryItem, MatchGroup } from "./MatchGroup";
import { matchesSummary } from "./matchSummary.css";

interface MatchSummaryProps {
  element: IElement;
}

const MatchSummary = ({ element }: MatchSummaryProps) => {
  const { id: elementId } = element;
  const fixtures = useSelector((state: RootState) =>
    getFixturesWithBlanks(state, elementId)
  );
  const history = useSelector((state: RootState) =>
    getHistory(state, elementId)
  );

  // Remove any fixtures from history. This can happen when a fixture in the current event is yet to start.
  const getHistoryWithoutFixtures = () => {
    const fixtureIds = new Set(
      fixtures.filter((f): f is IElementFixture => "id" in f).map((f) => f.id)
    );
    return history.filter((h) => !fixtureIds.has(h.fixture));
  };

  const lastFiveHistory = getHistoryWithoutFixtures().slice(-5).reverse();
  const nextFiveFixtures = fixtures.slice(0, 5);
  const allFixturesBlank = nextFiveFixtures.every(({ code }) => code == null);

  return (
    <SurfaceContainer>
      <div className={matchesSummary}>
        <MatchGroup title="Form" direction="rtl">
          {lastFiveHistory.map((h) => (
            <HistoryItem key={h.fixture} history={h} />
          ))}
        </MatchGroup>

        <MatchGroup title="Fixtures">
          {!allFixturesBlank &&
            nextFiveFixtures.map((f) =>
              f.code !== null ? (
                <FixtureItem key={f.code} element={element} fixture={f} />
              ) : (
                <BlankMatch key={f.event} fixture={f} />
              )
            )}
        </MatchGroup>
      </div>
    </SurfaceContainer>
  );
};

export default MatchSummary;
