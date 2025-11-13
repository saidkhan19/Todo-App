import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";

import styles from "./Tasks.module.scss";
import AddTaskForm from "./components/AddTaskForm/AddTaskForm";
import TaskTree from "./components/TaskTree/TaskTree";
import { DEFAULT_PROJECT_ID } from "@/consts/database";

const Tasks = () => {
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");
  const urlProject = searchParams.get("project");

  const { t } = useTranslation("tasks");

  return (
    <div className={`${styles["content-surface"]} ${styles["container"]}`}>
      <h1 className={styles["section-header"]}>{t("tasksTitle")}</h1>
      <section>
        <h2 className="sr-only">{t("addTaskFormTitle")}</h2>
        <AddTaskForm
          hasFocus={action === "add-task"}
          defaultProject={urlProject || DEFAULT_PROJECT_ID}
        />
      </section>
      <hr className="hr" />
      <section>
        <TaskTree />
      </section>
    </div>
  );
};

export default Tasks;
