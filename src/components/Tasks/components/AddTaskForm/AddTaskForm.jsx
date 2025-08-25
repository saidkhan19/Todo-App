import { useState } from "react";

import styles from "./AddTaskForm.module.scss";
import Button from "@/components/UI/Button";
import CalendarPopup from "@/lib/CalendarPopup";
import { resetToMidnight } from "@/utils/date";
import useNotificationStore from "@/store/useNotificationStore";
import { saveItem } from "@/utils/firebase";
import ProjectSelect from "./ProjectSelect/ProjectSelect";
import { DEFAULT_PROJECT_ID } from "@/consts/database";

const AddTaskForm = () => {
  const [text, setText] = useState("");
  const [project, setProject] = useState(DEFAULT_PROJECT_ID);
  const [startDate, setStartDate] = useState(() => resetToMidnight(new Date()));
  const [endDate, setEndDate] = useState(() => resetToMidnight(new Date()));

  const [isLoading, setIsLoading] = useState(false);

  const notify = useNotificationStore((state) => state.notify);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!text) return;

    setIsLoading(true);

    await saveItem(
      {
        type: "task",
        level: project === DEFAULT_PROJECT_ID ? 0 : 1,
        text,
        parentId: project,
        startDate,
        endDate,
      },
      notify
    );

    setText("");
    setIsLoading(false);
  };

  return (
    <form className={styles["form"]}>
      <div className={styles["input-group"]}>
        <div className={styles["input-group__item"]}>
          <label htmlFor="text" className="sr-only">
            Текст задачи
          </label>
          <input
            name="text"
            id="text"
            placeholder="Текст"
            required
            className={styles["text-input"]}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className={styles["input-group__item"]}>
          <ProjectSelect projectId={project} onChangeProject={setProject} />
        </div>
        <div className={styles["input-group__item"]}>
          <CalendarPopup
            startDate={startDate}
            endDate={endDate}
            onChangeStartDate={setStartDate}
            onChangeEndDate={setEndDate}
          />
        </div>
      </div>
      <Button
        variant="accent"
        type="submit"
        className={styles["add-btn"]}
        disabled={isLoading}
        onClick={handleSave}
      >
        Добавить
      </Button>
    </form>
  );
};

export default AddTaskForm;
