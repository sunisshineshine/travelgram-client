import { GOOGLE_API_KEY } from "../../config.json";

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
  const url = new URL(PLACE_DETAIL_BASE_URL);
  url.searchParams.set("place_id", request.placeId);
  url.searchParams.set("key", GOOGLE_API_KEY);

  const response = await fetch(utf8.encode(url.href));
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
  // console.log(request);
  const url = new URL(PLACE_AUTOCOMPLETE_BASE_URL);
  // set required params
  url.searchParams.set("input", request.input);
  url.searchParams.set("key", GOOGLE_API_KEY);

  const response = await fetch(utf8.encode(url.href));
  const result = ((await response.json()) as unknown) as AutocompleteResult;

  return new Promise((resolve, reject) => {
    if (result.status == "OK") {
      resolve(result.predictions);
    } else {
      reject(result.error_message);
    }
  });
};
