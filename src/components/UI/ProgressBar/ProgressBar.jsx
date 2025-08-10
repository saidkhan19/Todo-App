import styles from "./ProgressBar.module.scss";

const getFillColor = (value) => {
  if (value < 40) return "var(--clr-progress-low)";
  if (value < 70) return "var(--clr-progress-midium)";
  return "var(--clr-progress-high)";
};

const ProgressBar = ({ value, labelledby, className = "" }) => {
  return (
    <div
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={value}
      aria-labelledby={labelledby}
      className={`${styles["progressbar"]} ${className}`}
    >
      <div
        className={styles["progressbar-fill"]}
        style={{ width: `${value}%`, backgroundColor: getFillColor(value) }}
      />
      <span className="sr-only">{value}%</span>
    </div>
  );
};

export default ProgressBar;
