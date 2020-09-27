import { planItemsCollection, plansCollection } from "../initialize";
import { createPlanItemWithUidPlaceIdTitle } from "../plans/PlanItems";

export const returnPlans = async (target: Plan[]): Promise<Plan[]> => {
  return await Promise.all(target.map((plan) => returnPlan(plan)));
};

export const returnPlan = async (target: Plan): Promise<Plan> => {
  let plan = Object.assign(target, {});
  plan = await planMigration20200924(plan);
  plan = await planMigration20200925(plan);
  return plan;
};

// planItems(ref) => planItemIds(string)
export const planMigration20200925 = async (old: Plan): Promise<Plan> => {
  if (!old.planItems) {
    return old;
  }

  console.log("plan migration starting 20200925");
  console.log("planItems -> planItemIds");
  console.log("origin :");
  console.log(old);

  const planItemIds = old.planItems.map((planItem) => {
    return planItem.id;
  });

  const plan = Object.assign(old, {});

  if (!plan.planItemIds) {
    plan.planItemIds = [];
  }

  plan.planItemIds = [...plan.planItemIds, ...planItemIds];
  delete plan.planItems;

  await plansCollection.doc(plan.docId).set(plan);

  console.log("plan migration ended result : ");
  console.log(plan);

  return plan;
};

// places => planItems
export const planMigration20200924 = async (old: Plan): Promise<Plan> => {
  if (!old.places) {
    return old;
  }

  console.log("plan migration starting 20200924");
  console.log("places -> planItems");
  console.log("origin :");
  console.log(old);

  const { places, uid } = old;
  const plan = old;

  const planItems = await Promise.all(
    places.map(async (place) => {
      const request: CreatePlanItemRequest = {
        planDocId: plan.docId,
        uid,
        title: "",
        placeId: place,
        endTime: null,
        startTime: null,
      };
      const result = await createPlanItemWithUidPlaceIdTitle(request);
      return planItemsCollection.doc(result.docId);
    })
  );

  //   initialize if not exist
  if (!plan.planItems) {
    plan.planItems = [];
  }

  plan.planItems = [...plan.planItems, ...planItems];

  //   after update planItems, delete places objects
  delete plan.places;

  await plansCollection.doc(plan.docId).set(plan);
  console.log("plan migration finished");
  console.log("after : ");
  console.log(plan);

  return plan;
};
