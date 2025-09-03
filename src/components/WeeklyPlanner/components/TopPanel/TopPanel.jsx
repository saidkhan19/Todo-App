import Button from "@/components/UI/Button";
import styles from "./TopPanel.module.scss";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePlannerStore } from "../../store";
import { getWeekHeader } from "../../utils";

const TopPanel = () => {
  const currentWeek = usePlannerStore((state) => state.currentWeek);
  const setNextWeek = usePlannerStore((state) => state.setNextWeek);
  const setPreviousWeek = usePlannerStore((state) => state.setPreviousWeek);

  const header = getWeekHeader(currentWeek);

  return (
    <div className={styles["top-panel"]}>
      <h3 className={styles["section-header"]}>{header}</h3>
      <menu className={styles["navigation-menu"]}>
        <Button
          variant="plain"
          title="Предыдущая неделя"
          className={styles["navigation-button"]}
          onClick={setPreviousWeek}
        >
          <ChevronLeft size={20} color="currentColor" />
          <span className="sr-only">Предыдущая неделя</span>
        </Button>
        <Button
          variant="plain"
          title="Следующая неделя"
          className={styles["navigation-button"]}
          onClick={setNextWeek}
        >
          <ChevronRight size={20} color="currentColor" />
          <span className="sr-only">Следующая неделя</span>
        </Button>
      </menu>
    </div>
  );
};

export default TopPanel;
