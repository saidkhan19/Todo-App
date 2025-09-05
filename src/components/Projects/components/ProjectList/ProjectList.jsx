import styles from "./ProjectList.module.scss";
import ProjectCard from "../ProjectCard/ProjectCard";
import AddProjectButton from "../AddProjectButton/AddProjectButton";
import SpinnerBox from "@/components/UI/SpinnerBox";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import { getProjects } from "@/utils/dataTransforms";

const ProjectList = () => {
  const { items, loading } = useProjectsAndTasksContext();

  if (loading) return <SpinnerBox height="md" />;

  // TODO: Handle Errors Locally

  const projects = getProjects(items);

  return (
    <div className={styles["project-list"]} data-testid="project-list">
      {projects.map((item) => (
        <ProjectCard
          key={item.id}
          project={item}
          className={styles["project-list__item"]}
        />
      ))}
      <AddProjectButton className={styles["project-list__item"]} />
    </div>
  );
};

export default ProjectList;
