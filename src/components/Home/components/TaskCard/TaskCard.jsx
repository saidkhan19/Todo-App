import { useId } from "react";
import { Link } from "react-router";
import { motion as Motion } from "motion/react";

import styles from "./TaskCard.module.scss";
import CompleteTaskCheckbox from "@/components/shared/CompleteTaskCheckbox";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import { useDefaultProjectContext } from "@/components/DataProviders/DefaultProjectProvider";
import {
  getAllChildren,
  getProgressInformation,
  getRootProject,
} from "@/utils/dataTransforms";
import ProgressBar from "@/components/UI/ProgressBar";
import { getColorPalette } from "@/utils/projects";

const TaskCard = ({ task }) => {
  const { items } = useProjectsAndTasksContext();
  const { defaultProject } = useDefaultProjectContext();

  const progressId = useId();

  if (!items || !defaultProject) return null;

  const project = getRootProject(task, items, defaultProject);
  const palette = getColorPalette(project.palette);

  const childItems = getAllChildren(items, task.id);
  const progress = getProgressInformation(childItems);

  return (
    <Motion.div
      layout
      layoutId={`task-list-${task.id}`}
      className={styles["task-card"]}
    >
      <div className={styles["card__main"]}>
        <Link to={`/tasks#${task.id}`} className={styles["task-text"]}>
          {task.text}
        </Link>
        <CompleteTaskCheckbox item={task} />
      </div>
      <div className={styles["card__info"]}>
        <div className={styles["project-chip-container"]}>
          <div
            className={styles["project-chip"]}
            style={{ backgroundColor: palette.soft, color: palette.primary }}
          >
            <p>{project.name}</p>
          </div>
        </div>
        {childItems.length > 0 && (
          <div className={styles["task-progress-info"]}>
            <p id={progressId} className={styles["task-progress__label"]}>
              <span className="sr-only">Выполнено:</span>
              <span>
                {progress.completed}/{progress.overall}
              </span>
            </p>
            <ProgressBar
              value={(progress.completed / progress.overall) * 100}
              labelledby={progressId}
            />
          </div>
        )}
      </div>
    </Motion.div>
  );
};

export default TaskCard;
