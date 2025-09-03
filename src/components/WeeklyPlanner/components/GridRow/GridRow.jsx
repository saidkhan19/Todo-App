import { memo } from "react";

import styles from "./GridRow.module.scss";
import GridCell from "../GridCell/GridCell";

const GridRow = memo(({ row, ariaRowIndex }) => {
  const cells = [];
  for (let i = 0; i < 7; i++) {
    cells.push(
      <GridCell
        key={i}
        row={row}
        column={i}
        ariaRowIndex={ariaRowIndex}
        ariaColumnIndex={i + 1}
      />
    );
  }

  return (
    <div role="row" aria-rowindex={ariaRowIndex} className={styles["grid-row"]}>
      {cells}
    </div>
  );
});

export default GridRow;
