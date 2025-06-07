import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, orderBy, query, where } from "firebase/firestore";

import styles from "./ProjectList.module.scss";
import useFirebaseErrorNotification from "@/hooks/useFirebaseErrorNotification";
import { db } from "@/config/firebase";
import { itemConverter } from "@/utils/firebase";
import ProjectCard from "../ProjectCard/ProjectCard";
import AddProjectButton from "../AddProjectButton/AddProjectButton";

const ProjectList = () => {
  const [projects, loading, error] = useCollectionData(
    query(
      collection(db, "items"),
      where("type", "==", "project"),
      orderBy("createdAt")
    ).withConverter(itemConverter)
  );

  useFirebaseErrorNotification(error);

  // console.log(projects, error);

  if (projects == null || loading) return "Loading";

  return (
    <div className={styles["project-list"]}>
      {projects.map((item) => (
        <ProjectCard
          key={item.id}
          project={item}
          className={styles["project-list__item"]}
        />
      ))}
      <AddProjectButton className={styles["project-list__item"]} />
    </div>
  );
};

export default ProjectList;
