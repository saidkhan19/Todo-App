import { useState } from "react";

import styles from "./UpdateProjectButton.module.scss";
import useNotificationStore from "@/store/useNotificationStore";
import ProjectForm from "../shared/ProjectForm/ProjectForm";
import { updateItem } from "@/utils/firebase";

const UpdateProjectButton = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false);

  const notify = useNotificationStore((state) => state.notify);

  const handleCloseModal = () => setIsOpen(false);
  const handleOpenModal = () => setIsOpen(true);

  const handleUpdateProject = async (data) => {
    handleCloseModal();

    const update = {
      startDate: data.projectStartDate,
      endDate: data.projectEndDate,
      icon: data.projectIcon,
      name: data.projectName,
      palette: data.projectPalette,
    };
    await updateItem(project.id, update, notify);
  };

  const handleDeleteProject = async () => {
    handleCloseModal();

    const update = {
      deleted: true,
    };
    await updateItem(project.id, update, notify);
  };

  return (
    <>
      <button
        aria-expanded={isOpen}
        className={`btn ${styles["project-edit-button"]}`}
        title="Изменить"
        onClick={handleOpenModal}
      >
        <span className="sr-only">Изменить</span>
      </button>
      {isOpen && (
        <ProjectForm
          type="update"
          isOpen={isOpen}
          onCancel={handleCloseModal}
          onSave={handleUpdateProject}
          onDelete={handleDeleteProject}
          defaultName={project.name}
          defaultIcon={project.icon}
          defaultPalette={project.palette}
          defaultStartDate={project.startDate}
          defaultEndDate={project.endDate}
        />
      )}
    </>
  );
};

export default UpdateProjectButton;
