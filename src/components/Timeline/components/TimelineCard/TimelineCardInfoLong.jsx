import { useLayoutEffect, useRef, useState } from "react";
import { motion as Motion, useTransform } from "motion/react";

import styles from "./TimelineCard.module.scss";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import { useTimelineTrackContext } from "../../context";
import { getIcon } from "@/utils/projects";
import { getChildren, getProgressInformation } from "@/utils/dataTransforms";

const TimelineCardInfoLong = ({ project, cardStartPosition, width }) => {
  const infoTextRef = useRef(null);
  const [textWidth, setTextWidth] = useState(null);

  const { x } = useTimelineTrackContext();
  const { items } = useProjectsAndTasksContext();

  useLayoutEffect(() => {
    if (infoTextRef.current) setTextWidth(infoTextRef.current.clientWidth);
  }, [project]);

  const y = useTransform(x, (v) => {
    const windowStart = -v;
    if (windowStart <= cardStartPosition) return 0;
    return Math.min(
      width - textWidth - 2 /* 2px total inline border width of the card */,
      -v - cardStartPosition
    );
  });

  const Icon = getIcon(project.icon).icon;

  const childTasks = getChildren(items, project.id);
  const progress = getProgressInformation(childTasks);
  const percentage = Math.round((progress.completed / progress.overall) * 100);

  return (
    <div className={styles["card-info-container"]}>
      <Motion.div
        ref={infoTextRef}
        className={styles["card-info-long"]}
        style={{ x: y }}
      >
        <div className={styles["card-info-name"]}>
          <Icon
            size={16}
            stroke="currentColor"
            className={styles["card-info-icon"]}
          />
          <p>{project.name}</p>
        </div>
        {childTasks.length > 0 && (
          <p className={styles["card-info-progress"]}>
            {`Задачи: ${progress.completed}/${progress.overall} (${percentage}%)`}
          </p>
        )}
      </Motion.div>
    </div>
  );
};

export default TimelineCardInfoLong;
