import styles from "./Projects.module.scss";
import ProjectList from "./components/ProjectList/ProjectList";
import Timeline from "@/components/Timeline";

const Projects = () => {
  return (
    <div className={`${styles["content-surface"]} ${styles["container"]}`}>
      <h1 className={styles["section-header"]}>Проекты</h1>
      <section className={styles["projects"]}>
        <ProjectList />
      </section>
      <section>
        <h2 className={styles["section-header"]}>График</h2>
        <div className={styles["timeline"]}>
          <Timeline />
        </div>
      </section>
    </div>
  );
};

export default Projects;
