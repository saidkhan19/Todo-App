import { useState } from "react";
import {
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  useFloating,
  shift,
  flip,
  offset,
  autoUpdate,
  FloatingPortal,
} from "@floating-ui/react";

import styles from "./Tooltip.module.scss";

const Tooltip = ({
  renderOpener,
  renderContent,
  disabled = false,
  openDelay = 500,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen && !disabled,
    placement: "top",
    onOpenChange: setIsOpen,
    middleware: [offset(15), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    enabled: !disabled,
    move: false,
    delay: {
      open: openDelay,
      close: 100,
    },
  });

  const focus = useFocus(context, { enabled: !disabled });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <>
      {renderOpener({
        ref: refs.setReference,
        ...getReferenceProps(),
      })}
      {isOpen && !disabled && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className={styles["tooltip-container"]}
          >
            <div className={styles["tooltip"]}>{renderContent()}</div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

export const TooltipContent = ({ children }) => {
  return <p className={styles["tooltip-content"]}>{children}</p>;
};

export default Tooltip;
