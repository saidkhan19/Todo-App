import styles from "../Layout.module.scss";

const Footer = () => {
  return (
    <footer className={styles["footer"]}>
      <p>
        &copy; 2025. Made by&nbsp;
        <a
          href="https://github.com/saidkhan19"
          target="_blank"
          rel="noreferrer"
          className={`btn ${styles["link-underline"]}`}
        >
          Sayid
        </a>
        .
      </p>
    </footer>
  );
};

export default Footer;
