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

// migration for timebased, placebased it require null instead of undefined
export const planItemMigration20200927 = async (
  old: PlanItem
): Promise<PlanItem> => {
  console.log("in migration");
  console.log(old.address);
  if (
    !(
      old.address === undefined ||
      old.lat === undefined ||
      old.lng === undefined ||
      old.placeId === undefined ||
      old.startTime === undefined ||
      old.endTime === undefined
    )
  ) {
    return old;
  }
  console.log("plan item migration start : ver.20200927");
  console.log("set end and start time for null");
  console.log("origin : ");
  console.log(old);
  // time based
  if (!old.endTime) {
    old.endTime = null;
  }
  if (!old.startTime) {
    old.startTime = null;
  }
  // place based
  if (!old.address) {
    old.address = null;
  }
  if (!old.placeId) {
    old.placeId = null;
  }
  if (!old.lat) {
    old.lat = null;
  }
  if (!old.lng) {
    old.lng = null;
  }

  await planItemsCollection.doc(old.docId).set(old);
  console.log("plan item migration has ended");
  console.log("result :");
  console.log(old);
  return old;
};
