import { memo } from "react";

import styles from "../Calendar.module.scss";

const GridHeader = memo(function GridHeader() {
  return (
    <div
      role="row"
      className={`${styles["calendar-row"]} ${styles["header-row"]}`}
    >
      <div
        role="columnheader"
        aria-label="Понедельник"
        className={`flex-center ${styles["column-header"]}`}
      >
        <span>Пн</span>
      </div>
      <div
        role="columnheader"
        aria-label="Вторник"
        className={`flex-center ${styles["column-header"]}`}
      >
        <span>Вт</span>
      </div>
      <div
        role="columnheader"
        aria-label="Среда"
        className={`flex-center ${styles["column-header"]}`}
      >
        <span>Ср</span>
      </div>
      <div
        role="columnheader"
        aria-label="Четверг"
        className={`flex-center ${styles["column-header"]}`}
      >
        <span>Чт</span>
      </div>
      <div
        role="columnheader"
        aria-label="Пятница"
        className={`flex-center ${styles["column-header"]}`}
      >
        <span>Пт</span>
      </div>
      <div
        role="columnheader"
        aria-label="Суббота"
        className={`flex-center ${styles["column-header"]}`}
      >
        <span>Сб</span>
      </div>
      <div
        role="columnheader"
        aria-label="Воскресенье"
        className={`flex-center ${styles["column-header"]}`}
      >
        <span>Вс</span>
      </div>
    </div>
  );
});

export default GridHeader;
