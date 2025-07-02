import styles from "./ProjectCard.module.scss";
import SpinnerBox from "@/components/UI/SpinnerBox";
import DateDisplay from "@/components/shared/DateDisplay";
import { getColorPalette } from "@/utils/projects";
import CircleChip from "../CircleChip";
import UpdateProjectButton from "../UpdateProjectButton/UpdateProjectButton";

const ProjectCard = ({ project, className }) => {
  const palette = getColorPalette(project.palette);

  return (
    <div className={`${className} ${styles["card"]}`}>
      <div className={styles["card__header"]}>
        <p className={styles["card__title"]}>
          <span className={styles["card__chip"]}>
            <CircleChip palette={palette} />
          </span>
          <span>{project.name}</span>
        </p>

        <DateDisplay
          startDate={project.startDate}
          endDate={project.endDate}
          className={styles["card__date"]}
        />

        <UpdateProjectButton project={project} />
      </div>
      <div className={styles["card__footer"]}>
        {project.isLoading && (
          <div className={styles["loading-indicator"]}>
            <SpinnerBox size="sm" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
