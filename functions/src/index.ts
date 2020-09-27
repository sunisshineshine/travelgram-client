import * as PLANS from "./apis/google/firebase/plans/index";
import * as PLACES from "./apis/google/maps/places";

export const { placeDetail, placeAutocompletion } = PLACES;

export const {
  plan,
  createPlan,
  deletePlan,
  plans,
  planItem,
  createPlanItem,
  planItems,
} = PLANS;

// import { plansCollection, functions } from "./apis/google/firebase/initialize";

// export const testFx = functions.https.onCall(
//   (data, context): Promise<FirebaseFirestore.DocumentReference> => {
//     return plansCollection.get().then((query) => {
//       // console.log(query);
//       console.log(
//         (query.docs[0].ref as unknown) as FirebaseFirestore.DocumentReference
//       );
//       return query.docs[0].ref;
//     });
//   }
// );
