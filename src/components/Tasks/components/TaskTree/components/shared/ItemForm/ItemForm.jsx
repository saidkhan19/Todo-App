import { useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./ItemForm.module.scss";
import Modal, { ModalButtonGroup, ModalForm, ModalHeading } from "@/lib/Modal";
import { resetToMidnight } from "@/utils/date";
import Button from "@/components/UI/Button";
import CalendarPopup from "@/lib/CalendarPopup";

const ItemForm = ({
  title,
  isOpen,
  onCancel,
  onSave,
  defaultText = "",
  defaultStartDate = new Date(),
  defaultEndDate = new Date(),
}) => {
  const [text, setText] = useState(defaultText);
  const [textError, setTextError] = useState(false);
  const [startDate, setStartDate] = useState(() =>
    resetToMidnight(defaultStartDate)
  );
  const [endDate, setEndDate] = useState(() => resetToMidnight(defaultEndDate));
  const { t } = useTranslation(["common", "tasks"]);

  const handleSave = (e) => {
    e.preventDefault();

    if (!text) {
      setTextError(true);
      return;
    }

    onSave({
      text,
      startDate,
      endDate,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <ModalForm>
        <ModalHeading>{title}</ModalHeading>
        <div className={styles["form-content"]}>
          <div className={styles["input-group"]}>
            <input
              type="text"
              value={text}
              name="text"
              placeholder={t("tasks:itemFormTextPlaceholder")}
              required
              className={`${styles["name-input"]} ${
                textError ? styles["name-input--error"] : ""
              }`}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className={styles["input-group"]}>
            <CalendarPopup
              startDate={startDate}
              endDate={endDate}
              onChangeStartDate={setStartDate}
              onChangeEndDate={setEndDate}
            />
          </div>
        </div>

        <ModalButtonGroup>
          <Button size="medium" onClick={onCancel} type="button">
            {t("common:controls.cancel")}
          </Button>
          <Button
            variant="accent"
            size="medium"
            onClick={handleSave}
            type="submit"
          >
            {t("common:controls.save")}
          </Button>
        </ModalButtonGroup>
      </ModalForm>
    </Modal>
  );
};

export default ItemForm;
