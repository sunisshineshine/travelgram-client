import { firebaseApp } from "./initialize";

// firebaseApp.functions().useFunctionsEmulator("http://localhost:5001");
const functionsPlaceAutocompletion = firebaseApp
  .functions()
  .httpsCallable("placeAutocompletion");

const functionsPlaceDetail = firebaseApp
  .functions()
  .httpsCallable("placeDetail");

export const getPlaceAutocompletions = (
  query: string
): Promise<google.maps.places.AutocompletePrediction[]> => {
  const request: google.maps.places.AutocompletionRequest = {
    input: query,
  };

  return functionsPlaceAutocompletion(request)
    .then((result) => {
      return (result.data as unknown) as google.maps.places.AutocompletePrediction[];
    })
    .catch((reason) => {
      return reason;
    });
};

// todo => change to add planItem
export const getPlaceDetail = (
  placeId: string
): Promise<google.maps.places.PlaceResult> => {
  const request: google.maps.places.PlaceDetailsRequest = {
    placeId,
  };
  console.log("get place detail");

  return functionsPlaceDetail(request)
    .then((result) => {
      return (result.data as unknown) as google.maps.places.PlaceResult;
    })
    .catch((reason) => {
      return reason;
    });
};
