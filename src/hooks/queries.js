import { useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, doc, orderBy, query, where } from "firebase/firestore";
import {
  useCollectionData,
  useDocumentDataOnce,
} from "react-firebase-hooks/firestore";

import { auth, db } from "@/config/firebase";
import { batchUpdateItems, itemConverter, saveItem } from "@/utils/firebase";
import useNotificationStore from "@/store/useNotificationStore";
import { updateItem } from "@/utils/firebase";
import { DEFAULT_PROJECT_ID } from "@/consts/database";

export const useProjectsAndTasks = () => {
  const [user] = useAuthState(auth);
  return useCollectionData(
    query(
      collection(db, "items"),
      where("userId", "==", user.uid),
      where("type", "in", ["project", "task"]),
      where("deleted", "==", false),
      orderBy("createdAt")
    ).withConverter(itemConverter)
  );
};

export const useProjects = () => {
  const [user] = useAuthState(auth);
  return useCollectionData(
    query(
      collection(db, "items"),
      where("userId", "==", user.uid),
      where("type", "==", "project"),
      where("deleted", "==", false),
      orderBy("createdAt")
    ).withConverter(itemConverter)
  );
};

export const useDefaultProject = () => {
  return useDocumentDataOnce(
    doc(db, "items", DEFAULT_PROJECT_ID).withConverter(itemConverter)
  );
};

export const useSaveItem = () => {
  const notify = useNotificationStore((state) => state.notify);

  return useCallback(
    async (item) => {
      return await saveItem(item, notify);
    },
    [notify]
  );
};

export const useUpdateItem = () => {
  const notify = useNotificationStore((state) => state.notify);

  return useCallback(
    async (docId, update) => {
      return await updateItem(docId, update, notify);
    },
    [notify]
  );
};

export const useBatchUpdateItems = () => {
  const notify = useNotificationStore((state) => state.notify);

  return useCallback(
    async (updates) => {
      return await batchUpdateItems(updates, notify);
    },
    [notify]
  );
};

export const useDeleteItem = () => {
  const notify = useNotificationStore((state) => state.notify);

  return useCallback(
    async (itemId) => {
      await updateItem(itemId, { deleted: true }, notify);
    },
    [notify]
  );
};
