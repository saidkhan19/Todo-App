import AddTaskForm from "./components/AddTaskForm/AddTaskForm";
import TaskTree from "./components/TaskTree/TaskTree";
import styles from "./Tasks.module.scss";

const Tasks = () => {
  return (
    <div className={`${styles["content-surface"]} ${styles["container"]}`}>
      <h1 className={styles["section-header"]}>Задачи</h1>
      <section>
        <h2 className="sr-only">Добавить задачу</h2>
        <AddTaskForm />
      </section>
      <hr className="hr" />
      <section>
        <TaskTree />
      </section>
    </div>
  );
};

export default Tasks;
