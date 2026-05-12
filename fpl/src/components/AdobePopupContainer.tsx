import { CSSProperties, ReactNode } from "react";

export const AdobePopupContainer = ({ children }: { children?: ReactNode }) => {
  const style: CSSProperties = {
    height: "0.2rem",
    width: "0.2rem",
    position: "fixed",
    bottom: 0,
    right: 0,
    zIndex: 1000,
  };

  return (
    <div
      id="AdobePopupContainer"
      className="adobe-popup-container"
      style={style}
    >
      {children}
    </div>
  );
};
