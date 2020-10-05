import { plansCollection } from "../initialize";
import { returnPlan } from "../migrations/PlanMigrations";
import { deletePlanItemWithDocId } from "./PlanItems";

// codes
export const createPlanWithTitle = async (
  request: CreatePlanRequest
): Promise<DatabaseActionResult> => {
  const { uid, title, endTime, startTime } = request;

  if (!(title && title !== "")) {
    return Promise.reject("request props are not filled correctly");
  }
  // create plan object
  const docId = plansCollection.doc().id;
  const createTime = new Date().getTime();
  const plan: Plan = {
    docId,
    uid,
    title,
    createTime,
    endTime,
    startTime,
    planItemIds: [],
  };

  const result = await plansCollection.doc(docId).set(plan);
  console.log(result);

  return { ok: true, docId };
};

export const deletePlanWithDocId = async (
  request: DocIdRequest
): Promise<DatabaseActionResult> => {
  console.log("delete plan with docId :" + request.docId);
  const docRef = plansCollection.doc(request.docId);
  const plan = ((await docRef.get()).data() as unknown) as Plan;

  console.log("plan will be deleted :");
  console.log(plan);

  if (plan.uid !== request.uid) {
    throw new Error("request's uid is not owner of this plan");
  }

  await Promise.all(
    plan.planItemIds.map(async (planItemId) => {
      const deletePlanRequest: DocIdRequest = {
        uid: plan.uid,
        docId: planItemId,
      };
      await deletePlanItemWithDocId(deletePlanRequest);
    })
  );

  const result = await docRef.delete();
  console.log(result);

  console.log("deleting plan success");

  return { docId: request.docId, ok: true };
};

export const getAllPlansWithUid = async (
  request: UidRequest
): Promise<Plan[]> => {
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
  console.log("get plan detail with doc id : " + request.docId);
  const { docId: docId } = request;
  if (docId === "") {
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
