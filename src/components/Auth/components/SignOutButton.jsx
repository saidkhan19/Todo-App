import { useContext, useState } from "react";

import Modal, {
  ModalButtonGroup,
  ModalHeading,
  ModalText,
} from "/src/lib/Modal";
import styles from "../Auth.module.scss";
import { AuthContext } from "../store";
import Button from "../../UI/Button";

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
        aria-expanded={isOpen}
        className={`btn ${styles["btn-secondary"]}`}
        disabled={isLoading}
        onClick={handleOpenModal}
      >
        Выйти из временного аккаунта
      </button>
      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalHeading>Вы уверены?</ModalHeading>
        <ModalText>
          Вы не сохранили свои данные. Все ваши данные будут утеряны.
        </ModalText>
        <ModalButtonGroup>
          <Button size="medium" onClick={handleCloseModal}>
            Отмена
          </Button>
          <Button variant="danger" size="medium" onClick={handleLogout}>
            Выйти
          </Button>
        </ModalButtonGroup>
      </Modal>
    </>
  );
};

export default SignOutButton;
