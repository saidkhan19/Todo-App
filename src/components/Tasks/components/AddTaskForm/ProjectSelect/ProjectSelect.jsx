import { useAuthState } from "react-firebase-hooks/auth";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { collection, doc, orderBy, query, where } from "firebase/firestore";
import { itemConverter } from "@/utils/firebase";

import styles from "./ProjectSelect.module.scss";
import Menu from "@/lib/Menu";
import SelectMenu from "@/lib/SelectMenu";
import { auth, db } from "@/config/firebase";
import useFirebaseErrorNotification from "@/hooks/useFirebaseErrorNotification";
import SpinnerBox from "@/components/UI/SpinnerBox";
import { getColorPalette } from "@/utils/projects";

const ProjectSelect = ({ projectId, onChangeProject }) => {
  const [user] = useAuthState(auth);
  const [projects, loadingProjects, errorProjects] = useCollectionData(
    query(
      collection(db, "items"),
      where("userId", "==", user.uid),
      where("type", "==", "project"),
      where("deleted", "==", false),
      orderBy("createdAt")
    ).withConverter(itemConverter)
  );

  const [defaultProject, loadingDefaultProject, errorDefaultProject] =
    useDocumentData(doc(db, "items", "TASKS").withConverter(itemConverter));

  useFirebaseErrorNotification(errorProjects);
  useFirebaseErrorNotification(errorDefaultProject);

  if (
    projects == null ||
    defaultProject == null ||
    loadingProjects ||
    loadingDefaultProject
  )
    return (
      <div className={styles["project-select-box__spinner"]}>
        <SpinnerBox size="sm" />
      </div>
    );

  const allProjects = [defaultProject, ...projects];

  const selectedProject = allProjects.find((item) => item.id === projectId);
  const palette = getColorPalette(selectedProject.palette);

  return (
    <Menu
      title="Выберите проект"
      renderOpener={(props) => (
        <div
          {...props}
          role="combobox"
          tabIndex="0"
          title="Выберите проект"
          className={`flex-center ${styles["project-select-box"]}`}
          style={{
            backgroundColor: palette.soft,
            color: palette.primary,
          }}
        >
          <span className={styles["project-name"]}>{selectedProject.name}</span>
        </div>
      )}
      renderContent={() => (
        <SelectMenu
          options={allProjects.map((item) => ({
            value: item.id,
            name: item.name,
          }))}
          selected={projectId}
          onChange={onChangeProject}
        />
      )}
    />
  );
};

export default ProjectSelect;
