import { firebaseApp } from "./initialize";

export interface EmailPasswordRequest {
  email: string;
  password: string;
}
export const createUserWithEmailPassword = async (
  props: EmailPasswordRequest
): Promise<ActionResult> => {
  const { email, password } = props;
  return firebaseApp
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((credential) => {
      console.log(`creating user successfull : ${credential.user?.email}`);
      const result: ActionResult = {
        ok: true,
      };
      return result;
    })
    .catch((reason) => {
      console.log(reason);
      const result: ActionResult = {
        ok: false,
        error_message: reason,
      };
      return result;
    });
};

export const doLoginWithEmailAndPassword = async (
  props: EmailPasswordRequest
): Promise<ActionResult> => {
  const { email, password } = props;
  return firebaseApp
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((credential) => {
      console.log(`login success : ${credential.user?.email}`);
      return {
        ok: true,
      };
    })
    .catch((error) => {
      return {
        ok: false,
        error: error,
      };
    });
};

export const getAuthUser = async (): Promise<firebase.User | null> => {
  return new Promise((resolve) => {
    // todo : set timeout
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user != null) {
        resolve(user);
      } else {
        resolve(null);
      }
    });
  });
};

export const doSignOut = (): Promise<ActionResult> => {
  return firebaseApp
    .auth()
    .signOut()
    .then(() => {
      return {
        ok: true,
      };
    })
    .catch((reason) => {
      return {
        ok: false,
        error: reason,
      };
    });
};
