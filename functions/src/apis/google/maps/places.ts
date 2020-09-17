import { GOOGLE_API_KEY } from "../../../config.json";

import fetch from "node-fetch";
import * as utf8 from "utf8";

const PLACE_DETAIL_BASE_URL =
  "https://maps.googleapis.com/maps/api/place/details/json";

const PLACE_AUTOCOMPLETE_BASE_URL =
  "https://maps.googleapis.com/maps/api/place/autocomplete/json";

interface PlaceDetailResponse {
  status: google.maps.places.PlacesServiceStatus;
  result: google.maps.places.PlaceResult;
  html_attributions: any;
}

export const getPlaceDetail = async (
  request: google.maps.places.PlaceDetailsRequest
): Promise<google.maps.places.PlaceResult> => {
  // props check
  const { placeId } = request;

  if (!placeId) {
    return Promise.reject("placeId is not provided");
  }

  const url = new URL(PLACE_DETAIL_BASE_URL);
  url.searchParams.set("place_id", request.placeId);
  url.searchParams.set("key", GOOGLE_API_KEY);

  const response = await fetch(utf8.encode(url.href)).catch((error) => {
    console.log(error);
  });

  if (!response) {
    return Promise.reject("cannot fetch with " + url);
  }

  const result = ((await response.json()) as unknown) as PlaceDetailResponse;

  return new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
    if (result.status == "OK") {
      resolve(result.result);
    } else {
      reject(result.status);
    }
  });
};

interface AutocompleteResult {
  status: google.maps.places.PlacesServiceStatus;
  error_message?: string;
  predictions: google.maps.places.AutocompletePrediction[];
}

export const getPlaceAutocomplete = async (
  request: google.maps.places.AutocompletionRequest
): Promise<google.maps.places.AutocompletePrediction[]> => {
  const { input } = request;

  // props check
  if (!(input && input != "")) {
    return Promise.reject("please fill the query input");
  }

  // console.log(request);
  const url = new URL(PLACE_AUTOCOMPLETE_BASE_URL);
  // set required params
  url.searchParams.set("input", input);
  url.searchParams.set("key", GOOGLE_API_KEY);

  const response = await fetch(utf8.encode(url.href)).catch((error) => {
    console.log("cannot fetch with " + url.href);
  });

  if (!response) {
    return Promise.reject("cannot fetch with " + url.href);
  }

  const result = ((await response.json()) as unknown) as AutocompleteResult;

  if (result.status == "OK") {
    if (result.predictions.length > 0) {
      return Promise.resolve(result.predictions);
    } else {
      return Promise.reject("search result is empty");
    }
  } else {
    return Promise.reject("cannot get result data : " + result.error_message);
  }
};
