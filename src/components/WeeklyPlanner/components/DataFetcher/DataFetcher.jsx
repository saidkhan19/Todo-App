import { useEffect } from "react";

import useFirebaseErrorNotification from "@/hooks/useFirebaseErrorNotification";
import SpinnerBox from "@/components/UI/SpinnerBox";
import { usePlannerStore } from "../../store";
import { useDefaultProject, useProjectsAndTasks } from "@/hooks/queries";

const DataFetcher = ({ children }) => {
  const [items, loadingItems, errorItems] = useProjectsAndTasks();

  const [defaultProject, loadingDefaultProject, errorDefaultProject] =
    useDefaultProject();

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
