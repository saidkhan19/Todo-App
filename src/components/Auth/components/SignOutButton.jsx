import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import Modal, { ModalButtonGroup, ModalHeading, ModalText } from "@/lib/Modal";
import styles from "../Auth.module.scss";
import { AuthContext } from "../context";
import Button from "../../UI/Button";

const SignOutButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, handleSignOut } = useContext(AuthContext);
  const { t } = useTranslation(["common", "auth"]);

  const handleCloseModal = () => setIsOpen(false);
  const handleOpenModal = () => setIsOpen(true);

  const handleLogout = () => {
    handleSignOut();
    handleCloseModal();
  };

  return (
    <>
      <button
        aria-expanded={isOpen}
        className={`btn ${styles["btn-secondary"]}`}
        disabled={isLoading}
        onClick={handleOpenModal}
      >
        {t("auth:signOutAnonymous")}
      </button>
      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalHeading>{t("auth:areYouSure")}</ModalHeading>
        <ModalText>{t("auth:anonymousWarning")}</ModalText>
        <ModalButtonGroup>
          <Button size="medium" onClick={handleCloseModal}>
            {t("common:controls.cancel")}
          </Button>
          <Button variant="danger" size="medium" onClick={handleLogout}>
            {t("common:controls.signOut")}
          </Button>
        </ModalButtonGroup>
      </Modal>
    </>
  );
};

export default SignOutButton;
