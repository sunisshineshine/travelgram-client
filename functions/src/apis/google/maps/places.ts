import { functions } from "../../google/firebase/initialize";

import { GOOGLE_API_KEY } from "../../../config.json";

import fetch from "node-fetch";
import * as utf8 from "utf8";

const PLACE_DETAIL_BASE_URL =
  "https://maps.googleapis.com/maps/api/place/details/json";

const PLACE_AUTOCOMPLETE_BASE_URL =
  "https://maps.googleapis.com/maps/api/place/autocomplete/json";

// apis
export const placeDetail = functions.https.onCall(
  (data, context): Promise<google.maps.places.PlaceResult> => {
    const request = data as google.maps.places.PlaceDetailsRequest;

    return getPlaceDetail(request).catch((error) => {
      console.error(error);
      throw new Error(error);
    });
  }
);

export const placeAutocompletion = functions.https.onCall(
  (data, context): Promise<google.maps.places.AutocompletePrediction[]> => {
    const request = data as google.maps.places.AutocompletionRequest;

    console.log(request);

    return getPlaceAutocomplete(request).catch((error) => {
      throw new Error(error);
    });
  }
);

// code
export const getPlaceDetail = async (
  request: google.maps.places.PlaceDetailsRequest
): Promise<google.maps.places.PlaceResult> => {
  // props check
  const { placeId } = request;

  if (!placeId) {
    throw new Error("invalid request : placeid");
  }

  const url = new URL(PLACE_DETAIL_BASE_URL);
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("key", GOOGLE_API_KEY);

  const response = await fetch(utf8.encode(url.href)).catch((error) => {
    console.log("hello");
    throw error;
  });

  if (!response) {
    throw new Error("cannot fetch with " + url);
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

export const getPlaceAutocomplete = async (
  request: google.maps.places.AutocompletionRequest
): Promise<google.maps.places.AutocompletePrediction[]> => {
  const { input } = request;

  // props check
  if (!(input && input != "")) {
    throw new Error("please fill the query input");
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
    throw new Error("cannot fetch with " + url.href);
  }

  const result = ((await response.json()) as unknown) as AutocompleteResult;

  if (result.status == "OK") {
    if (result.predictions.length > 0) {
      return result.predictions;
    } else {
      throw new Error("search result is empty");
    }
  } else {
    throw new Error("cannot get result data : " + result.error_message);
  }
};
