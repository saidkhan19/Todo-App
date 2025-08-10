import styles from "./TaskGroup.module.scss";
import ItemCard from "../ItemCard/ItemCard";

const TaskGroup = ({ items }) => {
  return (
    <div className={styles["task-group"]}>
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default TaskGroup;
