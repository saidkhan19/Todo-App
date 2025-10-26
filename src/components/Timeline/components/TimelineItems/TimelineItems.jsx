import styles from "./TimelineItems.module.scss";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import { getProjects } from "@/utils/dataTransforms";
import TimelineItem from "../TimelineItem/TimelineItem";

const TimelineItems = () => {
  const { items, loading, error } = useProjectsAndTasksContext();

  if (loading || error) return null;

  const projects = getProjects(items);

  return (
    <div className={styles["projects-container"]}>
      {projects.map((project) => (
        <TimelineItem key={project.id} project={project} />
      ))}
    </div>
  );
};

export default TimelineItems;
