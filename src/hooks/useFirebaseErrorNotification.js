import { useEffect } from "react";

import useNotificationStore from "../store/useNotificationStore";
import { transformFirebaseError } from "../utils/notifications";

const useFirebaseErrorNotification = (firebaseError) => {
  const notify = useNotificationStore((state) => state.notify);

  useEffect(() => {
    if (firebaseError) notify(transformFirebaseError(firebaseError));
  }, [firebaseError, notify]);
};

export default useFirebaseErrorNotification;
