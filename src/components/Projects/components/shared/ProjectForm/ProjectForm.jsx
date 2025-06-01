import { useState } from "react";
import PropTypes from "prop-types";

import Button from "@/components/UI/Button";
import Modal, { ModalForm, ModalHeading, ModalButtonGroup } from "@/lib/Modal";
import styles from "./ProjectForm.module.scss";

const ProjectForm = ({
  isOpen,
  onCancel,
  onSave,
  defaultName = "",
  defaultIcon = "dumbbell",
  defaultPalette = "purple",
  defaultStartDate = "",
  defaultEndDate = "",
}) => {
  const [projectName, setProjectName] = useState(defaultName);
  const [projectIcon, setProjectIcon] = useState(defaultIcon);
  const [projectPalette, setProjectPalette] = useState(defaultPalette);
  const [projectStartDate, setProjectStartDate] = useState(defaultStartDate);
  const [projectEndDate, setProjectEndDate] = useState(defaultEndDate);

  const handleSave = (e) => {
    e.preventDefault();
    onSave({
      projectName,
      projectIcon,
      projectPalette,
      projectStartDate,
      projectEndDate,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <ModalForm>
        <ModalHeading>Добавить проект</ModalHeading>
        <div className={styles["form-content"]}>
          <div className={styles["input-group"]}>
            <input
              type="text"
              placeholder="Название"
              className={styles["name-input"]}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className={styles["input-group"]}>
            <input type="date" value={projectStartDate} />
            <input type="date" value={projectEndDate} />
          </div>
        </div>
        <ModalButtonGroup>
          <Button size="medium" onClick={onCancel} type="button">
            Отмена
          </Button>
          <Button
            variant="accent"
            size="medium"
            onClick={handleSave}
            type="submit"
          >
            Сохранить
          </Button>
        </ModalButtonGroup>
      </ModalForm>
    </Modal>
  );
};

ProjectForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  defaultName: PropTypes.string,
  defaultIcon: PropTypes.string,
  defaultPalette: PropTypes.string,
  defaultStartDate: PropTypes.string,
  defaultEndDate: PropTypes.string,
};

export default ProjectForm;
