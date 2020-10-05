import { functions } from "../initialize";
import {
  returnPlanItem,
  returnPlanItems,
} from "../migrations/PlanItemMigrations";
import { returnPlan, returnPlans } from "../migrations/PlanMigrations";

import * as PLANS from "./Plans.";
import * as PLANITEMS from "./PlanItems";
import * as EVENTITEMS from "./EventItems";
import { returnEventItems } from "../migrations/EventItemMigrations";

export const plan = functions.https.onCall((data, context) => {
  console.log("get plan detail request");

  const request = data as DocIdRequest;
  console.log(request);

  return PLANS.getPlanDetailWithDocId(request).then((planReturned: Plan) =>
    returnPlan(planReturned)
  );
});

export const plans = functions.https.onCall(
  (data, context): Promise<Plan[]> => {
    const request = data as UidRequest;

    console.log(request);

    if (request.uid !== context.auth?.uid) {
      throw new Error(
        "request uid and context uid is diffrent. request aborted"
      );
    }

    return PLANS.getAllPlansWithUid(request).then((plansReturned: Plan[]) =>
      returnPlans(plansReturned)
    );
  }
);

export const createPlan = functions.https.onCall(
  (data, context): Promise<DatabaseActionResult> => {
    const request = data as CreatePlanRequest;

    console.log(request);

    const { uid } = request;
    // uid auth check
    if (!(uid === context.auth?.uid)) {
      throw new Error("invalid request : uid");
    }

    return PLANS.createPlanWithTitle(request);
  }
);
export const deletePlan = functions.https.onCall(
  (data, context): Promise<DatabaseActionResult> => {
    const request = data as DocIdRequest;

    if (context.auth?.uid !== request.uid) {
      throw new Error("invalid request : uid");
    }

    return PLANS.deletePlanWithDocId(request);
  }
);

export const planItem = functions.https.onCall(
  (data, context): Promise<PlanItem> => {
    const request = data as DocIdRequest;

    console.log(request);

    return PLANITEMS.getPlanItem(request).then((planItemReturned: PlanItem) =>
      returnPlanItem(planItemReturned)
    );
  }
);

export const createPlanItem = functions.https.onCall(
  (data, context): Promise<DatabaseActionResult> => {
    const request = data as CreatePlanItemRequest;
    console.log(request);
    if (request.uid !== context.auth?.uid) {
      throw new Error("auth error : provided uid diffrent");
    }

    return PLANITEMS.createPlanItemWithUidPlaceIdTitle(request);
  }
);

export const updatePlanItem = functions.https.onCall((data, context) => {
  const request = data as UpdateRequest<PlanItem>;
  console.log(request);

  return PLANITEMS.updatePlanItem(request);
});

export const planItems = functions.https.onCall(
  (data, context): Promise<PlanItem[]> => {
    const request = data as DocIdRequest;
    console.log(request);

    if (request.uid !== context.auth?.uid) {
      throw new Error("auth error : provided uid diffrent");
    }

    return PLANITEMS.getPlanItemsFromPlanId(
      request
    ).then((planItemsReturned: PlanItem[]) =>
      returnPlanItems(planItemsReturned)
    );
  }
);

export const eventItems = functions.https.onCall(
  (data, context): Promise<EventItem[]> => {
    const request = data as DocIdRequest;
    console.log(request);

    return EVENTITEMS.getEventItemsFromPlanItem(
      request
    ).then((returnedEventItems) => returnEventItems(returnedEventItems));
  }
);

export const createEventItem = functions.https.onCall(
  (data, context): Promise<DatabaseActionResult> => {
    const request = data as CreateEventItemRequest;
    console.log(request);

    return EVENTITEMS.createEventItemWithTitle(request);
  }
);
