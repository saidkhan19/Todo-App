import { useSignOut } from "react-firebase-hooks/auth";
import { LogOut } from "lucide-react";

import styles from "./Account.module.scss";
import { auth } from "@/config/firebase";
import useFirebaseErrorNotification from "@/hooks/useFirebaseErrorNotification";
import Button from "@/components/UI/Button";
import useUserDetails from "../../hooks/useUserDetails";
import LanguageSelect from "../LanguageSelect/LanguageSelect";

const Account = () => {
  const { photoURL, name, email } = useUserDetails(auth);

  const [signOut, _signOutLoading, signOutError] = useSignOut(auth);
  useFirebaseErrorNotification(signOutError);

  return (
    <div className={styles["account"]}>
      <div className={styles["account-details"]}>
        <img
          src={photoURL}
          alt="Фотография аккаунта"
          className={styles["user-photo"]}
        />
        <div className={styles["account-content"]}>
          <div className={styles["user-info"]}>
            <p className={styles["user-info__name"]}>{name}</p>
            <p className={styles["user-info__email"]}>{email}</p>
          </div>
          <div className={styles["user-actions"]}>
            <LanguageSelect />
            <Button variant="plain" size="small" onClick={signOut}>
              <LogOut size={19} stroke="currentColor" strokeWidth={1} />
              <span>Выйти</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
