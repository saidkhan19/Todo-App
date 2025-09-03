import { motion as Motion } from "motion/react";

import styles from "./TaskGridItem.module.scss";
import Tooltip, { TooltipContent } from "@/lib/Tooltip";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import ProjectInfo from "./ProjectInfo";
import useDragHandlers from "../../hooks/useDragHandlers";

const TaskGridItem = ({ row, column, item }) => {
  const { items } = useProjectsAndTasksContext();
  const { isDragging, handleDragStart, handleDragEnd } = useDragHandlers(
    row,
    column,
    item,
    items
  );

  if (!items) return null;

  return (
    <Motion.div
      layoutId={item.id}
      drag
      dragSnapToOrigin
      whileDrag={{ scale: 1.2, zIndex: 100 }}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={styles["item"]}
      style={{ pointerEvents: isDragging ? "none" : "auto" }}
    >
      <Tooltip
        renderOpener={(props) => <ProjectInfo {...props} item={item} />}
        renderContent={() => <TooltipContent>📝 {item.text}</TooltipContent>}
        disabled={isDragging}
        openDelay={800}
      />
    </Motion.div>
  );
};

export default TaskGridItem;
