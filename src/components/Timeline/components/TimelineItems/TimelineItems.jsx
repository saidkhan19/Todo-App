import { motion as Motion, useTransform } from "motion/react";

import styles from "./TimelineItems.module.scss";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import StatusMessage from "@/components/UI/StatusMessage";
import { getProjects } from "@/utils/dataTransforms";
import TimelineItem from "../TimelineItem/TimelineItem";
import { useTimelineTrackContext } from "../../context";
import { TIMELINE_ITEM_GAP, TRACK_OFFSET_TOP } from "../../consts";
import SpinnerBox from "@/components/UI/SpinnerBox";
import { transformFirebaseError } from "@/utils/notifications";

const TimelineItems = () => {
  const { items, loading, error } = useProjectsAndTasksContext();

  const { x, trackHeight } = useTimelineTrackContext();
  // Visible window moves in the opposite direction
  const y = useTransform(x, (v) => -v);

  if (loading)
    return (
      <Motion.div
        style={{ x: y, height: trackHeight }}
        className={styles["message-layer"]}
      >
        <SpinnerBox height="lg" />
      </Motion.div>
    );

  if (error)
    return (
      <Motion.div
        style={{ x: y, height: trackHeight }}
        className={styles["message-layer"]}
      >
        <StatusMessage {...transformFirebaseError(error)} />
      </Motion.div>
    );

  const projects = getProjects(items);
  if (projects.length === 0)
    return (
      <Motion.div
        style={{ x: y, height: trackHeight }}
        className={styles["message-layer"]}
      >
        <StatusMessage type="info" message="Проектов не найдено." />
      </Motion.div>
    );

  return (
    <div
      style={{ top: TRACK_OFFSET_TOP, gap: TIMELINE_ITEM_GAP }}
      className={styles["projects-container"]}
    >
      {projects.map((project) => (
        <TimelineItem key={project.id} project={project} />
      ))}
    </div>
  );
};

export default TimelineItems;
