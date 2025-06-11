import styles from "./Button.module.scss";

const Button = ({
  children,
  variant = "standard" /* standard|plain|accent|warning|danger */,
  size /* small|medium|large */,
  className,
  ...props
}) => {
  const buttonClasses = [
    "btn",
    variant ? styles[`btn--${variant}`] : "",
    size ? styles[`btn--size-${size}`] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
