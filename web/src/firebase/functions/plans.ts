import { getAuthUser } from "../auth";
import { firebaseFunctions } from "../initialize";

const functionsPlan = firebaseFunctions.httpsCallable("plan");
const functionsPlans = firebaseFunctions.httpsCallable("plans");
const functionsCreatePlan = firebaseFunctions.httpsCallable("createPlan");
const functionsPlanItem = firebaseFunctions.httpsCallable("planItem");

export const getPlan = async (docId: string): Promise<Plan> => {
  console.log("get plan with " + docId);
  const request: DocIdRequest = {
    id: docId,
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
  title: string
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
  };

  const result = await functionsCreatePlan(request);
  const data = (result.data as unknown) as DatabaseActionResult;
  return data;
};

export const getPlanItem = async (docId: string): Promise<PlanItem> => {
  console.log("get plan item with" + docId);
  const request: DocIdRequest = {
    id: docId,
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
