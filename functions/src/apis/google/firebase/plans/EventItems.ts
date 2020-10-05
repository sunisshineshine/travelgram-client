import { eventItemsCollection, planItemsCollection } from "../initialize";

export const getEventItem = async (
  request: DocIdRequest
): Promise<EventItem> => {
  console.log("get event item form doc id : " + request.docId);

  const eventItem = await eventItemsCollection
    .doc(request.docId)
    .get()
    .then((docSnapshot) => {
      const data = docSnapshot.data();
      if (!data) {
        throw new Error("cannot get eventitem");
      }
      return (data as unknown) as EventItem;
    });
  return eventItem;
};

export const getEventItemsFromPlanItem = async (
  request: DocIdRequest
): Promise<EventItem[]> => {
  console.log("get event items from plan item :" + request.docId);

  const planItem = await planItemsCollection
    .doc(request.docId)
    .get()
    .then((docSnapshot) => {
      const data = docSnapshot.data();
      if (!data) {
        throw new Error("cannot get planItem");
      }
      return (data as unknown) as PlanItem;
    });

  const eventItems = await Promise.all(
    planItem.eventItemIds.map(async (eventItemId) => {
      return await getEventItem({
        docId: eventItemId,
        uid: request.uid,
      });
    })
  );

  console.log("successfully get event items, count : " + eventItems.length);

  return eventItems;
};

export const createEventItemWithTitle = async (
  request: CreateEventItemRequest
): Promise<DatabaseActionResult> => {
  console.log("create event item with title : " + request.title);

  const { endTime, planItemDocId, startTime, title, uid } = request;

  const eventItemId = eventItemsCollection.doc().id;

  const createTime = new Date().getTime();

  const eventItem: EventItem = {
    createTime,
    docId: eventItemId,
    endTime,
    planItemDocId,
    startTime,
    title,
    uid,
  };

  const createEventItem = await eventItemsCollection
    .doc(eventItemId)
    .set(eventItem);

  console.log("create event item done");
  console.log(createEventItem);

  const updatePlanItem = await planItemsCollection
    .doc(planItemDocId)
    .get()
    .then(async (docSnapshot) => {
      const data = docSnapshot.data();
      if (!data) {
        throw new Error("plan item is not exist");
      }

      const planItem = (data as unknown) as PlanItem;
      planItem.eventItemIds.push(eventItemId);
      return await docSnapshot.ref.set(planItem);
    });

  console.log("plan item updated with new event Item id");
  console.log(updatePlanItem);

  return {
    docId: eventItemId,
    ok: true,
  };
};
