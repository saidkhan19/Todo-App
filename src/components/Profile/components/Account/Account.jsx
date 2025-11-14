import { useSignOut } from "react-firebase-hooks/auth";
import { useTranslation } from "react-i18next";
import { LogOut } from "lucide-react";

import styles from "./Account.module.scss";
import { auth } from "@/config/firebase";
import useFirebaseErrorNotification from "@/hooks/useFirebaseErrorNotification";
import Button from "@/components/UI/Button";
import useUserDetails from "../../hooks/useUserDetails";
import LanguageSelect from "../LanguageSelect/LanguageSelect";

const showEmail = import.meta.env.VITE_SHOW_EMAIL === "true";

const Account = () => {
  const { photoURL, name, email } = useUserDetails(auth);
  const { t } = useTranslation(["common", "profile"]);

  const [signOut, _signOutLoading, signOutError] = useSignOut(auth);
  useFirebaseErrorNotification(signOutError);

  return (
    <div className={styles["account"]}>
      <div className={styles["account-details"]}>
        <img
          src={photoURL}
          alt={t("profile:accountUserPhotoAlt")}
          className={styles["user-photo"]}
        />
        <div className={styles["account-content"]}>
          <div className={styles["user-info"]}>
            <p className={styles["user-info__name"]}>{name}</p>
            <p className={styles["user-info__email"]}>
              {showEmail ? email : "demo@example.com"}
            </p>
          </div>
          <div className={styles["user-actions"]}>
            <LanguageSelect />
            <Button variant="plain" size="small" onClick={signOut}>
              <LogOut size={19} stroke="currentColor" strokeWidth={1} />
              <span>{t("common:controls.signOut")}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
