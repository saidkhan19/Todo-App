import clsx from "clsx/lite";

import styles from "./ProjectSelect.module.scss";
import Menu from "@/lib/Menu";
import SelectMenu from "@/lib/SelectMenu";
import SpinnerBox from "@/components/UI/SpinnerBox";
import { getColorPalette } from "@/utils/projects";
import { useDefaultProjectContext } from "@/components/DataProviders/DefaultProjectProvider";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import { getProjects } from "@/utils/dataTransforms";

const ProjectSelect = ({ projectId, onChangeProject }) => {
  const { items, loading, error } = useProjectsAndTasksContext();
  const {
    defaultProject,
    loading: loadingDefaultProject,
    error: errorDefaultProject,
  } = useDefaultProjectContext();

  const projects = getProjects(items);

  if (loading || loadingDefaultProject)
    return (
      <div className={styles["project-select-box__spinner"]}>
        <SpinnerBox size="sm" />
      </div>
    );

  if (error || errorDefaultProject)
    return (
      <p
        className={clsx(
          "flex-center",
          styles["project-select-box"],
          styles["project-select-box__error"]
        )}
      >
        Ошибка
      </p>
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
          className={clsx("flex-center", styles["project-select-box"])}
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
