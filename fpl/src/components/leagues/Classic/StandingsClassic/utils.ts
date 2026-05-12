import { NavigateFunction, Location } from "react-router";

export const updateQueryParams = ({
  location,
  navigate,
  newParams,
}: {
  location: Location;
  navigate?: NavigateFunction;
  newParams: Record<string, string | number | null | undefined>;
}) => {
  const searchParams = new URLSearchParams(location.search);

  Object.entries(newParams).forEach(([key, value]) => {
    searchParams.set(key, String(value));
  });

  const queryParamOptions = {
    pathname: location.pathname,
    search: `?${searchParams.toString()}`,
  };

  if (navigate) {
    navigate(queryParamOptions);
  }

  return queryParamOptions;
};

export const getQueryParam = ({
  location,
  key,
}: {
  location: Location;
  key: string;
}) => {
  const searchParams = new URLSearchParams(location.search);
  return searchParams.get(key);
};
