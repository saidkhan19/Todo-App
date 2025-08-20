import { collection, doc, orderBy, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";

import { auth, db } from "@/config/firebase";
import { itemConverter } from "@/utils/firebase";
import useFirebaseErrorNotification from "@/hooks/useFirebaseErrorNotification";
import SpinnerBox from "@/components/UI/SpinnerBox";
import usePlannerStore from "../../store";
import { useEffect } from "react";

const DataFetcher = ({ children }) => {
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

  const [defaultProject, loadingDefaultProject, errorDefaultProject] =
    useDocumentData(doc(db, "items", "TASKS").withConverter(itemConverter));

  useFirebaseErrorNotification(errorItems);
  useFirebaseErrorNotification(errorDefaultProject);

  const setItems = usePlannerStore((state) => state.setItems);
  const setDefaultProject = usePlannerStore((state) => state.setDefaultProject);

  useEffect(() => {
    // Sync with Zustand store
    setItems(items || []);
    setDefaultProject(defaultProject);
  }, [items, defaultProject, setDefaultProject, setItems]);

  if (
    items == null ||
    defaultProject == null ||
    loadingDefaultProject ||
    loadingItems
  )
    return <SpinnerBox height="lg" />;

  return <>{children}</>;
};

export default DataFetcher;
