import { useTranslation } from "react-i18next";

import styles from "./Home.module.scss";
import WeeklyPlanner from "../WeeklyPlanner";
import TasksForToday from "./components/TasksForToday/TasksForToday";
import WeekStats from "./components/WeekStats/WeekStats";

const Home = () => {
  const { t } = useTranslation("home");

  return (
    <div className={`${styles["content-surface"]} ${styles["container"]}`}>
      <section className={styles["weekly-view"]}>
        <h2 className="sr-only">{t("weeklyViewTitle")}</h2>
        <WeeklyPlanner />
        <WeekStats />
      </section>
      <hr className={`hr ${styles["home__hr"]}`} />
      <section className={styles["tasks-view"]}>
        <h1 className={styles["section-header"]}>{t("tasksViewTitle")}</h1>
        <TasksForToday />
      </section>
    </div>
  );
};

export default Home;
