import * as firebase_functions from "firebase-functions";

import * as PLANS from "./apis/google/firebase/plans";
import * as PLACES from "./apis/google/maps/places";

const functions = firebase_functions.region("asia-northeast3");

const httpsError = (error: string) => {
  return new firebase_functions.https.HttpsError("aborted", error);
};

export const placeDetail = functions.https.onCall(
  (data, context): Promise<google.maps.places.PlaceResult> => {
    const request = data as google.maps.places.PlaceDetailsRequest;

    return PLACES.getPlaceDetail(request).catch((error) => {
      throw httpsError(error);
    });
  }
);

export const placeAutocompletion = functions.https.onCall(
  (data, context): Promise<google.maps.places.AutocompletePrediction[]> => {
    const request = data as google.maps.places.AutocompletionRequest;

    console.log(request);

    return PLACES.getPlaceAutocomplete(request).catch((error) => {
      throw httpsError(error);
    });
  }
);

export const createPlan = functions.https.onCall((data, context) => {
  const request = data as CreatePlanRequest;

  console.log(request);

  const { uid } = request;
  // uid auth check
  if (!(uid == context.auth?.uid)) {
    return Promise.reject(Error(`auth information error`));
  }

  return PLANS.createPlan(request).catch((error) => {
    throw httpsError(error);
  });
});
