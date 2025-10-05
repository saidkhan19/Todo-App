import { useId } from "react";
import { BadgeInfo } from "lucide-react";

import styles from "./WeekStats.module.scss";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import Tooltip, { TooltipContent } from "@/lib/Tooltip";
import analytics from "@/models/analytics";
import Week from "@/models/week/week";
import { filterItemsForWeek } from "@/utils/dataTransforms";

const DataGroup = ({ headingText, headingDescription, dataText }) => {
  const id = useId();

  return (
    <div className={styles["data-group"]}>
      <div id={id} className={styles["heading"]}>
        <p>{headingText}</p>
        <div className={styles["heading__tooltip"]}>
          <Tooltip
            renderOpener={(props) => (
              <BadgeInfo
                {...props}
                tabIndex={0}
                size={14}
                strokeWidth={1}
                stroke="currentColor"
              />
            )}
            renderContent={() => (
              <TooltipContent>{headingDescription}</TooltipContent>
            )}
          />
        </div>
      </div>
      <p className={styles["data"]} aria-describedby={id}>
        {dataText}
      </p>
    </div>
  );
};

const WeekStats = () => {
  const { items, loading, error } = useProjectsAndTasksContext();

  if (loading || error) return null;

  const weekItems = filterItemsForWeek(items, new Week());
  const dataCompleted = analytics.countCompletedItems(weekItems);
  const dataProductivity = analytics.calculateProductivity(weekItems);

  return (
    <section>
      <h3 className="sr-only">Краткая информация о текущей неделе.</h3>
      <div className={styles["container"]}>
        <DataGroup
          headingText="Выполнено"
          headingDescription="Задач выполнено за текущую неделю."
          dataText={`${dataCompleted.completed} / ${dataCompleted.overall}`}
        />
        <DataGroup
          headingText="Продуктивность"
          headingDescription="Ежедневная выполняемость задач."
          dataText={`${dataProductivity.toFixed(1)}%`}
        />
      </div>
    </section>
  );
};

export default WeekStats;
