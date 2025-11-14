import { useTranslation } from "react-i18next";

import styles from "./ChartGroup.module.scss";
import Container from "@/components/UI/Container";
import StatusMessage from "@/components/UI/StatusMessage";
import SpinnerBox from "@/components/UI/SpinnerBox";
import { useAllProjectsAndTasksContext } from "@/components/DataProviders/AllProjectsAndTasksProvider";
import CompletedTasksChart from "../CompletedTasksChart/CompletedTasksChart";
import ProductivityChart from "../ProductivityChart/ProductivityChart";
import { useDefaultProjectContext } from "@/components/DataProviders/DefaultProjectProvider";
import { transformFirebaseError } from "@/utils/notifications";

const ChartGroup = () => {
  const { items, loading, error } = useAllProjectsAndTasksContext();
  const {
    defaultProject,
    loading: defaultProjectLoading,
    error: defaultProjectError,
  } = useDefaultProjectContext();
  const { t } = useTranslation("common");

  if (loading || defaultProjectLoading)
    return (
      <Container padding="70px 0">
        <SpinnerBox />
      </Container>
    );

  if (error || defaultProjectError)
    return (
      <Container width="90%" padding="24px 0">
        <StatusMessage
          title={t("status.error")}
          {...transformFirebaseError(error || defaultProjectError)}
        />
      </Container>
    );

  return (
    <div className={styles["charts"]}>
      <CompletedTasksChart
        className={styles["charts__item"]}
        items={items}
        defaultProject={defaultProject}
      />
      <ProductivityChart className={styles["charts__item"]} items={items} />
    </div>
  );
};

export default ChartGroup;
