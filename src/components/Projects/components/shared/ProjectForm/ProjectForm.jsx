import { useState } from "react";
import PropTypes from "prop-types";

import styles from "./ProjectForm.module.scss";
import Modal, { ModalForm, ModalHeading, ModalButtonGroup } from "@/lib/Modal";
import Button from "@/components/UI/Button";
import ProjectSymbolPicker from "./components/ProjectSymbolPicker/ProjectSymbolPicker";

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
  const [projectIcon, _setProjectIcon] = useState(defaultIcon);
  const [projectPalette, _setProjectPalette] = useState(defaultPalette);
  const [projectStartDate, _setProjectStartDate] = useState(defaultStartDate);
  const [projectEndDate, _setProjectEndDate] = useState(defaultEndDate);

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
            <div className={styles["symbol-input"]}>
              <ProjectSymbolPicker
                paletteId={projectPalette}
                iconId={projectIcon}
              />
            </div>
          </div>
          <div className={styles["input-group"]}>
            {/* <input type="date" value={projectStartDate} /> */}
            {/* <input type="date" value={projectEndDate} /> */}
            <input type="date" />
            <input type="date" />
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
