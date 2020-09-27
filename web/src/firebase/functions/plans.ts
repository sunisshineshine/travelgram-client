import { getAuthUser } from "../auth";
import { firebaseFunctions } from "../initialize";
import { createDocIdRequest } from "../utils/requests";

const functionsPlan = firebaseFunctions.httpsCallable("plan");
const functionsPlans = firebaseFunctions.httpsCallable("plans");
const functionsCreatePlan = firebaseFunctions.httpsCallable("createPlan");
const functionsDeletePlan = firebaseFunctions.httpsCallable("deletePlan");
const functionsPlanItem = firebaseFunctions.httpsCallable("planItem");
const functionsPlanItems = firebaseFunctions.httpsCallable("planItems");
const functionsCreatePlanItem = firebaseFunctions.httpsCallable(
  "createPlanItem"
);

console.log("functions plan requested");

export const getPlan = async (docId: string): Promise<Plan> => {
  console.log("get plan with " + docId);
  const user = await getAuthUser();
  if (!user) {
    throw new Error("please login first");
  }
  const request: DocIdRequest = {
    uid: user.uid,
    docId,
  };

  const result = await functionsPlan(request);
  const plan = (result.data as unknown) as Plan;
  return plan;
};

export const getPlans = async (): Promise<Plan[]> => {
  console.log("get plans");

  const currentUser = await getAuthUser();
  console.log("current logged in user : " + currentUser?.email);

  if (!currentUser) {
    throw new Error("please login first");
  }

  const request: UidRequest = {
    uid: currentUser.uid,
  };

  const result = await functionsPlans(request);
  console.log(result);
  return (result.data as unknown) as Plan[];
};

export const createPlan = async (
  title: string,
  startTime: number | null,
  endTime: number | null
): Promise<DatabaseActionResult> => {
  console.log("create Plan");
  const user = await getAuthUser();

  if (!user) {
    throw new Error("user not logged in");
  }

  const uid = user.uid;

  const request: CreatePlanRequest = {
    title,
    uid,
    startTime,
    endTime,
  };

  console.log(request);

  const result = await functionsCreatePlan(request);
  const data = (result.data as unknown) as DatabaseActionResult;
  return data;
};
export const deletePlan = async (
  docId: string
): Promise<DatabaseActionResult> => {
  console.log("deletePlan with " + docId);
  const user = await getAuthUser();
  if (!user) {
    throw new Error("please login first");
  }
  const request: DocIdRequest = {
    docId,
    uid: user.uid,
  };

  const result = await functionsDeletePlan(request);
  const data = result.data;
  if (!data) {
    throw new Error("data is empty");
  }

  console.log(data);

  return {
    docId,
    ok: true,
  };
};

export const getPlanItem = async (docId: string): Promise<PlanItem> => {
  console.log("get plan item with" + docId);
  const user = await getAuthUser();
  if (!user) {
    throw new Error("please login first");
  }

  const uid = user.uid;
  const request: DocIdRequest = {
    uid,
    docId,
  };

  const result = await functionsPlanItem(request);
  console.log(result);
  const data = result.data;
  if (!data) {
    throw new Error("data is not exist");
  } else {
    return data as PlanItem;
  }
};

export const createPlanItem = async (
  planDocId: string,
  title: string,
  placeId: string
): Promise<DatabaseActionResult> => {
  console.log("create plan item : " + title);
  const uid = (await getAuthUser())?.uid;
  if (!uid) {
    throw new Error("cannot get uid auth");
  }
  const request: CreatePlanItemRequest = {
    planDocId,
    title,
    placeId,
    uid,
    // todo : implement with time
    endTime: null,
    startTime: null,
  };

  const result = await functionsCreatePlanItem(request);
  const data = result.data as DatabaseActionResult;

  if (!data) {
    throw new Error("data is empty");
  }

  return data;
};

export const getPlanItems = async (planDocId: string): Promise<PlanItem[]> => {
  console.log("get plan Item from plan docId : " + planDocId);
  const request = await createDocIdRequest(planDocId);

  const result = await functionsPlanItems(request);
  const planItems = result.data as PlanItem[];

  if (!planItems) {
    throw new Error("cannot get planitems");
  }

  return planItems;
};
