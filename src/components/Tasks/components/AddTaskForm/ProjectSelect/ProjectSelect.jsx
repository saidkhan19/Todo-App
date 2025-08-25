import styles from "./ProjectSelect.module.scss";
import Menu from "@/lib/Menu";
import SelectMenu from "@/lib/SelectMenu";
import useFirebaseErrorNotification from "@/hooks/useFirebaseErrorNotification";
import SpinnerBox from "@/components/UI/SpinnerBox";
import { getColorPalette } from "@/utils/projects";
import { useDefaultProject, useProjects } from "@/hooks/queries";

const ProjectSelect = ({ projectId, onChangeProject }) => {
  const [projects, loadingProjects, errorProjects] = useProjects();
  const [defaultProject, loadingDefaultProject, errorDefaultProject] =
    useDefaultProject();

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
