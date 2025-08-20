import { useShallow } from "zustand/shallow";

import styles from "./GridCell.module.scss";
import usePlannerStore, { getCell } from "../../store";
import TaskGridItem from "../TaskGridItem/TaskGridItem";

const GridCell = ({ row, column, ariaRowIndex, ariaColumnIndex }) => {
  const value = usePlannerStore(useShallow(getCell(row, column)));

  return (
    <div
      role="gridcell"
      aria-rowindex={ariaRowIndex}
      aria-colindex={ariaColumnIndex}
      className={`flex-center ${styles["grid-cell"]}`}
      data-row={row}
      data-column={column}
    >
      {value.map((item) =>
        item === "PLACEHOLDER" ? (
          <div key={item} className={styles["placeholder"]} />
        ) : (
          <TaskGridItem key={item.id} item={item} row={row} column={column} />
        )
      )}
    </div>
  );
};

export default GridCell;
