import { getAuthUser } from "../auth";
import { firebaseFunctions } from "../initialize";
import { createDocIdRequest } from "../utils/requests";

const functionsPlan = firebaseFunctions.httpsCallable("plan");
const functionsPlans = firebaseFunctions.httpsCallable("plans");
const functionsCreatePlan = firebaseFunctions.httpsCallable("createPlan");
const functionsDeletePlan = firebaseFunctions.httpsCallable("deletePlan");
const functionsPlanItem = firebaseFunctions.httpsCallable("planItem");
const functionsUpdatePlanItem = firebaseFunctions.httpsCallable(
  "updatePlanItem"
);
const functionsPlanItems = firebaseFunctions.httpsCallable("planItems");
const functionsCreatePlanItem = firebaseFunctions.httpsCallable(
  "createPlanItem"
);

const functionsCreateEventItem = firebaseFunctions.httpsCallable(
  "createEventItem"
);
const functionsEventItems = firebaseFunctions.httpsCallable("eventItems");

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

export const createPlanItem = async (props: {
  planDocId: string;
  title: string;
  timeReq: TimeBased;
  placeReq: PlaceBased;
}): Promise<DatabaseActionResult> => {
  const { placeReq, planDocId, timeReq, title } = props;
  console.log("create plan item : " + title);
  const uid = (await getAuthUser())?.uid;
  if (!uid) {
    throw new Error("cannot get uid auth");
  }

  const { address, lat, lng, placeId } = placeReq;
  const request: CreatePlanItemRequest = {
    planDocId,
    title,
    uid,
    // time based
    endTime: timeReq.endTime,
    startTime: timeReq.startTime,
    // place based
    address,
    lat,
    lng,
    placeId,
  };

  const result = await functionsCreatePlanItem(request);
  const data = result.data as DatabaseActionResult;

  if (!data) {
    throw new Error("data is empty");
  }

  return data;
};

// tototododododo
export const updatePlanItem = async (props: {
  planItem: PlanItem;
}): Promise<DatabaseActionResult> => {
  console.log("update plan item");
  const createTime = new Date().getTime();

  const uid = await getAuthUser().then((user) => {
    if (!user) {
      throw new Error("please login first");
    }
    return user.uid;
  });
  const request: UpdateRequest<PlanItem> = {
    uid,
    createTime,
    docId: props.planItem.docId,
    item: props.planItem,
  };

  const result = (await functionsUpdatePlanItem(request))
    .data as DatabaseActionResult;
  console.log(result);
  if (!result) {
    throw new Error("cannot update plan item");
  }

  return result;
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

export const createEventItem = async (props: {
  content: string;
  planItemId: string;
}): Promise<DatabaseActionResult> => {
  const uid = await getAuthUser().then((user) => user!.uid);
  const request: CreateEventItemRequest = {
    uid,
    planItemDocId: props.planItemId,
    content: props.content,
  };

  const result = (await functionsCreateEventItem(request)).data;
  if (!result) {
    throw new Error("cannot create event item");
  }

  return (result as unknown) as DatabaseActionResult;
};

export const getEventItems = async (
  planItemDodId: string
): Promise<EventItem[]> => {
  console.log("get event item from plan item doc id :" + planItemDodId);

  const request = await createDocIdRequest(planItemDodId);
  const result = await functionsEventItems(request);

  const eventItems = result.data as EventItem[];

  if (!eventItems) {
    throw new Error("cannot get event items");
  }

  return eventItems;
};
