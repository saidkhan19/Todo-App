import { useAuthState } from "react-firebase-hooks/auth";
import { collection, doc, orderBy, query, where } from "firebase/firestore";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";

import { auth, db } from "@/config/firebase";
import { itemConverter } from "@/utils/firebase";
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
  return useDocumentData(
    doc(db, "items", DEFAULT_PROJECT_ID).withConverter(itemConverter)
  );
};

export const useDeleteItem = (itemId) => {
  const notify = useNotificationStore((state) => state.notify);

  const handleDeleteItem = async () => {
    await updateItem(itemId, { deleted: true }, notify);
  };

  return handleDeleteItem;
};
