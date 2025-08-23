import WeeklyPlanner from "../WeeklyPlanner";
import styles from "./Home.module.scss";

const Home = () => {
  return (
    <div className={`${styles["content-surface"]} ${styles["container"]}`}>
      <section className={styles["weekly-view"]}>
        <h2 className="sr-only">Задачи на эту неделю</h2>
        <WeeklyPlanner />
      </section>
      <hr className={`hr ${styles["home__hr"]}`} />
      <section className={styles["tasks-view"]}>
        <h1 className={styles["section-header"]}>Задачи на сегодня</h1>
      </section>
    </div>
  );
};

export default Home;
