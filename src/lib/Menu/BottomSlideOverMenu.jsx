import { useId, useState } from "react";
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useInteractions,
} from "@floating-ui/react";
import { X } from "lucide-react";

import styles from "./Menu.module.scss";
import Button from "@/components/UI/Button";

const BottomSlideOverMenu = ({ title, renderOpener, renderContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });
  const headerId = useId();

  const click = useClick(context);
  const focus = useFocus(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    focus,
    dismiss,
  ]);

  const handleCloseMenu = () => setIsOpen(false);

  return (
    <>
      {renderOpener({ ref: refs.setReference, ...getReferenceProps() })}
      {isOpen && (
        <FloatingPortal>
          <FloatingOverlay className={styles["overlay"]}>
            <FloatingFocusManager context={context}>
              <div
                ref={refs.setFloating}
                {...getFloatingProps()}
                className={`${styles["menu"]} ${styles["slideover-menu"]}`}
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
          </FloatingOverlay>
        </FloatingPortal>
      )}
    </>
  );
};

export default BottomSlideOverMenu;
