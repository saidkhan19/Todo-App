import clsx from "clsx/lite";

import styles from "./Profile.module.scss";
import Account from "./components/Account/Account";
import Statistics from "./components/Statistics/Statistics";

const Profile = () => {
  return (
    <div className={clsx(styles["content-surface"], styles["container"])}>
      <h1 className="sr-only">Профиль</h1>
      <section>
        <h2 className={styles["section-header"]}>Аккаунт</h2>
        <div className={styles["account-content"]}>
          <Account />
        </div>
      </section>
      <section>
        <h2 className={styles["section-header"]}>Статистика</h2>
        <div className={styles["stats-content"]}>
          <Statistics />
        </div>
      </section>
    </div>
  );
};

export default Profile;
