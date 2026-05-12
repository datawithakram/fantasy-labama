import RouterLink from "plos/src/components/links/RouterLink";

const OffensiveCopy = () => (
  <p>
    When registering a team or league within FPL, all managers are asked to
    think carefully before entering a name. Names that are deemed inappropriate
    or offensive may result in a team and/or league being deleted (see{" "}
    <RouterLink to="/help/terms">Terms &amp; Conditions</RouterLink>). If you
    find a name or image that you find inappropriate or offensive then please
    let us know by reporting the manager name and the team or league name using
    the form below. Your details will not be shared. We will review the report
    and take immediate and appropriate action. It is important to us that
    Fantasy Premier League is an inclusive space where everyone feels welcome
    and safe. Thank you for your help.
  </p>
);

export const OffensiveCopyBadge: React.FC = () => (
  <p>
    When registering a team or league within FPL, all managers are asked to
    think carefully before creating a team badge. Badges that are deemed
    inappropriate or offensive may result in a team being deleted (see{" "}
    <RouterLink to="/help/terms">Terms &amp; Conditions</RouterLink>). If you
    spot a badge you find inappropriate or offensive then please let us know by
    reporting the manager name and the team using the form below. Your details
    will not be shared with anyone. We will look into the report and take
    immediate and appropriate action. It's important to us that Fantasy Premier
    League is an inclusive space where everyone feels welcome and safe. Thank
    you for your help.
  </p>
);

export default OffensiveCopy;
