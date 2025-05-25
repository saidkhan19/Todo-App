import { Link } from "react-router";

import image404 from "../../assets/icons/404.svg";
import styles from "./NotFound.module.scss";

const NotFound = () => {
  return (
    <div className={styles["container"]}>
      <main className={styles["content"]}>
        <img src={image404} alt="404" className={styles["image-404"]} />
        <h1 className={styles["header"]}>Страница не найдена</h1>
        <p>Упс! Что-то пошло не так, этой страницы не существует.</p>
        <Link to="/" className="btn">
          На главную
        </Link>
      </main>
    </div>
  );
};

export default NotFound;
