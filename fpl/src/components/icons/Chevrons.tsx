import ChevronLeftIcon from "plos/src/img/icons/chevron-left.svg?react";
import ChevronRightIcon from "plos/src/img/icons/chevron-right.svg?react";
import ChevronDoubleLeftIcon from "../../img/icons/chevron-double-left.svg?react";
import ChevronDoubleRightIcon from "../../img/icons/chevron-double-right.svg?react";
import ChevronDownIcon from "../../img/icons/chevron-down.svg?react";
import BaseNextIcon from "../../img/icons/next.svg?react";
import BasePrevIcon from "../../img/icons/previous.svg?react";
import { chevronStyle, nextIconStyle, prevIconStyle } from "./chevrons.css";

export const ChevronLeft = (props: React.SVGProps<SVGSVGElement>) => (
  <ChevronLeftIcon
    {...props}
    className={`${chevronStyle} ${props.className || ""}`}
  />
);

export const ChevronRight = (props: React.SVGProps<SVGSVGElement>) => (
  <ChevronRightIcon
    {...props}
    className={`${chevronStyle} ${props.className || ""}`}
  />
);

export const ChevronDoubleLeft = (props: React.SVGProps<SVGSVGElement>) => (
  <ChevronDoubleLeftIcon
    {...props}
    className={`${chevronStyle} ${props.className || ""}`}
  />
);

export const ChevronDoubleRight = (props: React.SVGProps<SVGSVGElement>) => (
  <ChevronDoubleRightIcon
    {...props}
    className={`${chevronStyle} ${props.className || ""}`}
  />
);

export const PrevIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <BasePrevIcon
    {...props}
    className={`${prevIconStyle} ${props.className || ""}`}
  />
);

export const NextIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <BaseNextIcon
    {...props}
    className={`${nextIconStyle} ${props.className || ""}`}
  />
);

export const ChevronDown = (props: React.SVGProps<SVGSVGElement>) => (
  <ChevronDownIcon
    {...props}
    className={`${chevronStyle} ${props.className || ""}`}
  />
);
