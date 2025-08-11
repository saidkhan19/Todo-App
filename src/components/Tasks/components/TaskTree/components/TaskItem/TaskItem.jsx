import { memo } from "react";

import styles from "./TaskItem.module.scss";
import { useModalState } from "../shared/hooks";
import { getProgressInformation } from "../shared/utils";
import AddSubtaskModal from "../shared/AddSubtaskModal/AddSubtaskModal";
import ItemCardMenu from "../shared/ItemCardMenu/ItemCardMenu";
import ItemCardDateForm from "../shared/ItemCardDateForm/ItemCardDateForm";
import ItemCardProgress from "../shared/ItemCardProgress/ItemCardProgress";
import CompleteTaskCheckbox from "@/components/shared/CompleteTaskCheckbox/CompleteTaskCheckbox";
import UpdateTaskModal from "../shared/UpdateTaskModal/UpdateTaskModal";
import { useDeleteTask } from "@/hooks/tasks";
import useWindowSize from "@/hooks/useWindowSize";

const TaskItem = memo(({ item, childItems }) => {
  const hasChildren = childItems.length > 0;
  const { overall, completed } = getProgressInformation(childItems);

  const addSubtaskModalState = useModalState();
  const updateTaskModalState = useModalState();
  const handleDeleteTask = useDeleteTask(item.id);

  const windowSize = useWindowSize();

  const displayAddSubtaskModal = item.level < 3;

  return (
    <div className={styles["task-item"]}>
      <div className={`${styles["col-checkbox"]} flex-center`}>
        <CompleteTaskCheckbox item={item} />
      </div>
      <div className={styles["col-text"]}>
        <p className={styles["task-item__text"]}>{item.text}</p>
      </div>
      <div className={`${styles["col-progress"]} flex-center`}>
        {hasChildren && windowSize !== "phone" && (
          <ItemCardProgress completed={completed} overall={overall} />
        )}
      </div>
      <div className={`${styles["col-date-form"]} flex-center`}>
        {windowSize === "desktop" && (
          <ItemCardDateForm
            key={`${item.startDate.toISOString()}${item.endDate.toISOString()}`}
            itemId={item.id}
            defaultStartDate={item.startDate}
            defaultEndDate={item.endDate}
          />
        )}
      </div>
      <div className={`${styles["col-menu"]} flex-center`}>
        <ItemCardMenu
          type="task"
          openAddSubtaskModal={addSubtaskModalState.open}
          displayAddSubtaskModal={displayAddSubtaskModal}
          openUpdateTaskModal={updateTaskModalState.open}
          onDeleteTask={handleDeleteTask}
        />
      </div>

      {displayAddSubtaskModal && (
        <AddSubtaskModal modalState={addSubtaskModalState} item={item} />
      )}
      <UpdateTaskModal modalState={updateTaskModalState} item={item} />
    </div>
  );
});

export default TaskItem;
