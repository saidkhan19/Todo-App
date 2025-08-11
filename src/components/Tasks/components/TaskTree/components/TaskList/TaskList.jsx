import { useContext } from "react";
import { FileX2 } from "lucide-react";

import styles from "./TaskList.module.scss";
import { TasksContext } from "../../context";
import ItemCard from "../ItemCard/ItemCard";
import SpinnerBox from "@/components/UI/SpinnerBox";
import useFirebaseErrorNotification from "@/hooks/useFirebaseErrorNotification";

const TaskList = () => {
  const { loadingItems, errorItems, getRootItems } = useContext(TasksContext);

  useFirebaseErrorNotification(errorItems);

  if (loadingItems) return <SpinnerBox height="lg" />;

  const rootItems = getRootItems();

  if (rootItems.length === 0)
    return (
      <div className={styles["empty-list"]}>
        <FileX2 size={40} stroke="currentColor" />
        <p>
          Ничего не найдено.
          <br /> Добавьте новый проект или задачу.
        </p>
      </div>
    );

  return (
    <div className={styles["task-list"]}>
      {rootItems.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default TaskList;
