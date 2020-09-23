import { getAuthUser } from "../auth";
import { firebaseFunctions } from "../initialize";

const functionsPlan = firebaseFunctions.httpsCallable("plan");
const functionsPlans = firebaseFunctions.httpsCallable("plans");
const functionsCreatePlan = firebaseFunctions.httpsCallable("createPlan");

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

  const result = await functionsCreatePlan(request);
  const data = (result.data as unknown) as ActionResult;
  return data;
};
