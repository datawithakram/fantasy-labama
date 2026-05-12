import { Button } from "plos/src/components/buttons/Button";
import PageTitle from "plos/src/components/PageTitle";
import { Sheet } from "plos/src/components/Sheet";
import { AdobeExpressLogo } from "./AdobeExpressLogo";
import { contentWrapper, crestImg, crestWrapper } from "./crestStyles.css";

interface CreateCrestSuccessProps {
  handleClose: () => void;
  pendingImage: string;
  open: boolean;
}

const CreateCrestSuccessSheet = ({
  handleClose,
  pendingImage,
  open,
}: CreateCrestSuccessProps) => {
  return (
    <Sheet
      handleClose={handleClose}
      open={open}
      footer={
        <Button fullWidth onPress={handleClose} styleVariant="outlined">
          Close
        </Button>
      }
    >
      <div className={contentWrapper}>
        <div className={crestWrapper}>
          <img src={pendingImage!} alt="Team Badge" className={crestImg} />
          <AdobeExpressLogo variant="sheet" />
        </div>
        <PageTitle title="Thanks for creating your team's badge" />
        <span>
          You will see your team's badge once the image has passed our
          moderation process
        </span>
      </div>
    </Sheet>
  );
};

export default CreateCrestSuccessSheet;
