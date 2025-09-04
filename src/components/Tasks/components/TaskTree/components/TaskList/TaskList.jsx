import { FileX2 } from "lucide-react";

import styles from "./TaskList.module.scss";

import ItemCard from "../ItemCard/ItemCard";
import SpinnerBox from "@/components/UI/SpinnerBox";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import { getRootItems } from "@/utils/dataTransforms";

const TaskList = () => {
  const { items, loading } = useProjectsAndTasksContext();

  if (loading) return <SpinnerBox height="lg" />;

  // TODO: Add UI for error

  const rootItems = getRootItems(items);

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
