import styles from "./GridContent.module.scss";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import SpinnerBox from "@/components/UI/SpinnerBox";
import StatusMessage from "@/components/UI/StatusMessage/StatusMessage";
import Content from "./Content";
import { transformFirebaseError } from "@/utils/notifications";

const GridContent = () => {
  let { items, loading, error } = useProjectsAndTasksContext();

  if (loading)
    return (
      <div role="row" aria-rowindex={1} aria-rowspan={7}>
        <SpinnerBox height="lg" />
      </div>
    );

  if (error)
    return (
      <div
        role="row"
        aria-rowindex={1}
        aria-rowspan={7}
        aria-colindex={1}
        className={styles["status-row"]}
      >
        <StatusMessage title="Ошибка" {...transformFirebaseError(error)} />
      </div>
    );

  return <Content items={items} />;
};

export default GridContent;
