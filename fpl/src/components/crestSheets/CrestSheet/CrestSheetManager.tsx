import { ThunkDispatch } from "core-integration/src/store";
import { getCrestSuccessImgSrc } from "core-integration/src/store/ui/selectors";
import { setSuccessImgSrc } from "core-integration/src/store/ui/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import CreateCrestSuccessSheet from "../CreateCrestSuccessSheet";
import CrestSheet from "./CrestSheet";

const CrestSheetManager = () => {
  const dispatch = useDispatch<ThunkDispatch>();
  const successImgSrc = useSelector(getCrestSuccessImgSrc);

  const handleSetSuccessImgSrc = (img: Blob | null) => {
    dispatch(setSuccessImgSrc(img));
  };

  return successImgSrc ? (
    <CreateCrestSuccessSheet
      handleClose={() => handleSetSuccessImgSrc(null)}
      pendingImage={successImgSrc}
      open={true}
    />
  ) : (
    <CrestSheet setSuccessImgSrc={handleSetSuccessImgSrc} />
  );
};

export default CrestSheetManager;
