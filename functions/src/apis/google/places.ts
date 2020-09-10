import { GOOGLE_API_KEY } from "../../config.json";

import fetch from "node-fetch";
import * as utf8 from "utf8";

const PLACE_AUTOCOMPLETE_BASE_URL =
  "https://maps.googleapis.com/maps/api/place/autocomplete/json";

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

  console.log(result);

  return new Promise((resolve, reject) => {
    if (result.status == "OK") {
      resolve(result.predictions);
    } else {
      reject(result.error_message);
    }
  });
};

// export const getPlacesAutocompletes = async (query: string) => {
//   const baseUrl =
//     "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";
//   let url =
//     baseUrl +
//     `?input=${query}` +
//     `&inputtype=textquery` +
//     `&fields=photos,formatted_address,name,rating,opening_hours,geometry` +
//     `&key=${GOOGLE_API_KEY}`;
//   const response = await fetch(utf8.encode(url));
//   const data = await response.json();
//   console.log(data);
//   return data;
// };
