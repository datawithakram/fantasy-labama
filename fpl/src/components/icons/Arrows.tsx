import ArrowLeftIcon from "../../img/icons/arrow-left.svg?react";
import ArrowRightIcon from "../../img/icons/arrow-right.svg?react";
import {
  arrowStyle,
  controlArrowLeftStyle,
  controlArrowRightStyle,
} from "./arrows.css";

export const ArrowLeft = (props: React.SVGProps<SVGSVGElement>) => (
  <ArrowLeftIcon
    {...props}
    className={`${arrowStyle} ${props.className || ""}`}
  />
);

export const ArrowRight = (props: React.SVGProps<SVGSVGElement>) => (
  <ArrowRightIcon
    {...props}
    className={`${arrowStyle} ${props.className || ""}`}
  />
);

export const ControlArrowLeft = (props: React.SVGProps<SVGSVGElement>) => (
  <ArrowLeftIcon
    {...props}
    className={`${arrowStyle} ${controlArrowLeftStyle} ${
      props.className || ""
    }`}
  />
);

export const ControlArrowRight = (props: React.SVGProps<SVGSVGElement>) => (
  <ArrowRightIcon
    {...props}
    className={`${arrowStyle} ${controlArrowRightStyle} ${
      props.className || ""
    }`}
  />
);
