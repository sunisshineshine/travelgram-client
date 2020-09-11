import * as functions from "firebase-functions";

import { getPlaceAutocomplete, getPlaceDetail } from "./apis/google/places";

export const placeAutocompletion = functions.https.onCall(
  (data, context): Promise<google.maps.places.AutocompletePrediction[]> => {
    const request = data as google.maps.places.AutocompletionRequest;
    return getPlaceAutocomplete(request).catch((reason) => {
      return reason;
    });
  }
);

export const placeDetail = functions.https.onCall((data, context) => {
  const request = data as google.maps.places.PlaceDetailsRequest;
  return getPlaceDetail(request).catch((reason) => {
    return reason;
  });
});

// export const placeDetail = functions.https.onRequest((req, res) => {
//   console.log("request");
//   const request = (req.query as unknown) as google.maps.places.PlaceDetailsRequest;
//   getPlaceDetail(request);
//   res.json("requested");
// });
