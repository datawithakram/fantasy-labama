import ElementAvatar from "plos/src/components/avatars/ElementAvatar";
import {
  infoItem,
  infoItemHeading,
  infoItemPhotoHeadingContainer,
  infoItemValue,
} from "./infoItem.css";
import { InfoItemPhotoProps, InfoItemProps } from "./types";

export const InfoItem = ({ heading, value }: InfoItemProps) => (
  <div className={infoItem.default}>
    <h2 className={infoItemHeading}>{heading}</h2>
    <span className={infoItemValue}>{value}</span>
  </div>
);

export const InfoItemPhoto = ({ heading, element }: InfoItemPhotoProps) => (
  <div className={infoItem.photo}>
    {element && <ElementAvatar element={element} />}
    <div className={infoItemPhotoHeadingContainer}>
      <h2 className={infoItemHeading}>{heading}</h2>
      <div className={infoItemValue}>{element?.web_name || "-"}</div>
    </div>
  </div>
);
