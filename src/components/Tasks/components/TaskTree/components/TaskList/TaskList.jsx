import { FileX2 } from "lucide-react";

import styles from "./TaskList.module.scss";
import SpinnerBox from "@/components/UI/SpinnerBox";
import { transformFirebaseError } from "@/utils/notifications";
import StatusMessage from "@/components/UI/StatusMessage";
import Container from "@/components/UI/Container";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import ItemCard from "../ItemCard/ItemCard";
import { getRootItems } from "@/utils/dataTransforms";

const TaskList = () => {
  const { items, loading, error } = useProjectsAndTasksContext();

  if (loading) return <SpinnerBox height="lg" />;

  if (error)
    return (
      <Container width="70%" minWidth="250px" maxWidth="100%" padding="20px 0">
        <StatusMessage title="Oшибка" {...transformFirebaseError(error)} />
      </Container>
    );

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
