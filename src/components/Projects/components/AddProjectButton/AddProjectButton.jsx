import { useState } from "react";
import { Plus } from "lucide-react";

import styles from "./AddProjectButton.module.scss";
import useNotificationStore from "@/store/useNotificationStore";
import ProjectForm from "../shared/ProjectForm/ProjectForm";
import { saveItem } from "@/utils/firebase";

const AddProjectButton = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const notify = useNotificationStore((state) => state.notify);

  const handleCloseModal = () => setIsOpen(false);
  const handleOpenModal = () => setIsOpen(true);

  const handleAddNewProject = async (data) => {
    handleCloseModal();

    await saveItem(
      {
        type: "project",
        startDate: data.projectStartDate,
        endDate: data.projectEndDate,
        icon: data.projectIcon,
        name: data.projectName,
        palette: data.projectPalette,
      },
      notify
    );
  };

  return (
    <>
      <div className={`${className} ${styles["button-container"]}`}>
        <button
          aria-expanded={isOpen}
          className={`btn ${styles["add-project-button"]}`}
          title="Добавить"
          onClick={handleOpenModal}
        >
          <Plus size={22} stroke="currentColor" strokeWidth={1} />
          <span>Добавить</span>
        </button>
      </div>
      {isOpen && (
        <ProjectForm
          isOpen={isOpen}
          onCancel={handleCloseModal}
          onSave={handleAddNewProject}
        />
      )}
    </>
  );
};

export default AddProjectButton;
