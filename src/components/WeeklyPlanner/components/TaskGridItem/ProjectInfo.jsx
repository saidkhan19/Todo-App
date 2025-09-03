import { useEffect, useRef } from "react";
import { useMergeRefs } from "@floating-ui/react";

import ProjectSymbol from "@/components/shared/ProjectSymbol";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import { useDefaultProjectContext } from "@/components/DataProviders/DefaultProjectProvider";
import { getRootProject } from "@/utils/dataTransforms";
import { usePlannerStore } from "../../store";

const ProjectInfo = ({ item, ...props }) => {
  const { items } = useProjectsAndTasksContext();
  const { defaultProject } = useDefaultProjectContext();

  const openerRef = useRef();
  const setFocusedItem = usePlannerStore((state) => state.setFocusedItem);
  const isFocused = usePlannerStore(
    (state) => state.focusedItem?.id === item.id
  );

  // Merge our ref with floating UI's internal ref
  const ref = useMergeRefs([openerRef, props.ref]);

  useEffect(() => {
    if (isFocused) {
      // Focus with delay to allow animation to playout and throttle
      const timeoutId = setTimeout(() => openerRef.current?.focus(), 400);
      return () => clearTimeout(timeoutId);
    }
  }, [isFocused]);

  if (!items || !defaultProject) return null;

  const project = getRootProject(item, items, defaultProject);

  // Merge our focus handling with floating UI's onFocus
  const handleFocus = (e) => {
    setFocusedItem(item);
    props.onFocus?.(e);
  };

  return (
    <div {...props} tabIndex={0} ref={ref} onFocus={handleFocus}>
      <span className="sr-only">Проект: {project.name}</span>
      <ProjectSymbol
        paletteId={project.palette}
        iconId={project.icon}
        size="100%"
        checked={item.completed}
      />
    </div>
  );
};

export default ProjectInfo;
