import { useTranslation } from "react-i18next";
import clsx from "clsx/lite";

import styles from "./CompletedTasksChart.module.scss";
import Menu from "@/lib/Menu";
import SelectMenu from "@/lib/SelectMenu";
import { CHART_VIEW_OPTIONS } from "./consts";

const ChartViewSelect = ({ currentView, onChangeView }) => {
  const { t } = useTranslation("profile");

  const options = CHART_VIEW_OPTIONS.map((option) => ({
    value: option,
    name: t(`chartView.${option}`),
  }));

  return (
    <Menu
      title={t("chartViewMenuTitle")}
      renderOpener={(props) => (
        <div
          {...props}
          role="combobox"
          tabIndex="0"
          title={t("chartViewMenuTitle")}
          className={clsx("flex-center", styles["select-opener"])}
        >
          {t(`chartView.${currentView}`)}
        </div>
      )}
      renderContent={(close) => (
        <SelectMenu
          options={options}
          selected={currentView}
          onChange={(view) => {
            close();
            onChangeView(view);
          }}
        />
      )}
    />
  );
};

export default ChartViewSelect;
