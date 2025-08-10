import { useContext } from "react";

import styles from "./TaskList.module.scss";
import { TasksContext } from "../../context";
import ItemCard from "../ItemCard/ItemCard";

const TaskList = () => {
  const { loadingItems, errorItems, getRootItems } = useContext(TasksContext);

  const rootItems = getRootItems();

  return (
    <div className={styles["task-list"]}>
      {rootItems.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default TaskList;
