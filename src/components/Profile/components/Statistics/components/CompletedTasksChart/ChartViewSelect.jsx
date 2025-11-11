import clsx from "clsx/lite";

import styles from "./CompletedTasksChart.module.scss";
import Menu from "@/lib/Menu";
import SelectMenu from "@/lib/SelectMenu";
import { CHART_VIEW_OPTIONS } from "./consts";

const ChartViewSelect = ({ currentView, onChangeView }) => {
  const option = CHART_VIEW_OPTIONS.find(
    (option) => option.value === currentView
  );

  return (
    <Menu
      title="Выберите период"
      renderOpener={(props) => (
        <div
          {...props}
          role="combobox"
          tabIndex="0"
          title="Выберите период"
          className={clsx("flex-center", styles["select-opener"])}
        >
          {option.name}
        </div>
      )}
      renderContent={() => (
        <SelectMenu
          options={CHART_VIEW_OPTIONS}
          selected={currentView}
          onChange={onChangeView}
        />
      )}
    />
  );
};

export default ChartViewSelect;
