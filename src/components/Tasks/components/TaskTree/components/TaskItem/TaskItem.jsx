import styles from "./TaskItem.module.scss";
import { useAddSubtaskModalState } from "../shared/hooks";
import { getProgressInformation } from "../shared/utils";
import AddSubtaskModal from "../shared/AddSubtaskModal/AddSubtaskModal";
import ItemCardMenu from "../shared/ItemCardMenu/ItemCardMenu";
import ItemCardDateForm from "../shared/ItemCardDateForm/ItemCardDateForm";
import ItemCardProgress from "../shared/ItemCardProgress/ItemCardProgress";

const TaskItem = ({ item, childItems }) => {
  const hasChildren = childItems.length > 0;
  const { overall, completed } = getProgressInformation(childItems);

  const addSubtaskModalState = useAddSubtaskModalState();

  return (
    <div className={styles["task-item"]}>
      <div className={`${styles["col-checkbox"]} flex-center`}></div>
      <div className={styles["col-text"]}>
        <p className={styles["task-item__text"]}>{item.text}</p>
      </div>
      <div className={`${styles["col-progress"]} flex-center`}>
        {hasChildren && (
          <ItemCardProgress completed={completed} overall={overall} />
        )}
      </div>
      <div className={`${styles["col-date-form"]} flex-center`}>
        <ItemCardDateForm
          itemId={item.id}
          defaultStartDate={item.startDate}
          defaultEndDate={item.endDate}
        />
      </div>
      <div className={`${styles["col-menu"]} flex-center`}>
        <ItemCardMenu
          type="task"
          openAddSubtaskModal={addSubtaskModalState.open}
        />
      </div>

      <AddSubtaskModal modalState={addSubtaskModalState} item={item} />
    </div>
  );
};

export default TaskItem;
