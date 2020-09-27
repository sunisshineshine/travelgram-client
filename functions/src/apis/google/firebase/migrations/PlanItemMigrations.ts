import { planItemsCollection } from "../initialize";

export const returnPlanItems = async (
  target: PlanItem[]
): Promise<PlanItem[]> => {
  return await Promise.all(target.map((planItem) => returnPlanItem(planItem)));
};

export const returnPlanItem = async (target: PlanItem): Promise<PlanItem> => {
  let planItem = Object.assign(target, {});
  planItem = await planItemMigration20200927(planItem);
  return planItem;
};

// migration for timebased, it require null instead of undefined
export const planItemMigration20200927 = async (
  old: PlanItem
): Promise<PlanItem> => {
  if (
    (old.endTime && old.startTime) ||
    (old.endTime == null && old.startTime == null)
  ) {
    return old;
  }
  console.log("plan item migration start : ver.20200927");
  console.log("set end and start time for null");
  console.log("origin : ");
  console.log(old);
  if (!old.endTime) {
    old.endTime = null;
  }
  if (!old.startTime) {
    old.startTime = null;
  }

  await planItemsCollection.doc(old.docId).set(old);
  console.log("plan item migration has ended");
  console.log("result :");
  console.log(old);
  return old;
};
