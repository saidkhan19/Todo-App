import React from "react";

import styles from "./ErrorBoundary.module.scss";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Ошибка:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles["container"]}>
          <div
            role="alert"
            aria-live="assertive"
            tabIndex={-1}
            className={styles["error-card"]}
          >
            <h2 className={styles["header"]}>Ошибка. Что-то пошло не так.</h2>
            <p>Пожалуйста, попробуйте еще раз или перезагрузите страницу.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
