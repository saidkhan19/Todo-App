import styles from "./ProjectCard.module.scss";
import SpinnerBox from "@/components/UI/SpinnerBox";
import { getColorPalette } from "@/utils/projects";
import CircleChip from "../CircleChip";
import DateDisplay from "@/components/shared/DateDisplay";

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
          startDate={project.startDate.toDate()}
          endDate={project.endDate.toDate()}
          className={styles["card__date"]}
        />

        <button
          className={`btn ${styles["card__edit-button"]}`}
          title="Изменить"
        >
          <span className="sr-only">Изменить</span>
        </button>
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
