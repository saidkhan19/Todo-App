import { useEffect, useRef } from "react";

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

  const handleMouseMove = usePlannerDragEvents({
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
      document.addEventListener("mousemove", handleMouseMove);
      return () => document.removeEventListener("mousemove", handleMouseMove);
    }
  }, [isDragging, handleMouseMove]);

  return (
    <DataFetcher>
      <div
        role="rowgroup"
        ref={gridContentRef}
        onKeyDown={handleKeyboardInteractions}
      >
        {rows}
      </div>
    </DataFetcher>
  );
};

export default GridContent;
