import { motion as Motion } from "motion/react";

import styles from "./TaskGridItem.module.scss";
import ProjectSymbol from "@/components/shared/ProjectSymbol";
import usePlannerStore, { getRootProject } from "../../store";
import Tooltip, { TooltipContent } from "@/lib/Tooltip";

const TaskGridItem = ({ item, row, column }) => {
  const project = usePlannerStore(getRootProject(item));
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
        renderOpener={(props) => (
          <div {...props}>
            <ProjectSymbol
              paletteId={project.palette}
              iconId={project.icon}
              size="100%"
            />
          </div>
        )}
        renderContent={() => <TooltipContent>📝 {item.text}</TooltipContent>}
        disabled={isDragging}
        openDelay={1000}
      />
    </Motion.div>
  );
};

export default TaskGridItem;
