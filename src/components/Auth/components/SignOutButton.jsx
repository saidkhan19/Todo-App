import { useContext, useState } from "react";

import Modal, { ModalButtonGroup, ModalHeading } from "/src/lib/Modal";
import styles from "../Auth.module.scss";
import { AuthContext } from "../store";
import { ModalText } from "../../../lib/Modal/Modal";

const SignOutButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, handleSignOut } = useContext(AuthContext);

  const handleCloseModal = () => setIsOpen(false);
  const handleOpenModal = () => setIsOpen(true);

  const handleLogout = () => {
    handleSignOut();
    handleCloseModal();
  };

  return (
    <>
      <button
        className={`btn ${styles["btn-secondary"]}`}
        disabled={isLoading}
        onClick={handleOpenModal}
      >
        Выйти из временного аккаунта
      </button>
      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalHeading>Вы уверены?</ModalHeading>
        <ModalText>Все ваши данные будут утеряны!</ModalText>
        <ModalButtonGroup>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={handleCloseModal}>Cancel</button>
        </ModalButtonGroup>
      </Modal>
    </>
  );
};

export default SignOutButton;
