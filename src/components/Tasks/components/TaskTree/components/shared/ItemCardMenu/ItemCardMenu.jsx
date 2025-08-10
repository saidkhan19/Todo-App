import { EllipsisVertical } from "lucide-react";

import styles from "./ItemCardMenu.module.scss";
import Menu from "@/lib/Menu";
import Button from "@/components/UI/Button";

const MenuContent = ({ type, openAddSubtaskModal, closeMenu }) => {
  const handleAddSubtask = () => {
    closeMenu();
    openAddSubtaskModal();
  };

  return type === "project" ? (
    <div className={styles["menu-content"]}>
      <Button onClick={handleAddSubtask} className={styles["menu-btn"]}>
        Добавить подзадачу
      </Button>
    </div>
  ) : (
    <div className={styles["menu-content"]}>
      <Button onClick={handleAddSubtask} className={styles["menu-btn"]}>
        Добавить подзадачу
      </Button>
    </div>
  );
};

const ItemCardMenu = ({ type, openAddSubtaskModal }) => {
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
          closeMenu={close}
        />
      )}
    />
  );
};

export default ItemCardMenu;
