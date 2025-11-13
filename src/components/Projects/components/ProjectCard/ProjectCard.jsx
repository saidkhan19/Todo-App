import { useId } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import clsx from "clsx/lite";
import { FileCheck2 } from "lucide-react";

import styles from "./ProjectCard.module.scss";
import DateDisplay from "@/components/shared/DateDisplay";
import { getColorPalette } from "@/utils/projects";
import CircleChip from "../CircleChip";
import UpdateProjectButton from "../UpdateProjectButton/UpdateProjectButton";
import ProgressBar from "@/components/UI/ProgressBar";
import { getChildren, getProgressInformation } from "@/utils/dataTransforms";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";

const ProjectCard = ({ project, className }) => {
  const progressId = useId();
  const { items } = useProjectsAndTasksContext();
  const { t } = useTranslation(["common", "projects"]);

  const palette = getColorPalette(project.palette);
  const childItems = getChildren(items, project.id);
  const { completed, overall } = getProgressInformation(childItems);

  return (
    <div className={clsx(className, styles["card"])}>
      <div className={styles["card__header"]}>
        <div className={styles["card__title"]}>
          <div className={styles["card__chip"]}>
            <CircleChip palette={palette} isLoading={project.isLoading} />
          </div>
          <p>{project.name}</p>
        </div>

        <DateDisplay
          startDate={project.startDate}
          endDate={project.endDate}
          className={styles["card__date"]}
        />

        <UpdateProjectButton project={project} />
      </div>
      <div className={styles["card__footer"]}>
        <div className={styles["progress-container"]}>
          {childItems.length > 0 && (
            <div className={styles["progress"]}>
              <p id={progressId} className={styles["progress__label"]}>
                <span className="sr-only">{t("projects:progressLabel")}</span>
                <span>
                  {completed}/{overall}
                </span>
              </p>
              <ProgressBar
                value={(completed / overall) * 100}
                labelledby={progressId}
              />
            </div>
          )}
        </div>
        <Link
          to={`/tasks?action=add-task&project=${project.id}`}
          className={clsx("btn", styles["add-task-link"])}
          title={t("common:controls.addTask")}
        >
          <FileCheck2 size={18} stroke="currentColor" />
          <span className="sr-only">{t("common:controls.addTask")}</span>
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
