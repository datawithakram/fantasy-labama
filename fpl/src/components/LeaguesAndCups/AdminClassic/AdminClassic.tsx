import { RootState, ThunkDispatch } from "core-integration/src/store";
import { getLeagueAdmin } from "core-integration/src/store/leagues/reducers";
import {
  fetchClassicLeagueForAdmin,
  updateClassicLeague,
} from "core-integration/src/store/leagues/thunks";
import {
  IPrivateLeagueAdmin,
  IUpdateClassicLeagueData,
} from "core-integration/src/store/leagues/types";
import HorizontalDivider from "plos/src/components/HorizontalDivider";
import ButtonLink from "plos/src/components/links/ButtonLink";
import PageTitle from "plos/src/components/PageTitle";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { rightSidebarLayout } from "plos/src/layouts";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { useTrackingContext } from "../../../contexts/TrackingContext";
import { AddBan } from "../../leagues/admin/AddBan";
import { ChangeAdmin } from "../../leagues/admin/ChangeAdmin";
import { ClassicDetails } from "../../leagues/admin/ClassicDetails";
import { Code } from "../../leagues/admin/Code";
import { Delete } from "../../leagues/admin/Delete";
import { RemoveBan } from "../../leagues/admin/RemoveBan";
import HelmetHeadLeagues from "../../leagues/HelmetHeadLeagues";
import { inviteContentGrid } from "../../leagues/Invite/invite.css";
import { gridDivider, leaguesMainContent } from "../leaguesAndCups.css";
import { actionButtons } from "./adminClassic.css";

const AdminClassic = () => {
  const { leagueId } = useParams();
  const dispatch = useDispatch<ThunkDispatch>();
  const navigate = useNavigate();

  const { firePageViewEvent } = useTrackingContext();

  const leagueNumber = leagueId ? parseInt(leagueId, 10) : 0;
  const league = useSelector((state: RootState) =>
    leagueNumber
      ? (getLeagueAdmin(state, leagueNumber) as IPrivateLeagueAdmin)
      : null
  );

  useEffect(() => {
    firePageViewEvent("fantasy leagues & cups", "admin classic");
  }, []);

  useEffect(() => {
    if (leagueNumber) {
      dispatch(fetchClassicLeagueForAdmin(leagueNumber));
    }
  }, [dispatch, leagueNumber]);

  if (!league) {
    return null;
  }

  const updateLeagueHandler = async (
    leagueId: number,
    data: IUpdateClassicLeagueData
  ) => {
    await dispatch(updateClassicLeague(leagueId, data));
    navigate("/leagues");
  };

  return (
    <>
      <HelmetHeadLeagues />
      <div className={rightSidebarLayout}>
        <SurfaceContainer>
          <div className={leaguesMainContent}>
            <div className={actionButtons}>
              <PageTitle title="League Administration" />
              <ButtonLink size="small" to={`/leagues/${leagueNumber}/invite`}>
                Invite players
              </ButtonLink>
            </div>
            <Code league={league} />
            <HorizontalDivider />
            <ClassicDetails league={league} />
            <HorizontalDivider />
            <div className={inviteContentGrid}>
              <AddBan league={league} />
              <div className={gridDivider}>
                <HorizontalDivider />
              </div>
              {league.bans.length ? (
                <>
                  <RemoveBan league={league} />
                  <div className={gridDivider}>
                    <HorizontalDivider />
                  </div>
                </>
              ) : null}
              <ChangeAdmin
                league={league}
                updateAdmin={(entryId: number) =>
                  updateLeagueHandler(league.id, {
                    admin_entry: entryId,
                    closed: league.closed,
                    code_privacy: league.code_privacy,
                    name: league.name,
                    start_event: league.start_event,
                    has_cup: league.has_cup,
                  })
                }
              />
              <div className={gridDivider}>
                <HorizontalDivider />
              </div>
              <Delete league={league} />
            </div>
          </div>
        </SurfaceContainer>
      </div>
    </>
  );
};

export default AdminClassic;
