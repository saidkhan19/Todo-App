import { useEffect, useRef } from "react";

import usePlannerStore, { getMaxRowCount } from "../../store";
import DataFetcher from "../DataFetcher/DataFetcher";
import GridRow from "../GridRow/GridRow";
import { getCoordinates } from "@/utils/events";

const GridContent = () => {
  const gridContentRef = useRef();
  const isDragging = usePlannerStore((state) => state.isDragging);
  const updateDragging = usePlannerStore((state) => state.updateDragging);
  const stopDragging = usePlannerStore((state) => state.stopDragging);
  const rowCount = usePlannerStore(getMaxRowCount);
  const rows = [];

  for (let i = 0; i < rowCount + (isDragging ? 1 : 0); i++)
    rows.push(<GridRow key={i} row={i} ariaRowIndex={i + 2} />);

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => {
        console.log("drag");
        if (!gridContentRef.current) return;

        e.preventDefault();
        const { x, y } = getCoordinates(e);

        const el = document.elementFromPoint(x, y);
        const cell = el?.closest('[role="gridcell"]');

        if (el && cell) {
          // Mouse is on top of existing cell
          const row = +cell.dataset.row;
          const column = +cell.dataset.column;
          updateDragging(row, column);
        } else if (el?.closest('[role="grid"]')) {
          // Mouse is within the droppable area
          const rect = gridContentRef.current.getBoundingClientRect();

          const row = y < rect.top ? 0 : rowCount;
          const column = Math.floor((x - rect.left) / (rect.width / 7));

          updateDragging(row, column);
        }
      };

      document.addEventListener("mousemove", handleMouseMove);

      return () => document.removeEventListener("mousemove", handleMouseMove);
    }
  }, [isDragging, rowCount, updateDragging, stopDragging]);

  return (
    <DataFetcher>
      <div role="rowgroup" ref={gridContentRef}>
        {rows}
      </div>
    </DataFetcher>
  );
};

export default GridContent;
