import clsx from "clsx/lite";

import styles from "./Button.module.scss";

const Button = ({
  children,
  variant = "standard" /* standard|plain|accent|warning|danger */,
  size /* small|medium|large */,
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        "btn",
        variant && styles[`btn--${variant}`],
        size && styles[`btn--size-${size}`],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
