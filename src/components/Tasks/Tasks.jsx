import { useSearchParams } from "react-router";

import styles from "./Tasks.module.scss";
import DefaultProjectProvider from "../DataProviders/DefaultProjectProvider";
import ProjectsAndTasksProvider from "../DataProviders/ProjectsAndTasksProvider";
import AddTaskForm from "./components/AddTaskForm/AddTaskForm";
import TaskTree from "./components/TaskTree/TaskTree";
import { DEFAULT_PROJECT_ID } from "@/consts/database";

const Tasks = () => {
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");
  const urlProject = searchParams.get("project");

  return (
    <ProjectsAndTasksProvider>
      <DefaultProjectProvider>
        <div className={`${styles["content-surface"]} ${styles["container"]}`}>
          <h1 className={styles["section-header"]}>Задачи</h1>
          <section>
            <h2 className="sr-only">Добавить задачу</h2>
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
      </DefaultProjectProvider>
    </ProjectsAndTasksProvider>
  );
};

export default Tasks;
