import { useId } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("home");

  if (loading || error) return null;

  const weekItems = filterItemsForWeek(items, new Week());

  if (weekItems.length === 0) return null;

  const dataCompleted = analytics.countCompletedItems(weekItems);
  const dataProductivity = analytics.calculateProductivity(weekItems);

  return (
    <section>
      <h3 className="sr-only">{t("shortStatsTitle")}</h3>
      <div className={styles["container"]}>
        <DataGroup
          headingText={t("stats.completedTasks.text")}
          headingDescription={t("stats.completedTasks.description")}
          dataText={`${dataCompleted.completed} / ${dataCompleted.overall}`}
        />
        <DataGroup
          headingText={t("stats.productivity.text")}
          headingDescription={t("stats.productivity.description")}
          dataText={`${dataProductivity.toFixed(1)}%`}
        />
      </div>
    </section>
  );
};

export default WeekStats;
