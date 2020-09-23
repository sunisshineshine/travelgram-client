import { functions } from "./initialize";
import { plansCollection, getTimestampNow } from "./initialize";

// apis
export const plan = functions.https.onCall((data, context) => {
  console.log("get plan detail request");

  const request = data as DocIdRequest;
  console.log(request);

  return getPlanDetailWithDocId(request);
});

export const plans = functions.https.onCall((data, context) => {
  const request = data as UidRequest;

  console.log(request);

  if (request.uid != context.auth?.uid) {
    throw new Error("request uid and context uid is diffrent. request aborted");
  }

  return getPlansWithUid(request).catch((error) => {
    throw error;
  });
});

export const createPlan = functions.https.onCall((data, context) => {
  const request = data as CreatePlanRequest;

  console.log(request);

  const { uid } = request;
  // uid auth check
  if (!(uid == context.auth?.uid)) {
    return Promise.reject(Error(`auth information error`));
  }

  return createPlanWithTitle(request).catch((error) => {
    throw new Error(error);
  });
});

// codes
export const createPlanWithTitle = async (
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

export const getPlansWithUid = async (request: UidRequest): Promise<Plan[]> => {
  const { uid } = request;

  const querySnapshot = await plansCollection.where("uid", "==", uid).get();

  const plans = querySnapshot.docs.map((docSnapshot) => {
    const plan = (docSnapshot.data() as unknown) as Plan;
    plan.docId = docSnapshot.id;
    return plan;
  });

  console.log(plans);
  return plans;
};

export const getPlanDetailWithDocId = async (
  request: DocIdRequest
): Promise<Plan> => {
  const { id: docId } = request;
  if (docId == "") {
    throw new Error("invalid request : docid is empty");
  }

  const snapshot = await plansCollection.doc(docId).get();
  const plan = snapshot.data();

  if (plan == undefined) {
    throw new Error("plan is empty");
  } else {
    return (plan as unknown) as Plan;
  }
};
