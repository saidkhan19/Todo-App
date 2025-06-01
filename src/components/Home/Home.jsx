import styles from "./Home.module.scss";

const Home = () => {
  return (
    <div className={`${styles["content-surface"]} ${styles["temp"]}`}>Home</div>
  );
};

export default Home;
