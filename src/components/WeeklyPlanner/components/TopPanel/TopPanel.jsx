import Button from "@/components/UI/Button";
import styles from "./TopPanel.module.scss";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePlannerStore } from "../../store";

const TopPanel = () => {
  const header = usePlannerStore((state) => state.currentWeek.getWeekHeader());
  const setNextWeek = usePlannerStore((state) => state.setNextWeek);
  const setPreviousWeek = usePlannerStore((state) => state.setPreviousWeek);

  return (
    <div className={styles["top-panel"]}>
      <h3 className={styles["section-header"]}>{header}</h3>
      <menu className={styles["navigation-menu"]}>
        <Button
          variant="plain"
          className={styles["navigation-button"]}
          onClick={setPreviousWeek}
        >
          <ChevronLeft size={20} color="currentColor" />
        </Button>
        <Button
          variant="plain"
          className={styles["navigation-button"]}
          onClick={setNextWeek}
        >
          <ChevronRight size={20} color="currentColor" />
        </Button>
      </menu>
    </div>
  );
};

export default TopPanel;
