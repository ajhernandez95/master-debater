import { useLocation } from "react-router-dom";

const useQueryParam = (paramName: string) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  return searchParams.get(paramName);
};

export default useQueryParam;
