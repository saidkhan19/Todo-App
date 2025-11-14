import { useReducer } from "react";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";

import styles from "./CompletedTasksChart.module.scss";
import Button from "@/components/UI/Button";
import { defaultOptions } from "@/config/chart";
import { DEFAULT_VIEW } from "./consts";
import ChartViewSelect from "./ChartViewSelect";
import useGetChartData from "./useGetChartData";
import { countPages } from "./utils";
import StatusMessage from "@/components/UI/StatusMessage";
import Container from "@/components/UI/Container";

const initState = (items) => {
  const view = DEFAULT_VIEW;
  const pagesLength = countPages(items, view);
  return { view, pagesLength, page: 0 };
};

const chartReducer = (state, action) => {
  switch (action.type) {
    case "previous-page": {
      const prevPage = Math.max(state.page - 1, -state.pagesLength + 1);
      return { ...state, page: prevPage };
    }
    case "next-page": {
      const nextPage = Math.min(0, state.page + 1);
      return { ...state, page: nextPage };
    }
    case "set-view": {
      return {
        view: action.payload.view,
        pagesLength: action.payload.pagesLength,
        page: 0,
      };
    }
    default:
      return state;
  }
};

const CompletedTasksChart = ({ className, items, defaultProject }) => {
  const [chartState, dispatch] = useReducer(chartReducer, items, initState);
  const { t } = useTranslation("profile");

  const { labels, datasets } = useGetChartData(
    chartState.view,
    chartState.page,
    items,
    defaultProject
  );

  const handleChangeView = (view) => {
    dispatch({
      type: "set-view",
      payload: { view, pagesLength: countPages(items, view) },
    });
  };

  const hasData = datasets.length > 0;

  return (
    <div className={className}>
      <div className={styles["chart__top-panel"]}>
        <h3 className={styles["chart__header"]}>
          {t("completedTasksChartTitle")}
        </h3>
        <div className={styles["chart__controls"]}>
          {chartState.pagesLength > 1 && (
            <>
              <Button
                variant="plain"
                title={t("controls.previousPage")}
                className={styles["chart__nav-button"]}
                onClick={() => dispatch({ type: "previous-page" })}
              >
                <ChevronLeft size={16} stroke="currentColor" />
                <span className="sr-only">{t("controls.previousPage")}</span>
              </Button>
              <Button
                variant="plain"
                title={t("controls.nextPage")}
                className={styles["chart__nav-button"]}
                onClick={() => dispatch({ type: "next-page" })}
              >
                <ChevronRight size={16} stroke="currentColor" />
                <span className="sr-only">{t("controls.nextPage")}</span>
              </Button>
            </>
          )}
          <ChartViewSelect
            currentView={chartState.view}
            onChangeView={handleChangeView}
          />
        </div>
      </div>
      <div className={styles["chart__bar-chart"]}>
        {hasData ? (
          <Bar options={defaultOptions} data={{ labels, datasets }} />
        ) : (
          <Container padding="40px 24px">
            <StatusMessage type="info" message={t("message.noData")} />
          </Container>
        )}
      </div>
    </div>
  );
};

export default CompletedTasksChart;
