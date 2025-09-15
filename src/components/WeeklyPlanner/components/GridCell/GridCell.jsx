import styles from "./GridCell.module.scss";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import { useGridCellSelector } from "../../store";
import TaskGridItem from "../TaskGridItem/TaskGridItem";

const GridCell = ({ row, column, ariaRowIndex, ariaColumnIndex }) => {
  const { items } = useProjectsAndTasksContext();

  const cellItems = useGridCellSelector(row, column, items);

  return (
    <div
      role="gridcell"
      aria-rowindex={ariaRowIndex}
      aria-colindex={ariaColumnIndex}
      className={`flex-center ${styles["grid-cell"]}`}
      data-row={row}
      data-column={column}
    >
      {cellItems.map((item) =>
        item === "PLACEHOLDER" ? (
          <div
            key={item}
            className={styles["placeholder"]}
            data-testid="placeholder"
          />
        ) : (
          <TaskGridItem key={item.id} item={item} row={row} column={column} />
        )
      )}
    </div>
  );
};

export default GridCell;
