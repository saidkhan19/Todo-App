import PropTypes from "prop-types";

import styles from "./ProjectCard.module.scss";
import SpinnerBox from "@/components/UI/SpinnerBox";
import { getColorPalette } from "@/utils/projects";
import { formatDates } from "@/utils/format";
import CircleChip from "../CircleChip";

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
        {/* REMOVE conditional rendering WHEN Calendar is implemented */}
        {project.startDate && (
          <p className={styles["card__date"]}>
            {formatDates(
              project.startDate?.toDate(),
              project.endDate?.toDate()
            )}
          </p>
        )}
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
            <SpinnerBox size="sm" align="center" />
          </div>
        )}
      </div>
    </div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.object,
  className: PropTypes.string,
  loading: PropTypes.bool,
};

export default ProjectCard;
