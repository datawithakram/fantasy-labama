import { Helmet } from "react-helmet";
import { useLocation } from "react-router";
import { HelmetHeadProps } from "./types";

export const generateCanonicalUrl = (path: string) => {
  const cleanPath = path.replace(/\/+$/, "");
  return window.location.origin + cleanPath;
};

const HelmetHead = ({ description, title, canonicalUrl }: HelmetHeadProps) => {
  const { pathname } = useLocation();
  const finalCanonicalUrl = canonicalUrl || generateCanonicalUrl(pathname);

  return (
    <Helmet>
      <meta name="description" content={description} />
      <title>{title}</title>
      <link rel="canonical" href={finalCanonicalUrl} />
    </Helmet>
  );
};

export default HelmetHead;
