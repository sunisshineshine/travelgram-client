import { getAuthUser } from "../auth";

export const createDocIdRequest = async (
  docId: string
): Promise<DocIdRequest> => {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("please login first");
  }

  return {
    docId,
    uid: user.uid,
  };
};
