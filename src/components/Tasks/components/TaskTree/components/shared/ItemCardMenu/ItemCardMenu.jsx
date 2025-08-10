import { EllipsisVertical } from "lucide-react";

import styles from "./ItemCardMenu.module.scss";
import Menu from "@/lib/Menu";
import Button from "@/components/UI/Button";

const MenuContent = ({
  type,
  openAddSubtaskModal,
  openUpdateTaskModal,
  onDeleteTask,
  closeMenu,
}) => {
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
      <Button onClick={handleAddSubtask} className={styles["menu-btn"]}>
        Добавить подзадачу
      </Button>

      {type === "task" && (
        <>
          <Button onClick={handleUpdateTask} className={styles["menu-btn"]}>
            Изменить задачу
          </Button>
          <Button
            variant="danger"
            onClick={onDeleteTask}
            className={styles["menu-btn"]}
          >
            Удалить задачу
          </Button>
        </>
      )}
    </div>
  );
};

const ItemCardMenu = ({
  type,
  openAddSubtaskModal,
  openUpdateTaskModal,
  onDeleteTask,
}) => {
  return (
    <Menu
      title="Меню"
      renderOpener={(props) => (
        <div
          {...props}
          tabIndex="0"
          title="Меню"
          className={styles["menu-trigger"]}
        >
          <EllipsisVertical size={16} stroke="currentColor" />
        </div>
      )}
      renderContent={(close) => (
        <MenuContent
          type={type}
          openAddSubtaskModal={openAddSubtaskModal}
          openUpdateTaskModal={openUpdateTaskModal}
          onDeleteTask={onDeleteTask}
          closeMenu={close}
        />
      )}
    />
  );
};

export default ItemCardMenu;
