import styles from "./TimelineCard.module.scss";
import { getIcon } from "@/utils/projects";

const TimelineCardInfoShort = ({ project }) => {
  const Icon = getIcon(project.icon).icon;

  return (
    <div className={styles["card-info-container"]}>
      <div className={styles["card-info-short"]}>
        <Icon size={16} stroke="currentColor" />
      </div>
    </div>
  );
};

export default TimelineCardInfoShort;
