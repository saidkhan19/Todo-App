import { motion as Motion, useTransform } from "motion/react";

import styles from "./TimelineItems.module.scss";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import { getProjects } from "@/utils/dataTransforms";
import TimelineItem from "../TimelineItem/TimelineItem";
import { useTimelineTrackContext } from "../../context";
import StatusMessage from "@/components/UI/StatusMessage";

const TimelineItems = () => {
  const { items, loading, error } = useProjectsAndTasksContext();

  const { x } = useTimelineTrackContext();
  // Visible window moves in the opposite direction
  const y = useTransform(x, (v) => -v);

  if (loading || error) return null;

  const projects = getProjects(items);

  return (
    <div className={styles["projects-container"]}>
      {projects.length === 0 && (
        <Motion.div
          style={{ x: y, height: "170px" }}
          className={styles["message-layer"]}
        >
          <StatusMessage type="info" message="Проектов не найдено." />
        </Motion.div>
      )}
      {projects.map((project) => (
        <TimelineItem key={project.id} project={project} />
      ))}
    </div>
  );
};

export default TimelineItems;
