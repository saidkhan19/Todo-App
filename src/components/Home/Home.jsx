import WeeklyPlanner from "../WeeklyPlanner";
import styles from "./Home.module.scss";

const Home = () => {
  return (
    <div className={`${styles["content-surface"]} ${styles["container"]}`}>
      <section className={styles["weekly-view"]}>
        <WeeklyPlanner />
      </section>
      <section className={styles["tasks-view"]}>
        <h2 className={styles["section-header"]}>Задачи на сегодня</h2>
      </section>
    </div>
  );
};

export default Home;
