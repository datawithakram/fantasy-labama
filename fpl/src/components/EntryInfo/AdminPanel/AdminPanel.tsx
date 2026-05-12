import ExternalMoreLink from "plos/src/components/links/ExternalMoreLink";
import MoreLink from "plos/src/components/links/MoreLink";
import EntryInfoPanel from "../EntryInfoPanel";

const AdminPanel = () => (
  <EntryInfoPanel title="Admin">
    <MoreLink to={`/entry-update`}>Team Details</MoreLink>

    <ExternalMoreLink href="https://www.premierleague.com/en/settings/personal-details">
      User Profile
    </ExternalMoreLink>
  </EntryInfoPanel>
);

export default AdminPanel;
