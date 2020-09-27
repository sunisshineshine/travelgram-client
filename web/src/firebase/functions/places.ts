import { firebaseFunctions } from "../initialize";

const functionsPlaceAutocompletion = firebaseFunctions.httpsCallable(
  "placeAutocompletion"
);

const functionsPlaceDetail = firebaseFunctions.httpsCallable("placeDetail");

export const getPlaceAutocompletions = async (
  query: string
): Promise<google.maps.places.AutocompletePrediction[]> => {
  console.log("getPlaceAutocompletions");

  const request: google.maps.places.AutocompletionRequest = {
    input: query,
  };

  return new Promise(async (resolve, reject) => {
    const result = await functionsPlaceAutocompletion(request).catch(
      (error) => {
        reject(`cannot get place autocompletion with ${query} : ${error}`);
      }
    );

    if (!result) {
      return;
    }

    const data = (result.data as unknown) as google.maps.places.AutocompletePrediction[];

    resolve(data);
  });
};

// todo => change to add planItem
export const getPlaceDetail = (
  placeId: string
): Promise<google.maps.places.PlaceResult> => {
  console.log("get place detail");
  const request: google.maps.places.PlaceDetailsRequest = {
    placeId,
  };

  return functionsPlaceDetail(request)
    .then((result) => {
      console.log(result.data);
      return (result.data as unknown) as google.maps.places.PlaceResult;
    })
    .catch((reason) => {
      return reason;
    });
};
