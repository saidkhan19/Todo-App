import styles from "./ProjectList.module.scss";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import SpinnerBox from "@/components/UI/SpinnerBox";
import Container from "@/components/UI/Container";
import StatusMessage from "@/components/UI/StatusMessage";
import { transformFirebaseError } from "@/utils/notifications";
import { getProjects } from "@/utils/dataTransforms";
import ProjectCard from "../ProjectCard/ProjectCard";
import AddProjectButton from "../AddProjectButton/AddProjectButton";

const ProjectList = () => {
  const { items, loading, error } = useProjectsAndTasksContext();

  if (loading) return <SpinnerBox height="md" />;

  if (error)
    return (
      <Container width="70%" minWidth="250px" maxWidth="100%">
        <StatusMessage title="Oшибка" {...transformFirebaseError(error)} />
      </Container>
    );

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
