import { useEffect, useRef } from "react";
import { useMergeRefs } from "@floating-ui/react";

import ProjectSymbol from "@/components/shared/ProjectSymbol";
import { createRootProjectSelector, usePlannerStore } from "../../store";

const ProjectInfo = ({ item, ...props }) => {
  const openerRef = useRef();
  const project = usePlannerStore(createRootProjectSelector(item));
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

  // Merge our focus handling with floating UI's onFocus
  const handleFocus = (e) => {
    setFocusedItem(item);
    props.onFocus?.(e);
  };

  return (
    <div {...props} tabIndex={0} ref={ref} onFocus={handleFocus}>
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
