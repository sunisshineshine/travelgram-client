import { functions } from "../initialize";
import {
  returnPlanItem,
  returnPlanItems,
} from "../migrations/PlanItemMigrations";
import { returnPlan, returnPlans } from "../migrations/PlanMigrations";
import {
  getPlanItem,
  createPlanItemWithUidPlaceIdTitle,
  getPlanItemsFromPlanId,
} from "./PlanItems";
import {
  createPlanWithTitle,
  getPlanDetailWithDocId,
  getAllPlansWithUid,
  deletePlanWithDocId,
} from "./Plans.";

export const plan = functions.https.onCall((data, context) => {
  console.log("get plan detail request");

  const request = data as DocIdRequest;
  console.log(request);

  return getPlanDetailWithDocId(request).then((plan) => returnPlan(plan));
});

export const plans = functions.https.onCall(
  (data, context): Promise<Plan[]> => {
    const request = data as UidRequest;

    console.log(request);

    if (request.uid != context.auth?.uid) {
      throw new Error(
        "request uid and context uid is diffrent. request aborted"
      );
    }

    return getAllPlansWithUid(request).then((plans) => returnPlans(plans));
  }
);

export const createPlan = functions.https.onCall(
  (data, context): Promise<DatabaseActionResult> => {
    const request = data as CreatePlanRequest;

    console.log(request);

    const { uid } = request;
    // uid auth check
    if (!(uid == context.auth?.uid)) {
      throw new Error("invalid request : uid");
    }

    return createPlanWithTitle(request);
  }
);
export const deletePlan = functions.https.onCall(
  (data, context): Promise<DatabaseActionResult> => {
    const request = data as DocIdRequest;

    if (context.auth?.uid != request.uid) {
      throw new Error("invalid request : uid");
    }

    return deletePlanWithDocId(request);
  }
);

export const planItem = functions.https.onCall(
  (data, context): Promise<PlanItem> => {
    const request = data as DocIdRequest;

    console.log(request);

    return getPlanItem(request).then((planItem) => returnPlanItem(planItem));
  }
);

export const createPlanItem = functions.https.onCall(
  (data, context): Promise<DatabaseActionResult> => {
    const request = data as CreatePlanItemRequest;
    console.log(request);
    if (request.uid != context.auth?.uid) {
      throw new Error("auth error : provided uid diffrent");
    }

    return createPlanItemWithUidPlaceIdTitle(request);
  }
);

export const planItems = functions.https.onCall(
  (data, context): Promise<PlanItem[]> => {
    const request = data as DocIdRequest;
    console.log(request);

    if (request.uid != context.auth?.uid) {
      throw new Error("auth error : provided uid diffrent");
    }

    return getPlanItemsFromPlanId(request).then((planItems) =>
      returnPlanItems(planItems)
    );
  }
);
