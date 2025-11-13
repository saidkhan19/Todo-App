import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";

import styles from "./AddProjectButton.module.scss";
import ProjectForm from "../shared/ProjectForm/ProjectForm";
import { useSaveItem } from "@/hooks/queries";

const AddProjectButton = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("common");

  const handleCloseModal = () => setIsOpen(false);
  const handleOpenModal = () => setIsOpen(true);

  const saveItem = useSaveItem();

  const handleAddNewProject = async (data) => {
    handleCloseModal();

    await saveItem({
      type: "project",
      level: 0,
      startDate: data.projectStartDate,
      endDate: data.projectEndDate,
      icon: data.projectIcon,
      name: data.projectName,
      palette: data.projectPalette,
    });
  };

  return (
    <>
      <div className={`${className} ${styles["button-container"]}`}>
        <button
          aria-expanded={isOpen}
          className={`btn ${styles["add-project-button"]}`}
          title={t("controls.addProject")}
          onClick={handleOpenModal}
        >
          <Plus size={22} stroke="currentColor" strokeWidth={1} />
          <span>{t("controls.add")}</span>
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
