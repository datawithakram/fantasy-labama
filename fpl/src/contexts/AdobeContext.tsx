import { set, shuffle } from "lodash";
import useIsMobile from "plos/src/hooks/useIsMobile";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { loadAdobeExpressSDK } from "../utils/adobe";

interface CommunityWallAssetData {
  assetId: string; // Asset ID for the community asset
  title: string; // Prompt for the thumbnail item
  thumbnailSrc: string; // Source of the thumbnail image as a base64 string
  fullRenditionSrc: string; // Source of the full rendition image for OneUp view as a base64 string
  height: number; // Height of the thumbnail image
  width: number; // Width of the thumbnail image
  ownerInfo?: {
    // Optional: Information about the owner
    name: string; // Owner's display name
    imgSrc: string; // Source URL of the owner's image
  };
}

interface CommunityWallAssetResponse {
  assets: CommunityWallAssetData[];
  cursor: string; // The cursor for the next page of assets.
}

interface IEntryImage {
  prompt: string;
  image_url: string;
}

enum ModuleIntent {
  EDIT_IMAGE = "edit-image",
  EDIT_IMAGE_V2 = "edit-image-v2",
  CREATE_IMAGE_FROM_TEXT = "create-image-from-text",
  CREATE_TEMPLATE_FROM_TEXT = "create-template-from-text",
  START_FROM_CONTENT = "start-from-content",
}

interface IAdobeContext {
  embed: {
    createImage: (
      onImageCreate: (img: Blob, prompt: string) => void,
      onImageCreateError?: (error: any) => void
    ) => Promise<void>;
  };
  enabled: boolean;
  ready: boolean;
  setEnabled: (value: boolean) => void;
}

const AdobeContext = createContext<IAdobeContext | null>(null);

export default AdobeContext;

interface IAdobeProviderProps {
  children: React.ReactNode;
}

export const AdobeProvider: React.FC<IAdobeProviderProps> = ({ children }) => {
  const adobeRef = useRef<any | null>(null);
  const [enabled, setEnabled] = useState<boolean>(true);
  const [ready, setReady] = useState<boolean>(false);

  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();

  const platform = (() => {
    const platform = searchParams.get("platform")?.toLowerCase();
    if (platform) {
      if (["android", "ios"].includes(platform)) {
        return platform;
      } else {
        return null;
      }
    } else {
      if (isMobile) {
        return "mobile-web";
      } else {
        return "desktop-web";
      }
    }
  })();

  // Mobile Switch
  const mobileEnabled = true;

  useEffect(() => {
    (async () => {
      try {
        // If mobile is turned off and we detect a mobile device, set enabled to false
        if (!mobileEnabled && isMobile) {
          setEnabled(false);
        } else {
          await loadAdobeExpressSDK(mobileEnabled);
          if (window.adobeModule) {
            adobeRef.current = window.adobeModule;
          }
        }
      } catch (e) {
        setEnabled(false);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  let communityWallImageCount = 0;

  async function myFetchCommunityAssets(): Promise<CommunityWallAssetResponse> {
    const res = await fetch("/api/community-wall/");
    let data = [];
    if (res.ok) {
      data = await res.json();
    }

    let nextCursor = "Interim_Page";
    const displayLimit = 16;
    const assets = shuffle(data).map((i: IEntryImage, index: number) => {
      return {
        assetId: index.toString(),
        title: i.prompt,
        thumbnailSrc: i.image_url,
        fullRenditionSrc: i.image_url,
        height: 50,
        width: 50,
      };
    });

    communityWallImageCount += assets.length;
    if (
      communityWallImageCount < displayLimit ||
      communityWallImageCount >= displayLimit
    ) {
      nextCursor = "Last_Page";
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ assets: assets.slice(0, displayLimit), cursor: nextCursor });
      }, 1000);
    });
  }

  const createImage = async (
    onImageCreate: (img: Blob, prompt: string) => void,
    onImageCreateError?: (error: any) => void
  ) => {
    if (!adobeRef.current) return;
    let imagePrompt = "";

    const isPromptSafe = (prompt: string) => {
      imagePrompt = prompt;
      return new Promise((resolve) => {
        resolve({ isSafe: true });
      });
    };

    const containerConfig = {
      zIndex: 610,
    };

    const exportConfig = [
      {
        action: {
          target: "publish",
          outputType: "blob",
          closeTargetOnExport: true,
          publishFileType: "image/png",
        },
        id: "saveToHostApp",
        label: "Submit",
        style: { uiType: "button" },
      },
    ];

    const appConfig = {
      appVersion: "2",
      callbacks: {
        onCancel: () => {},
        onError: (error: any) => {
          if (onImageCreateError) {
            onImageCreateError(error);
          }
        },
        onIntentChange: (_: ModuleIntent, __: ModuleIntent) => {
          // Intent changes from ModuleIntent.CREATE_IMAGE_FROM_TEXT to ModuleIntent.EDIT_IMAGE
          return {
            appConfig: {
              callbacks: {
                onCancel: () => {},
                onError: (error: any) => {
                  if (onImageCreateError) {
                    onImageCreateError(error);
                  }
                },
                onPublish: (_: ModuleIntent, publishParams: any) => {
                  onImageCreate(publishParams.asset[0].data, imagePrompt);
                },
              },
              useClientAuth: true,
            },
            containerConfig,
            exportConfig,
          };
        },
        onPublish: (_: ModuleIntent, publishParams: any) => {
          onImageCreate(publishParams.asset[0].data, publishParams.prompt);
        },
      },
      communityWallConfig: {
        fetchCommunityAssets: myFetchCommunityAssets,
      },
      editDropdownOptions: [],
      featureConfig: {
        "community-wall": true,
      },
      imageDimensions: {
        size: { width: 500, height: 500, unit: "px" },
        aspectRatio: "square",
      },
      isPromptSafe: (prompt: string) => isPromptSafe(prompt),
      panelSettings: {
        contentType: { value: "auto" },
      },
      promptInputPlaceholder:
        "Describe the badge you want to generate – e.g. 'A lion on a red shield football team badge'",
      useClientAuth: true,
    };

    if (platform) {
      set(appConfig, "metaData", { platform });
    }

    await adobeRef.current.createImageFromText(
      appConfig,
      exportConfig,
      containerConfig
    );
  };

  return (
    <AdobeContext.Provider
      value={{
        embed: {
          createImage,
        },
        enabled,
        ready,
        setEnabled,
      }}
    >
      {children}
    </AdobeContext.Provider>
  );
};

export const useAdobeContext = () => {
  const context = useContext(AdobeContext);
  if (!context) {
    throw new Error("useAdobeContext must be used within an AdobeProvider");
  }
  return context;
};
