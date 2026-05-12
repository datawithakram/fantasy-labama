import { getPlayerData } from "core-integration/src/store/player/reducers";
import { contentMain } from "plos/src/layouts";
import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { Outlet, Route, Routes as RouterRoutes } from "react-router";
import { Loading } from "./App";
import CrestCreate from "./CrestCreate";
import EntryHistory from "./EntryHistory";
import EntryUpdate from "./EntryUpdate";
import FDRContainer from "./fdr/FDRContainer";
import { FixturesWrapper } from "./Fixtures/index";
import PlayerList from "./help/PlayerList";
import ReportImage from "./help/ReportImage";
import Home from "./Home";
import { AdminH2H } from "./leagues/admin/AdminH2H";
import AutoJoin from "./leagues/AutoJoin";
import { StandingsClassic } from "./leagues/Classic/StandingsClassic";
import CupNotStarted from "./leagues/CupNotStarted";
import { MatchesH2H } from "./leagues/H2H/MatchesH2H";
import { StandingsH2H } from "./leagues/H2H/StandingsH2H";
import { Invite } from "./leagues/Invite";
import NewEntriesH2H from "./leagues/NewEntriesH2H";
import { Renew } from "./leagues/Renew";
import {
  Create,
  CreateClassic,
  CreateH2H,
  Join,
  JoinPrivate,
  JoinPublic,
  MyLeagues,
} from "./LeaguesAndCups";
import { AdminClassic } from "./LeaguesAndCups/AdminClassic";
import { MatchesCup } from "./LeaguesAndCups/MatchesCup";
import MyCups from "./LeaguesAndCups/MyCups";
import LoginPromo from "./Login/LoginPromo";
import Prizes from "./prizes/Prizes";
import Winners from "./prizes/Winners";
import Scout from "./scout/Scout";
import ScoutAvailability from "./scout/ScoutAvailability";
import SetPieceTakers from "./SetPieceTakers";
import SquadSelection from "./squad/SquadSelection";
import Transfers from "./squad/Transfers";
import Statistics from "./stats/Statistics";
import { DreamTeam } from "./team/DreamTeam";
import EntryEvent from "./team/EntryEvent";
import MyTeam from "./team/MyTeam";
import TransfersHistory from "./TransfersHistory";
const Help = lazy(() => import("./help/Help"));
const Rules = lazy(() => import("./help/Rules"));
const Terms = lazy(() => import("./help/Terms"));
const PatchNotes = lazy(() => import("./help/PatchNotes"));
const ReportName = lazy(() => import("./help/ReportName"));
const WinnerDetails = lazy(() => import("./WinnerDetails"));

const PlayerRoute = () => {
  const player = useSelector(getPlayerData);
  if (player) {
    return <Outlet />;
  } else {
    return <LoginPromo />;
  }
};

const EntryRoute = () => {
  const player = useSelector(getPlayerData);
  if (player && player.entry) {
    return <Outlet />;
  } else {
    return <LoginPromo />;
  }
};

export const NotFound = () => (
  <div className={contentMain}>
    <h4>Page not found</h4>
    <p>Sorry, but the page you were looking for can't be found.</p>
  </div>
);

const Routes = () => (
  <Suspense fallback={<Loading />}>
    <RouterRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/help" element={<Help />} />
      <Route path="/help/rules" element={<Rules />} />
      <Route path="/help/terms" element={<Terms />} />
      <Route path="/help/new" element={<PatchNotes />} />
      <Route path="/help/report-name" element={<ReportName />} />
      <Route path="/help/report-badge" element={<ReportImage />} />
      <Route path="/player-list" element={<PlayerList />} />
      <Route path="/prizes" element={<Prizes />} />
      <Route
        path="/winners/prize-details/:token/"
        element={<WinnerDetails />}
      />
      <Route path="/prizes/winners" element={<Winners />} />
      <Route path="/statistics" element={<Statistics />} />
      <Route path="/statistics/:statName" element={<Statistics />} />
      <Route path="/team-of-the-week" element={<DreamTeam />} />
      <Route path="/team-of-the-week/:eventId" element={<DreamTeam />} />
      <Route path="/fixtures" element={<FixturesWrapper />} />
      <Route path="/fixtures/:eventId" element={<FixturesWrapper />} />
      <Route path="/fixtures/fdr" element={<FDRContainer />} />
      <Route path="/the-scout" element={<Scout />} />
      <Route path="/the-scout/set-piece-takers" element={<SetPieceTakers />} />
      <Route path="/the-scout/player-news" element={<ScoutAvailability />} />

      <Route
        path="/leagues/:leagueId/standings/c"
        element={<StandingsClassic />}
      />
      <Route path="/leagues/:leagueId/cup" element={<MatchesCup />} />
      <Route
        path="/leagues/:leagueId/cup-not-started"
        element={<CupNotStarted />}
      />
      <Route path="/leagues/:leagueId/standings/h" element={<StandingsH2H />} />
      <Route path="/leagues/:leagueId/matches/h" element={<MatchesH2H />} />
      <Route
        path="/leagues/:leagueId/new-entries/h"
        element={<NewEntriesH2H />}
      />
      <Route path="/entry/:entryId/history" element={<EntryHistory />} />
      <Route path="/entry/:entryId/event/:eventId" element={<EntryEvent />} />
      <Route path="/entry/:entryId/transfers" element={<TransfersHistory />} />
      <Route path="/leagues/auto-join/:code" element={<AutoJoin />} />

      <Route element={<EntryRoute />}>
        <Route path="/badge-create" element={<CrestCreate />} />
        <Route path="/my-team" element={<MyTeam />} />
        <Route path="/transfers" element={<Transfers />} />
        <Route path="/leagues" element={<MyLeagues />} />
        <Route path="/leagues/cups" element={<MyCups />} />
        <Route path="/leagues/renew" element={<Renew />} />
        <Route path="/leagues/create" element={<Create />} />
        <Route path="/leagues/create/classic" element={<CreateClassic />} />
        <Route path="/leagues/create/h2h" element={<CreateH2H />} />
        <Route path="/leagues/join" element={<Join />} />
        <Route path="/leagues/join/private" element={<JoinPrivate />} />
        <Route path="/leagues/join/public" element={<JoinPublic />} />
        <Route path="/leagues/:leagueId/admin/c" element={<AdminClassic />} />
        <Route path="/leagues/:leagueId/admin/h" element={<AdminH2H />} />
        <Route path="/leagues/:leagueId/invite" element={<Invite />} />
        <Route path="/entry-update" element={<EntryUpdate />} />
      </Route>

      <Route element={<PlayerRoute />}>
        <Route path="/squad-selection" element={<SquadSelection />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  </Suspense>
);

export default Routes;
