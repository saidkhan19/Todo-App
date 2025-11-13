import { memo, useContext } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import styles from "../Calendar.module.scss";
import Button from "@/components/UI/Button";
import { formatMonthYear } from "@/utils/format";
import { CalendarContext } from "../context";
import { useTranslation } from "react-i18next";

const Header = memo(function Header() {
  const { currentView, setPreviousMonth, setNextMonth } =
    useContext(CalendarContext);

  const { t } = useTranslation("common");

  return (
    <div className={styles["header"]}>
      <Button
        variant="plain"
        type="button"
        title={t("controls.previousMonth")}
        className={styles["control-button"]}
        onClick={setPreviousMonth}
      >
        <span className="sr-only">{t("controls.previousMonth")}</span>
        <ChevronLeft size={22} stroke="currentColor" strokeWidth={1} />
      </Button>
      <p className={styles["title"]} aria-label={t("labels.currentMonth")}>
        {formatMonthYear(currentView)}
      </p>
      <Button
        variant="plain"
        type="button"
        title={t("controls.nextMonth")}
        className={styles["control-button"]}
        onClick={setNextMonth}
      >
        <span className="sr-only">{t("controls.nextMonth")}</span>
        <ChevronRight size={22} stroke="currentColor" strokeWidth={1} />
      </Button>
    </div>
  );
});

export default Header;
