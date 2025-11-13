import { Link } from "react-router";
import { motion as Motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";

import styles from "./TasksForToday.module.scss";
import Container from "@/components/UI/Container";
import StatusMessage from "@/components/UI/StatusMessage";
import SpinnerBox from "@/components/UI/SpinnerBox";
import { transformFirebaseError } from "@/utils/notifications";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import { getTasksForToday, orderItemsByOrder } from "@/utils/dataTransforms";
import TaskCard from "../TaskCard/TaskCard";

const TasksForToday = () => {
  const { items, loading, error } = useProjectsAndTasksContext();
  const { t } = useTranslation(["common", "home"]);

  if (loading)
    return (
      <Container padding="70px 0">
        <SpinnerBox />
      </Container>
    );

  if (error)
    return (
      <Container width="90%" padding="24px 0">
        <StatusMessage
          title={t("common:status.error")}
          {...transformFirebaseError(error)}
        />
      </Container>
    );

  const tasksForToday = orderItemsByOrder(getTasksForToday(items));

  return (
    <div className={styles["task-list"]}>
      {tasksForToday.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
      {tasksForToday.length === 0 && (
        <StatusMessage type="info" message={t("home:noTasksToday")} />
      )}
      <Motion.div layout>
        <Link
          to="/tasks?action=add-task"
          title={t("common:controls.addTask")}
          className={styles["add-task-button"]}
        >
          <Plus size={22} stroke="currentColor" strokeWidth={1} />
          <span>{t("common:controls.add")}</span>
        </Link>
      </Motion.div>
    </div>
  );
};

export default TasksForToday;
