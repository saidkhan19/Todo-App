import { useTranslation } from "react-i18next";

import styles from "./Projects.module.scss";
import ProjectList from "./components/ProjectList/ProjectList";
import Timeline from "@/components/Timeline";

const Projects = () => {
  const { t } = useTranslation("projects");

  return (
    <div className={`${styles["content-surface"]} ${styles["container"]}`}>
      <h1 className={styles["section-header"]}>{t("projectsTitle")}</h1>
      <section className={styles["projects"]}>
        <ProjectList />
      </section>
      <section>
        <h2 className={styles["section-header"]}>{t("timelineTitle")}</h2>
        <div className={styles["timeline"]}>
          <Timeline />
        </div>
      </section>
    </div>
  );
};

export default Projects;
