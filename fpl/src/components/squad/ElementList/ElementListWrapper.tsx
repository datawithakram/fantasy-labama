import { Sheet } from "plos/src/components/Sheet";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { squadSheet, squadSidebar } from "plos/src/layouts";
import ElementList from "./ElementList";
import { elementSheetWrapper } from "./elementList.css";

interface ElementListWrapperProps {
  elementListRef: React.MutableRefObject<null>;
  openSheet: boolean;
  handleClose: () => void;
}

const ElementListWrapper = ({
  elementListRef,
  openSheet,
  handleClose,
}: ElementListWrapperProps) => {
  return (
    <section>
      {/* Two variations of the ElementList component are needed for mobile vs desktop designs.
         Visibility is controlled by the squadSidebar and squadSheet styles via media queries
         */}
      <div ref={elementListRef} className={squadSidebar}>
        <SurfaceContainer>
          <ElementList />
        </SurfaceContainer>
      </div>
      <div className={squadSheet}>
        <Sheet open={openSheet} handleClose={handleClose} sizeVariant={"large"}>
          <div className={elementSheetWrapper}>
            <ElementList handleClose={handleClose} inSheet={true} />
          </div>
        </Sheet>
      </div>
    </section>
  );
};

export default ElementListWrapper;
