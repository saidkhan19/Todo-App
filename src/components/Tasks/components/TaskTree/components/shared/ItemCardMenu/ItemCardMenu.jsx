import { useTranslation } from "react-i18next";
import { EllipsisVertical } from "lucide-react";

import styles from "./ItemCardMenu.module.scss";
import Menu from "@/lib/Menu";
import Button from "@/components/UI/Button";

const MenuContent = ({
  type,
  openAddSubtaskModal,
  displayAddSubtaskModal,
  openUpdateTaskModal,
  onDeleteTask,
  closeMenu,
}) => {
  const { t } = useTranslation("tasks");

  const handleAddSubtask = () => {
    closeMenu();
    openAddSubtaskModal();
  };

  const handleUpdateTask = () => {
    closeMenu();
    openUpdateTaskModal();
  };

  return (
    <div className={styles["menu-content"]}>
      {displayAddSubtaskModal && (
        <Button onClick={handleAddSubtask} className={styles["menu-btn"]}>
          {t("controls.addSubtask")}
        </Button>
      )}

      {type === "task" && (
        <>
          <Button onClick={handleUpdateTask} className={styles["menu-btn"]}>
            {t("controls.editTask")}
          </Button>
          <Button
            variant="danger"
            onClick={onDeleteTask}
            className={styles["menu-btn"]}
          >
            {t("controls.deleteTask")}
          </Button>
        </>
      )}
    </div>
  );
};

const ItemCardMenu = ({
  type,
  openAddSubtaskModal,
  displayAddSubtaskModal = true,
  openUpdateTaskModal,
  onDeleteTask,
}) => {
  const { t } = useTranslation("tasks");

  return (
    <Menu
      title={t("itemMenuTitle")}
      renderOpener={(props) => (
        <div
          {...props}
          tabIndex="0"
          title={t("itemMenuTitle")}
          className={styles["menu-trigger"]}
        >
          <EllipsisVertical size={16} stroke="currentColor" />
        </div>
      )}
      renderContent={(close) => (
        <MenuContent
          type={type}
          openAddSubtaskModal={openAddSubtaskModal}
          displayAddSubtaskModal={displayAddSubtaskModal}
          openUpdateTaskModal={openUpdateTaskModal}
          onDeleteTask={onDeleteTask}
          closeMenu={close}
        />
      )}
    />
  );
};

export default ItemCardMenu;
