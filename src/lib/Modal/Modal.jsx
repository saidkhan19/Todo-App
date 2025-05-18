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
import PropTypes from "prop-types";

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

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export const ModalHeading = ({ children }) => {
  return <h2 className={styles["modal__heading"]}>{children}</h2>;
};

ModalHeading.propTypes = {
  children: PropTypes.node,
};

export const ModalText = ({ children }) => {
  return <p className={styles["modal__text"]}>{children}</p>;
};

ModalText.propTypes = {
  children: PropTypes.node,
};

export const ModalButtonGroup = ({ children }) => {
  return <div className={styles["modal__button-group"]}>{children}</div>;
};

ModalButtonGroup.propTypes = {
  children: PropTypes.node,
};

export default Modal;
