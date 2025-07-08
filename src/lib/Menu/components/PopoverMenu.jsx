import { useId, useState } from "react";
import {
  flip,
  FloatingFocusManager,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { X } from "lucide-react";

import styles from "../Menu.module.scss";
import Button from "@/components/UI/Button";

const PopoverMenu = ({ title, renderOpener, renderContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    placement: "bottom-end",
    strategy: "fixed",
    onOpenChange: setIsOpen,
    middleware: [offset(4), flip(), shift()],
  });
  const headerId = useId();

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  const handleCloseMenu = () => setIsOpen(false);

  return (
    <>
      {renderOpener({ ref: refs.setReference, ...getReferenceProps() })}
      {isOpen && (
        <FloatingFocusManager context={context}>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className={`${styles["menu"]} ${styles["popover-menu"]}`}
            aria-labelledby={headerId}
          >
            <div className={styles["menu__top-panel"]}>
              <h2 id={headerId} className={styles["menu__title"]}>
                {title}
              </h2>
              <Button
                variant="plain"
                type="button"
                title="Закрыть"
                className={styles["menu__close-button"]}
                onClick={handleCloseMenu}
              >
                <span className="sr-only">Закрыть</span>
                <X size={22} stroke="currentColor" strokeWidth={1} />
              </Button>
            </div>
            <div className={styles["menu__content"]}>{renderContent()}</div>
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
};

export default PopoverMenu;
