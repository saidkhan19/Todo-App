import { Bar } from "react-chartjs-2";

import styles from "./ProductivityChart.module.scss";
import { productivityChartOptions } from "@/config/chart";
import Container from "@/components/UI/Container";
import StatusMessage from "@/components/UI/StatusMessage";
import useGetChartData from "./useGetChartData";

const ProductivityChart = ({ className, items }) => {
  const { labels, datasets } = useGetChartData(items);

  const hasData = datasets.length > 0;

  return (
    <div className={className}>
      <div className={styles["chart__top-panel"]}>
        <h3 className={styles["chart__header"]}>Средняя продуктивность</h3>
      </div>
      <div className={styles["chart__bar-chart"]}>
        {hasData ? (
          <Bar options={productivityChartOptions} data={{ labels, datasets }} />
        ) : (
          <Container padding="40px 24px">
            <StatusMessage type="info" message="Данных не найдено." />
          </Container>
        )}
      </div>
    </div>
  );
};

export default ProductivityChart;
