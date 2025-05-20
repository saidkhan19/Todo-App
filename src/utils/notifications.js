import {
  firebaseErrors,
  defaultFirebaseError,
} from "../consts/firebase-errors";

export const transformFirebaseError = (error) => {
  return {
    type: "error",
    message: firebaseErrors[error?.code] || defaultFirebaseError,
  };
};
