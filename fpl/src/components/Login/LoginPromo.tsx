import { getPlayerData } from "core-integration/src/store/player/reducers";
import { Button } from "plos/src/components/buttons/Button";
import Login from "plos/src/components/Login/Login";
import { useAuth } from "react-oidc-context";
import { useSelector } from "react-redux";
import { useTrackingContext } from "../../contexts/TrackingContext";
import { getPlayerComp } from "../../utils/player-comps";
import {
  buttonContainerStyles,
  desktopOnlyHeading,
  imageStyles,
  loggedUserDiv,
  loggedUserText,
  textContainerStyles,
  textStyles,
} from "./loginPromo.css";

const LoginPromo = () => {
  const auth = useAuth();
  const { fireClickTrackEvent } = useTrackingContext();
  const player = useSelector(getPlayerData);

  const trackAuthClick = (
    action: "login" | "register",
    eventType: "login cta" | "register cta"
  ) => {
    fireClickTrackEvent(
      {
        event_category: action,
        event_component: "button clicks",
        event_detail: "page / screen cta",
        event_type: eventType,
      },
      "fantasy home"
    );
  };

  const handleLogin = () => {
    auth.signinRedirect();
    trackAuthClick("login", "login cta");
  };

  const handleRegister = () => {
    auth.signinRedirect({ extraQueryParams: { action: "registration" } });
    trackAuthClick("register", "register cta");
  };

  if (auth.isAuthenticated && player) {
    return (
      <div className={loggedUserDiv}>
        <p className={loggedUserText}>
          You are logged in as <strong>{player.first_name}</strong>{" "}
          <strong>{player.last_name}</strong>
        </p>
      </div>
    );
  }

  return (
    <Login>
      <div className={textContainerStyles}>
        <h2 className={desktopOnlyHeading}>
          Register to Play Fantasy Premier League
        </h2>
        <p className={textStyles}>
          With over 11 million players, Fantasy Premier League is the biggest
          Fantasy Football game in the world.{" "}
          <strong>It's FREE to play and you can win great prizes!</strong>
        </p>
        <div className={buttonContainerStyles}>
          <Button
            type="button"
            onPress={handleLogin}
            styleVariant="outlinedPrimaryFixed"
            fullWidth
          >
            Log in
          </Button>
          <Button
            type="button"
            onPress={handleRegister}
            styleVariant="filledPrimaryFixed"
            fullWidth
          >
            Register now
          </Button>
        </div>
      </div>
      <div>
        <img
          src={getPlayerComp().x1}
          srcSet={`${getPlayerComp().x1} 1x, ${getPlayerComp().x2} 2x`}
          alt="Promo"
          className={imageStyles}
        />
      </div>
    </Login>
  );
};

export default LoginPromo;
