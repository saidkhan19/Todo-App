import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, db } from "@/config/firebase";
import { collection, orderBy, query, where } from "firebase/firestore";
import { itemConverter } from "@/utils/firebase";

import { TasksContext } from "./context";
import { useMemo } from "react";

const TasksProvider = ({ children }) => {
  const [user] = useAuthState(auth);
  const [items, loadingItems, errorItems] = useCollectionData(
    query(
      collection(db, "items"),
      where("userId", "==", user.uid),
      where("type", "in", ["project", "task"]),
      where("deleted", "==", false),
      orderBy("createdAt")
    ).withConverter(itemConverter)
  );

  const value = useMemo(
    () => ({
      items: items || [],
      loadingItems,
      errorItems,
      getRootItems: () => items?.filter((item) => item.level === 0) || [],
      getChildren: (parentId) =>
        items?.filter((item) => item.parentId === parentId) || [],
      getItemById: (id) => items?.find((item) => item.id === id),
    }),
    [items, loadingItems, errorItems]
  );

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
};

export default TasksProvider;
