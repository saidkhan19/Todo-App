import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";

import { db } from "/src/config/firebase";
import useNotificationStore from "../store/useNotificationStore";
import { transformFirebaseError } from "../utils/notifications";
import { FirebaseError } from "firebase/app";

export const useAddDocument = (collectionName) => {
  const [loading, setLoading] = useState(false);
  const notify = useNotificationStore((state) => state.notify);

  const addDocument = async (data) => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return docRef;
    } catch (error) {
      console.error(error);
      if (error instanceof FirebaseError) notify(transformFirebaseError(error));
      else throw error;
    } finally {
      setLoading(false);
    }
  };

  return [addDocument, loading];
};

// NOT USED ANYWHERE
