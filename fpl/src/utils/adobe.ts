declare global {
  interface Window {
    CCEverywhere: any;
    adobeModule: any;
  }
}

interface IClientAuthDetails {
  /**
   * The client access token.
   */
  clientAccessToken: string;

  /**
   * The expiration timestamp (in milliseconds since epoch) for the client access token.
   * This is used to determine when the token needs to be refreshed.
   */
  tokenExpiryTimestampMs: number;

  /**
   * Unique identifier (UUID) for the logged-in user.
   * Useful for rate limiting.
   * The UUID must follow the pattern described here: https://developer.mozilla.org/en-US/docs/Glossary/UUID.
   * Example: '75df9e44-98a5-43a9-b2ff-d884d3af12cc'.
   * It's a 36-character, hyphenated, case-insensitive hexadecimal string.
   */
  userGuid: string;
}

interface IClientAuthProvider {
  (): Promise<IClientAuthDetails>;
}

type AdobeAuthResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
  uuid: string;
};

const clientAuthProvider: IClientAuthProvider =
  async (): Promise<IClientAuthDetails> => {
    const response = await fetch("/api/adobe-access/", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch token: ${response.statusText}`);
    }

    const data: AdobeAuthResponse = await response.json();
    return {
      clientAccessToken: data.access_token,
      tokenExpiryTimestampMs: new Date().getTime() + data.expires_in * 1000,
      userGuid: data.uuid,
    };
  };

export const loadAdobeExpressSDK = async (
  withMobile: boolean = true
): Promise<any> => {
  if (window.adobeModule) {
    return window.adobeModule;
  }

  if (!window.CCEverywhere) {
    throw new Error("CCEverywhere SDK is not loaded.");
  }

  try {
    const { module } = await window.CCEverywhere.initialize(
      {
        clientId: import.meta.env.VITE_ADOBE_API_KEY,
        appName: "fantasypremierleague",
      },
      {
        skipBrowserSupportCheck: withMobile ? true : false,
      },
      undefined,
      clientAuthProvider
    );

    window.adobeModule = module;
    console.log("CCEverywhere SDK initialized");

    return module;
  } catch (e) {
    console.error(e);
    throw new Error(`CCEverywhere.initialize failed: ${(e as Error).message}`);
  }
};
