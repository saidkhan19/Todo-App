import styles from "./ProjectList.module.scss";
import useFirebaseErrorNotification from "@/hooks/useFirebaseErrorNotification";
import ProjectCard from "../ProjectCard/ProjectCard";
import AddProjectButton from "../AddProjectButton/AddProjectButton";
import SpinnerBox from "@/components/UI/SpinnerBox";
import { useProjects } from "@/hooks/queries";

const ProjectList = () => {
  const [projects, loading, error] = useProjects();
  useFirebaseErrorNotification(error);

  if (projects == null || loading) return <SpinnerBox height="md" />;

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
