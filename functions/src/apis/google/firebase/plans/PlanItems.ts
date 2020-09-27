import { planItemsCollection, plansCollection } from "../initialize";

export const createPlanItemWithUidPlaceIdTitle = async (
  request: CreatePlanItemRequest
): Promise<DatabaseActionResult> => {
  const {
    uid,
    title,
    placeId,
    planDocId,
    endTime,
    startTime,
    address,
    lat,
    lng,
  } = request;
  console.log("creating place Item title: " + title);

  const planItemDocId = planItemsCollection.doc().id;
  const placeItem: PlanItem = {
    docId: planItemDocId,
    placeId,
    uid,
    title,
    planDocId,
    endTime,
    startTime,
    address,
    lat,
    lng,
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
  const { docId } = request;
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

export const deletePlanItemWithDocId = async (
  request: DocIdRequest
): Promise<DatabaseActionResult> => {
  console.log("plan item delete :" + request.docId);

  const snapshot = await planItemsCollection.doc(request.docId).get();
  const data = snapshot.data();
  if (!data) {
    throw new Error("cannot get planItem data : empty");
  }

  const planItem = data as PlanItem;
  if (planItem.uid != request.uid) {
    throw new Error("invalid request : uid");
  }

  await snapshot.ref.delete();

  console.log("plan item successfully deleted " + request.docId);

  return {
    ok: true,
    docId: planItem.docId,
  };
};

export const getPlanItemsFromPlanId = async (
  request: DocIdRequest
): Promise<PlanItem[]> => {
  const plan = (await plansCollection.doc(request.docId).get()).data() as Plan;
  if (!plan) {
    throw new Error("plan is empty");
  }

  const planItems = await Promise.all(
    plan.planItemIds.map(async (planItemId) => {
      const snapshot = await planItemsCollection.doc(planItemId).get();
      const planItem = snapshot.data() as PlanItem;
      if (!planItem) {
        throw new Error("planItem is empty :" + snapshot.id);
      }

      return planItem;
    })
  );
  console.log("successfully getting plan items :");
  console.log(planItems);
  return planItems;
};
