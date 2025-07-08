import { useState } from "react";
import { Trash2 } from "lucide-react";

import styles from "./ProjectForm.module.scss";
import Modal, { ModalForm, ModalHeading, ModalButtonGroup } from "@/lib/Modal";
import Button from "@/components/UI/Button";
import CalendarPopup from "@/lib/CalendarPopup";
import { resetToMidnight } from "@/utils/date";
import ProjectSymbolPicker from "./components/ProjectSymbolPicker/ProjectSymbolPicker";

const ProjectForm = ({
  type = "create", // 'create' | 'update'
  isOpen,
  onCancel,
  onSave,
  onDelete,
  defaultName = "",
  defaultIcon = "folder",
  defaultPalette = "indigo",
  defaultStartDate = new Date(),
  defaultEndDate = new Date(),
}) => {
  const [projectName, setProjectName] = useState(defaultName);
  const [projectNameError, setProjectNameError] = useState(false);
  const [projectIcon, setProjectIcon] = useState(defaultIcon);
  const [projectPalette, setProjectPalette] = useState(defaultPalette);
  const [projectStartDate, setProjectStartDate] = useState(() =>
    resetToMidnight(defaultStartDate)
  );
  const [projectEndDate, setProjectEndDate] = useState(() =>
    resetToMidnight(defaultEndDate)
  );

  const handleSave = (e) => {
    e.preventDefault();

    if (!projectName) {
      setProjectNameError(true);
      return;
    }

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
        <ModalHeading>
          {type === "create" ? "Добавить проект" : "Изменить проект"}
        </ModalHeading>
        <div className={styles["form-content"]}>
          <div className={styles["input-group"]}>
            <input
              type="text"
              value={projectName}
              name="name"
              placeholder="Название"
              required
              className={`${styles["name-input"]} ${
                projectNameError ? styles["name-input--error"] : ""
              }`}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <div className={styles["symbol-input"]}>
              <ProjectSymbolPicker
                paletteId={projectPalette}
                iconId={projectIcon}
                setProjectPalette={setProjectPalette}
                setProjectIcon={setProjectIcon}
              />
            </div>
          </div>
          <div className={styles["input-group"]}>
            <CalendarPopup
              startDate={projectStartDate}
              endDate={projectEndDate}
              onChangeStartDate={setProjectStartDate}
              onChangeEndDate={setProjectEndDate}
            />
          </div>

          {type === "update" && (
            <button
              className={`btn ${styles["btn-delete"]}`}
              type="button"
              onClick={onDelete}
            >
              <Trash2 size={18} stroke="currentColor" />
              <span>Удалить</span>
            </button>
          )}
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

export default ProjectForm;
