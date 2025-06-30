import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { Plus } from "lucide-react";

import styles from "./AddProjectButton.module.scss";
import { db } from "@/config/firebase";
import { transformFirebaseError } from "@/utils/notifications";
import useNotificationStore from "@/store/useNotificationStore";
import ProjectForm from "../shared/ProjectForm/ProjectForm";

const AddProjectButton = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const notify = useNotificationStore((state) => state.notify);

  const handleCloseModal = () => setIsOpen(false);
  const handleOpenModal = () => setIsOpen(true);

  const addDocument = async (data) => {
    try {
      const docRef = await addDoc(collection(db, "items"), data);
      return docRef;
    } catch (error) {
      console.error(error);
      if (error instanceof FirebaseError) notify(transformFirebaseError(error));
      else throw error;
    }
  };

  const handleAddNewProject = (data) => {
    const project = {
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      type: "project",
      startDate: data.projectStartDate,
      endDate: data.projectEndDate,
      icon: data.projectIcon,
      name: data.projectName,
      palette: data.projectPalette,
    };
    console.log(data);
    addDocument(project);
    handleCloseModal();
  };

  return (
    <>
      <div className={`${className} ${styles["button-container"]}`}>
        <button
          aria-expanded={isOpen}
          className={`btn ${styles["add-project-button"]}`}
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
