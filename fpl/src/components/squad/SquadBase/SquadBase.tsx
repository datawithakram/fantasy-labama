import { Fixtures } from "plos/src/components/Fixtures";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import useDisplayElementList from "plos/src/hooks/useDisplayElementList";
import { leftSidebarLayout, squadMain } from "plos/src/layouts";
import { useState } from "react";
import { ClubTeamNews } from "../../ClubTeamNews";
import LatestAlert from "../../LatestAlert";
import { ElementListWrapper } from "../ElementList";
import ManageSquad from "../ManageSquad";
import { SquadBaseProps } from "./types";

const SquadBase = ({
  headTags,
  nextEvent,
  scoreboard,
  title,
}: SquadBaseProps) => {
  const {
    handleOpenElementList,
    handleCloseElementList,
    elementListRef,
    openSheet,
  } = useDisplayElementList();

  const [elementPosition, setElementPosition] = useState<number>(0);

  const handleCloseSheets = () => {
    handleCloseElementList();
    setElementPosition(0);
  };

  return (
    <>
      {headTags}
      <div className={leftSidebarLayout}>
        <div className={squadMain}>
          <section>
            <SurfaceContainer>
              <LatestAlert />
              <ManageSquad
                title={title}
                scoreboard={scoreboard}
                handleOpenElemListSheet={handleOpenElementList}
                elementPosition={elementPosition}
                setElementPosition={setElementPosition}
              />
            </SurfaceContainer>
          </section>
          <ClubTeamNews />
          {nextEvent && (
            <section>
              <SurfaceContainer>
                <Fixtures eventId={nextEvent.id} />
              </SurfaceContainer>
            </section>
          )}
        </div>
        <ElementListWrapper
          elementListRef={elementListRef}
          openSheet={openSheet}
          handleClose={handleCloseSheets}
        />
      </div>
    </>
  );
};

export default SquadBase;
