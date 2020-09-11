import { firebaseApp } from "./initialize";

const functionsPlaceAutocompletion = firebaseApp
  .functions()
  .httpsCallable("placeAutocompletion");

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
