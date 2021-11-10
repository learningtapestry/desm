import { camelizeKeys } from "humps";
import apiRequest from "./api/apiRequest";

const fetchSpecifications = async () => {
  const response = await apiRequest({
    url: "/api/v1/specifications",
    method: "get",
    successResponse: "specifications",
  });

  return camelizeKeys(response);
};

export default fetchSpecifications;
