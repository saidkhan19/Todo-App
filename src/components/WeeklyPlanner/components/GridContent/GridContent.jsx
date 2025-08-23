import { useEffect, useRef } from "react";

import styles from "./GridContent.module.scss";
import { usePlannerStore, getMaxRowCount } from "../../store";
import DataFetcher from "../DataFetcher/DataFetcher";
import GridRow from "../GridRow/GridRow";
import usePlannerKeyboardInteractions from "../../hooks/usePlannerKeyboardInteractions";
import usePlannerDragEvents from "../../hooks/usePlannerDragEvents";

const GridContent = () => {
  const gridContentRef = useRef();
  const isDragging = usePlannerStore((state) => state.isDragging);
  const updateDragging = usePlannerStore((state) => state.updateDragging);
  const moveItem = usePlannerStore((state) => state.moveItem);
  const setNextWeek = usePlannerStore((state) => state.setNextWeek);
  const setPreviousWeek = usePlannerStore((state) => state.setPreviousWeek);
  const rowCount = usePlannerStore(getMaxRowCount);
  const rows = [];

  for (let i = 0; i < rowCount + (isDragging ? 1 : 0); i++)
    rows.push(<GridRow key={i} row={i} ariaRowIndex={i + 2} />);

  const handlePointerMove = usePlannerDragEvents({
    gridContentRef,
    isDragging,
    rowCount,
    updateDragging,
    setNextWeek,
    setPreviousWeek,
  });

  const handleKeyboardInteractions = usePlannerKeyboardInteractions({
    moveItem,
  });

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("pointermove", handlePointerMove);

      return () =>
        document.removeEventListener("pointermove", handlePointerMove);
    }
  }, [isDragging, handlePointerMove]);

  return (
    <DataFetcher>
      <div
        role="rowgroup"
        ref={gridContentRef}
        onKeyDown={handleKeyboardInteractions}
      >
        {rowCount === 0 && (
          <div
            role="row"
            aria-rowindex={1}
            aria-rowspan={7}
            className={styles["grid-empty-message"]}
          >
            Задач на эту неделю не найдено.
          </div>
        )}
        {rows}
      </div>
    </DataFetcher>
  );
};

export default GridContent;
