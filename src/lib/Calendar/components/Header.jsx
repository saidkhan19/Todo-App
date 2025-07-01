import { memo, useContext } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import styles from "../Calendar.module.scss";
import Button from "@/components/UI/Button";
import { formatMonthYear } from "../utils";
import { CalendarContext } from "../context";

const Header = memo(function Header() {
  const { currentView, setPreviousMonth, setNextMonth } =
    useContext(CalendarContext);

  return (
    <div className={styles["header"]}>
      <Button
        variant="plain"
        type="button"
        title="Предыдущий месяц"
        className={styles["control-button"]}
        onClick={setPreviousMonth}
      >
        <span className="sr-only">Предыдущий месяц</span>
        <ChevronLeft size={22} stroke="currentColor" strokeWidth={1} />
      </Button>
      <p className={styles["title"]} aria-label="Текущий месяц">
        {formatMonthYear(currentView)}
      </p>
      <Button
        variant="plain"
        type="button"
        title="Следующий месяц"
        className={styles["control-button"]}
        onClick={setNextMonth}
      >
        <span className="sr-only">Следующий месяц</span>
        <ChevronRight size={22} stroke="currentColor" strokeWidth={1} />
      </Button>
    </div>
  );
});

export default Header;
