import PropTypes from "prop-types";

import styles from "./Button.module.scss";

const Button = ({
  children,
  variant = "standard",
  size,
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

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf([
    "standard",
    "plain",
    "accent",
    "warning",
    "danger",
  ]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  className: PropTypes.func,
};

export default Button;
