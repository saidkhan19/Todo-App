import { useReducer } from "react";
import { Bar } from "react-chartjs-2";
import { ChevronLeft, ChevronRight } from "lucide-react";

import styles from "./CompletedTasksChart.module.scss";
import Button from "@/components/UI/Button";
import { defaultOptions } from "@/config/chart";
import { DEFAULT_VIEW } from "./consts";
import ChartViewSelect from "./ChartViewSelect";
import useGetChartData from "./useGetChartData";
import { countPages } from "./utils";

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

  return (
    <div className={className}>
      <div className={styles["chart__top-panel"]}>
        <h3 className={styles["chart__header"]}>Выполнение задач</h3>
        <div className={styles["chart__controls"]}>
          {chartState.pagesLength > 1 && (
            <>
              <Button
                variant="plain"
                className={styles["chart__nav-button"]}
                onClick={() => dispatch({ type: "previous-page" })}
              >
                <ChevronLeft size={16} stroke="currentColor" />
              </Button>
              <Button
                variant="plain"
                className={styles["chart__nav-button"]}
                onClick={() => dispatch({ type: "next-page" })}
              >
                <ChevronRight size={16} stroke="currentColor" />
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
        <Bar options={defaultOptions} data={{ labels, datasets }} />
      </div>
    </div>
  );
};

export default CompletedTasksChart;
