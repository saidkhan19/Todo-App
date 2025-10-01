import { memo } from "react";

import styles from "./ProjectItem.module.scss";
import { getColorPalette, getIcon } from "@/utils/projects";
import ItemCardProgress from "../shared/ItemCardProgress/ItemCardProgress";
import ItemCardDateForm from "../shared/ItemCardDateForm/ItemCardDateForm";
import ItemCardMenu from "../shared/ItemCardMenu/ItemCardMenu";
import { getProgressInformation } from "@/utils/dataTransforms";
import { useModalState } from "../shared/hooks";
import AddSubtaskModal from "../shared/AddSubtaskModal/AddSubtaskModal";
import useWindowSize from "@/hooks/useWindowSize";

const ProjectItem = memo(({ item, childItems }) => {
  const Icon = getIcon(item.icon).icon;
  const projectColor = getColorPalette(item.palette).primary;

  const hasChildren = childItems.length > 0;
  const { overall, completed } = getProgressInformation(childItems);

  const addSubtaskModalState = useModalState();

  const windowSize = useWindowSize();

  return (
    <div className={styles["project-item"]}>
      <div className={`${styles["col-info"]} flex-center`}>
        <p className={styles["project-info"]}>
          <Icon size={22} stroke={projectColor} />
          <span className={styles["project-info__title"]}>{item.name}</span>
        </p>
      </div>
      <div className={`${styles["col-progress"]} flex-center`}>
        {hasChildren && windowSize !== "phone" && (
          <ItemCardProgress completed={completed} overall={overall} />
        )}
      </div>
      <div className={`${styles["col-date-form"]} flex-center`}>
        {windowSize === "desktop" && (
          <ItemCardDateForm
            itemId={item.id}
            defaultStartDate={item.startDate}
            defaultEndDate={item.endDate}
          />
        )}
      </div>
      <div className={`${styles["col-menu"]} flex-center`}>
        <ItemCardMenu
          type="project"
          openAddSubtaskModal={addSubtaskModalState.open}
        />
      </div>

      <AddSubtaskModal modalState={addSubtaskModalState} item={item} />
    </div>
  );
});

export default ProjectItem;
