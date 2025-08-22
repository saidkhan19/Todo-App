import { motion as Motion } from "motion/react";

import styles from "./TaskGridItem.module.scss";
import Tooltip, { TooltipContent } from "@/lib/Tooltip";
import { usePlannerStore } from "../../store";
import ProjectInfo from "./ProjectInfo";

const TaskGridItem = ({ item, row, column }) => {
  const isDragging = usePlannerStore((state) => state.isDragging);
  const startDragging = usePlannerStore((state) => state.startDragging);
  const stopDragging = usePlannerStore((state) => state.stopDragging);

  const handleDragStart = () => startDragging(row, column, item);

  const handleDragEnd = () => stopDragging();

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
        openDelay={1000}
      />
    </Motion.div>
  );
};

export default TaskGridItem;
