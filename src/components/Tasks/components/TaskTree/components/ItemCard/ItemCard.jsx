import { useContext, useMemo } from "react";

import styles from "./ItemCard.module.scss";
import { getColorPalette } from "@/utils/projects";
import ProjectItem from "../ProjectItem/ProjectItem";
import TaskGroup from "../TaskGroup/TaskGroup";
import TaskItem from "../TaskItem/TaskItem";
import { TaskExpansionContext, TasksContext } from "../../context";
import ExpandButton from "./ExpandButton";

const getStyles = (item, isHighlighted) => {
  if (isHighlighted(item.id)) {
    return {
      border: "none",
      outline: "3px solid var(--clr-accent)",
    };
  }

  if (item.type == "project") {
    const palette = getColorPalette(item.palette);
    return {
      border: `1px solid ${palette.primary}`,
    };
  }
  return null;
};

const ItemCard = ({ item }) => {
  const { getChildren } = useContext(TasksContext);
  const { isExpanded, toggleExpandedTask, isHighlighted } =
    useContext(TaskExpansionContext);

  // Using memoization since some children are wrapper in memo
  const childItems = useMemo(() => getChildren(item.id), [getChildren, item]);
  const hasChildren = childItems.length > 0;
  const isTaskExpanded = isExpanded(item.id);

  return (
    <div className={styles["item-card-container"]}>
      <div
        id={item.id}
        className={styles["item-card"]}
        style={getStyles(item, isHighlighted)}
      >
        {item.type === "project" ? (
          <ProjectItem key={item.id} item={item} childItems={childItems} />
        ) : (
          <TaskItem key={item.id} item={item} childItems={childItems} />
        )}
        {hasChildren && (
          <ExpandButton
            isExpanded={isTaskExpanded}
            onClick={() => toggleExpandedTask(item.id)}
          />
        )}
      </div>
      {isTaskExpanded && hasChildren && <TaskGroup items={childItems} />}
    </div>
  );
};

export default ItemCard;
