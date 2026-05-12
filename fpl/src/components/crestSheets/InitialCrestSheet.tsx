import { Sheet } from "plos/src/components/Sheet";
import Subheading from "plos/src/components/Subheading";
import { Button } from "plos/src/components/buttons/Button";
import RouterLink from "plos/src/components/links/RouterLink";
import { useAdobeContext } from "../../contexts/AdobeContext";
import adobePlaceholderDark from "../../img/adobe/adobe-placeholder-dark.png";
import adobePlaceholder from "../../img/adobe/adobe-placeholder.png";
import {
  adobePlaceholderImage,
  buttonGroup,
  contentWrapper,
  descriptionWrapper,
} from "./crestStyles.css";

interface InitialCrestSheet {
  open: boolean;
  handleCreateCrest: (img: Blob, prompt: string) => Promise<void>;
  handleClose: () => void;
}

const InitialCrestSheet = ({
  open,
  handleCreateCrest,
  handleClose,
}: InitialCrestSheet) => {
  const { embed, enabled } = useAdobeContext();

  const actionButtons = enabled && (
    <div className={buttonGroup}>
      <Button fullWidth styleVariant="outlined" onPress={handleClose}>
        Close
      </Button>
      <Button
        fullWidth
        onPress={() => {
          handleClose();
          embed.createImage(async (img, prompt) => {
            await handleCreateCrest(img, prompt);
          });
        }}
      >
        Let's Do It!
      </Button>
    </div>
  );

  return (
    <Sheet handleClose={handleClose} open={open} footer={actionButtons}>
      <div className={contentWrapper}>
        <picture>
          <source
            srcSet={adobePlaceholderDark}
            media="(prefers-color-scheme: dark)"
          />
          <img
            src={adobePlaceholder}
            className={adobePlaceholderImage}
            alt="Adobe placeholder image"
          />
        </picture>
        <Subheading>
          {!enabled
            ? "Coming Soon to Mobile"
            : "Generate your custom team badge"}
        </Subheading>
        <div className={descriptionWrapper}>
          <span>+ Fast and easy - Generate a badge in seconds</span>
          <span>+ Customise badge styles, apply filters and more</span>
          <span>+ Perfect your design with intuitive editing tools</span>
        </div>
        {enabled && (
          <p>
            Upon submission, your badge will be reviewed to ensure it meets our{" "}
            <RouterLink to="/help/terms">terms of use</RouterLink> before it is
            approved for use.
          </p>
        )}
      </div>
    </Sheet>
  );
};

export default InitialCrestSheet;
