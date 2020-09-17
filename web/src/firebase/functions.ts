import { getAuthUser } from "./auth";
import { firebaseApp } from "./initialize";

// firebaseApp.functions().useFunctionsEmulator("http://localhost:5001");
// const functions = firebaseApp.functions();

const functions = firebaseApp.functions("asia-northeast3");

const functionsPlaceAutocompletion = functions.httpsCallable(
  "placeAutocompletion"
);

const functionsPlaceDetail = functions.httpsCallable("placeDetail");

const functionsCreatePlan = functions.httpsCallable("createPlan");

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
      return (result.data as unknown) as google.maps.places.PlaceResult;
    })
    .catch((reason) => {
      return reason;
    });
};

export const createPlan = async (title: string): Promise<ActionResult> => {
  console.log("create Plan");
  const user = await getAuthUser();
  if (!user) {
    return { ok: false, error_message: "user not logged in" };
  }
  const uid = user.uid;

  const request: CreatePlanRequest = {
    title,
    uid,
  };

  return new Promise(async (resolve, reject) => {
    const result = await functionsCreatePlan(request).catch((reason) => {
      reject(reason);
    });

    if (!result) {
      return;
    }
    const data = (result.data as unknown) as ActionResult;
    resolve(data);
    return;
  });
};
