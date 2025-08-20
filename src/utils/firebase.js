import { auth, db } from "@/config/firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { transformFirebaseError } from "./notifications";
import { FirebaseError } from "firebase/app";

export const itemConverter = {
  toFirestore: (item) => item,

  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id, // Add ID from document
      isLoading: snapshot.metadata.hasPendingWrites,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      startDate: data.startDate?.toDate(),
      endDate: data.endDate?.toDate(),
    };
  },
};

export const saveItem = async (data, notify) => {
  const itemDefaults = {
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    userId: auth.currentUser.uid,
    deleted: false,
    completed: false,
    parentId: null,
  };

  const item = { ...itemDefaults, ...data };

  try {
    const docRef = await addDoc(collection(db, "items"), item);
    return docRef;
  } catch (error) {
    if (error instanceof FirebaseError) notify(transformFirebaseError(error));
    else throw error;
  }
};

export const updateItem = async (docId, data, notify) => {
  const updateDefaults = {
    updatedAt: serverTimestamp(),
  };

  const item = { ...updateDefaults, ...data };

  try {
    const docRef = doc(db, "items", docId);
    await updateDoc(docRef, item);
    return docRef;
  } catch (error) {
    if (error instanceof FirebaseError) notify(transformFirebaseError(error));
    else throw error;
  }
};

export const batchUpdateItems = async (updates, notify) => {
  const updateDefaults = {
    updatedAt: serverTimestamp(),
  };

  try {
    const batch = writeBatch(db);

    // Add each update to the batch
    updates.forEach(({ docId, data }) => {
      const item = { ...updateDefaults, ...data };
      const docRef = doc(db, "items", docId);
      batch.update(docRef, item);
    });

    // Commit the batch
    await batch.commit();

    // Return array of document references
    return updates.map(({ docId }) => doc(db, "items", docId));
  } catch (error) {
    if (error instanceof FirebaseError) notify(transformFirebaseError(error));
    else throw error;
  }
};
