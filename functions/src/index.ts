import * as functions from "firebase-functions";

import { getPlaceAutocomplete } from "./apis/google/places";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const placeAutocompletion = functions.https.onCall(
  (data, context): Promise<google.maps.places.AutocompletePrediction[]> => {
    const request = data as google.maps.places.AutocompletionRequest;
    return getPlaceAutocomplete(request).catch((reason) => {
      return reason;
    });
  }
);
