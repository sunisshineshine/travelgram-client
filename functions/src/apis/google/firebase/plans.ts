import { functions, planItemsCollection } from "./initialize";
import { plansCollection, getTimestampNow } from "./initialize";
import { returnPlan } from "./migrations/PlanMigrations";

// apis
export const plan = functions.https.onCall((data, context) => {
  console.log("get plan detail request");

  const request = data as DocIdRequest;
  console.log(request);

  return getPlanDetailWithDocId(request);
});

export const plans = functions.https.onCall((data, context) => {
  const request = data as UidRequest;

  console.log(request);

  if (request.uid != context.auth?.uid) {
    throw new Error("request uid and context uid is diffrent. request aborted");
  }

  return getPlansWithUid(request);
});

export const createPlan = functions.https.onCall((data, context) => {
  const request = data as CreatePlanRequest;

  console.log(request);

  const { uid } = request;
  // uid auth check
  if (!(uid == context.auth?.uid)) {
    return Promise.reject(Error(`auth information error`));
  }

  return createPlanWithTitle(request);
});

export const planItem = functions.https.onCall((data, context) => {
  const request = data as DocIdRequest;

  console.log(request);

  return getPlanItem(request);
});

export const createPlanItem = functions.https.onCall((data, context) => {
  const request = data as CreatePlanItemRequest;
  console.log(request);
  if (request.uid != context.auth?.uid) {
    throw new Error("auth error : provided uid diffrent");
  }

  return createPlanItemWithUidPlaceIdTitle(request);
});

// codes
export const createPlanWithTitle = async (
  request: CreatePlanRequest
): Promise<ActionResult> => {
  const { uid, title } = request;

  if (!(title && title != "")) {
    return Promise.reject("request props are not filled correctly");
  }
  // create plan object
  const docId = plansCollection.doc().id;
  const createTime = getTimestampNow();
  const plan: Plan = {
    docId,
    uid,
    title,
    createTime,
    planItemIds: [],
  };

  const result = await plansCollection.doc(docId).set(plan);
  console.log(result);

  return { ok: true };
};

export const getPlansWithUid = async (request: UidRequest): Promise<Plan[]> => {
  const { uid } = request;

  const querySnapshot = await plansCollection.where("uid", "==", uid).get();

  const plans = await Promise.all(
    querySnapshot.docs.map(async (docSnapshot) => {
      const data = docSnapshot.data() as unknown;
      if (!data) {
        throw new Error("data is empty");
      }
      let plan = data as Plan;
      plan.docId = docSnapshot.id;
      plan = await returnPlan(data as Plan);
      return plan;
    })
  );

  console.log(plans);

  return plans;
};

export const getPlanDetailWithDocId = async (
  request: DocIdRequest
): Promise<Plan> => {
  console.log("get plan detail with doc id : " + request.id);
  const { id: docId } = request;
  if (docId == "") {
    throw new Error("invalid request : docid is empty");
  }

  const snapshot = await plansCollection.doc(docId).get();
  const data = snapshot.data() as unknown;
  if (!data) {
    throw new Error("data is empty");
  }
  const plan = data as Plan;
  plan.docId = snapshot.id;

  console.log("success to get plan");
  console.log(plan);

  return await returnPlan(plan);
};

export const createPlanItemWithUidPlaceIdTitle = async (
  request: CreatePlanItemRequest
): Promise<DatabaseActionResult> => {
  const { uid, title, placeId, planDocId } = request;
  console.log("creating place Item title: " + title);

  const planItemDocId = planItemsCollection.doc().id;
  const placeItem: PlanItem = {
    docId: planItemDocId,
    placeId,
    uid,
    title,
    planDocId,
  };

  const planSnapshot = await plansCollection.doc(planDocId).get();
  const plan = (planSnapshot.data() as unknown) as Plan | undefined;

  if (!plan) {
    throw new Error("cannot get plan from provided planDocId");
  }

  plan.planItemIds.push(planItemDocId);
  await planSnapshot.ref.set(plan);

  await planItemsCollection.doc(planItemDocId).set(placeItem);

  return {
    ok: true,
    docId: planItemDocId,
  };
};

export const getPlanItem = async (request: DocIdRequest): Promise<PlanItem> => {
  const { id: docId } = request;
  console.log("get plan item id: " + docId);
  const snapshot = await planItemsCollection.doc(docId).get();
  const data = snapshot.data();
  if (!data) {
    throw new Error("data is not exist");
  }
  console.log("data recived");
  console.log(data);
  return (data as unknown) as PlanItem;
};
