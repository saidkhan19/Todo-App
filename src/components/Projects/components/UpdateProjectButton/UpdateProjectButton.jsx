import { useState } from "react";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

import styles from "./UpdateProjectButton.module.scss";
import useNotificationStore from "@/store/useNotificationStore";
import { transformFirebaseError } from "@/utils/notifications";
import { db } from "@/config/firebase";
import ProjectForm from "../shared/ProjectForm/ProjectForm";

const UpdateProjectButton = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false);

  const notify = useNotificationStore((state) => state.notify);

  const handleCloseModal = () => setIsOpen(false);
  const handleOpenModal = () => setIsOpen(true);

  const updateDocument = async (data) => {
    try {
      const docRef = doc(db, "items", project.id);
      await updateDoc(docRef, data);
      return docRef;
    } catch (error) {
      if (error instanceof FirebaseError) notify(transformFirebaseError(error));
      else throw error;
    }
  };

  const handleUpdateProject = async (data) => {
    const updates = {
      updatedAt: serverTimestamp(),
      startDate: data.projectStartDate,
      endDate: data.projectEndDate,
      icon: data.projectIcon,
      name: data.projectName,
      palette: data.projectPalette,
    };

    handleCloseModal();
    await updateDocument(updates);
  };

  const handleDeleteProject = async () => {
    const update = {
      updatedAt: serverTimestamp(),
      deleted: true,
    };

    handleCloseModal();
    await updateDocument(update);
  };

  return (
    <>
      <button
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
