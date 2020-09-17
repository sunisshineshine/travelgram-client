import { plansCollection, getTimestampNow } from "./initialize";

export const createPlan = async (
  request: CreatePlanRequest
): Promise<ActionResult> => {
  const { uid, title } = request;

  if (!(title && title != "")) {
    return Promise.reject("request props are not filled correctly");
  }
  // create plan object
  const createTime = getTimestampNow();
  const plan: Plan = {
    uid,
    title,
    createTime,
    places: [],
  };

  return new Promise(async (resolve, reject) => {
    // do action and get result
    const result = await plansCollection.add(plan).catch((reason) => {
      reject(`cannot create plan item on server : ${reason}`);
    });

    // if no result => throw new error
    if (!result) {
      return;
    }

    resolve({ ok: true });
  });
};
