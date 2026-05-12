import {
  benchContentWrap,
  benchHeader,
  benchInner,
  benchStyles,
} from "./bench.css";
import { BenchProps } from "./types";

const Bench = ({ children, variant = "default" }: BenchProps) => (
  <div className={benchStyles}>
    <div className={benchContentWrap}>
      <h4 className={benchHeader}>Substitutes</h4>
      <div className={benchInner[variant === "bboost" ? "bboost" : "default"]}>
        {children}
      </div>
    </div>
  </div>
);

export default Bench;
