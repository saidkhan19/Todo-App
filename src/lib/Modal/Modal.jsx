import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";

import styles from "./Modal.module.scss";

const Modal = ({ isOpen, onClose, children }) => {
  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      if (!open) onClose();
    },
  });

  const dismiss = useDismiss(context, {
    outsidePress: true,
    escapeKey: true,
  });

  const role = useRole(context, { role: "dialog" });

  const { getFloatingProps } = useInteractions([dismiss, role]);

  if (!isOpen) return null;

  return (
    <FloatingPortal id="modal-portal">
      <FloatingOverlay
        lockScroll
        className={`flex-center ${styles["overlay"]}`}
      >
        <FloatingFocusManager context={context}>
          <div
            ref={refs.setFloating}
            {...getFloatingProps()}
            className={`page-background ${styles["modal"]}`}
          >
            {children}
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
};

export const ModalForm = ({ children, className, ...props }) => {
  return (
    <form className={`${styles["modal__form"]} ${className}`} {...props}>
      {children}
    </form>
  );
};

export const ModalHeading = ({ children }) => {
  return <h2 className={styles["modal__heading"]}>{children}</h2>;
};

export const ModalText = ({ children }) => {
  return <p className={styles["modal__text"]}>{children}</p>;
};

export const ModalButtonGroup = ({ children }) => {
  return (
    <div className={styles["modal__button-group-wrapper"]}>
      <div className={styles["modal__button-group"]}>{children}</div>
    </div>
  );
};

export default Modal;
