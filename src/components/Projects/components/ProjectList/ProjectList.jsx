import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, orderBy, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import styles from "./ProjectList.module.scss";
import useFirebaseErrorNotification from "@/hooks/useFirebaseErrorNotification";
import { auth, db } from "@/config/firebase";
import { itemConverter } from "@/utils/firebase";
import ProjectCard from "../ProjectCard/ProjectCard";
import AddProjectButton from "../AddProjectButton/AddProjectButton";
import SpinnerBox from "@/components/UI/SpinnerBox";

const ProjectList = () => {
  const [user] = useAuthState(auth);
  const [projects, loading, error] = useCollectionData(
    query(
      collection(db, "items"),
      where("type", "==", "project"),
      where("userId", "==", user.uid),
      orderBy("createdAt")
    ).withConverter(itemConverter)
  );

  useFirebaseErrorNotification(error);

  if (projects == null || loading) return <SpinnerBox height="md" />;

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
