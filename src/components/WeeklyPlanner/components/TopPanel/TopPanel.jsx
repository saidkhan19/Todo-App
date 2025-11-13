import { useTranslation } from "react-i18next";

import styles from "./TopPanel.module.scss";
import Button from "@/components/UI/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePlannerStore } from "../../store";
import { getWeekHeader } from "../../utils";

const TopPanel = () => {
  const currentWeek = usePlannerStore((state) => state.currentWeek);
  const setNextWeek = usePlannerStore((state) => state.setNextWeek);
  const setPreviousWeek = usePlannerStore((state) => state.setPreviousWeek);
  const { t } = useTranslation("common");

  const header = getWeekHeader(currentWeek);

  return (
    <div className={styles["top-panel"]}>
      <h3 className={styles["section-header"]}>{header}</h3>
      <menu className={styles["navigation-menu"]}>
        <Button
          variant="plain"
          title={t("controls.previousWeek")}
          className={styles["navigation-button"]}
          onClick={setPreviousWeek}
        >
          <ChevronLeft size={20} color="currentColor" />
          <span className="sr-only">{t("controls.previousWeek")}</span>
        </Button>
        <Button
          variant="plain"
          title={t("controls.nextWeek")}
          className={styles["navigation-button"]}
          onClick={setNextWeek}
        >
          <ChevronRight size={20} color="currentColor" />
          <span className="sr-only">{t("controls.nextWeek")}</span>
        </Button>
      </menu>
    </div>
  );
};

export default TopPanel;
