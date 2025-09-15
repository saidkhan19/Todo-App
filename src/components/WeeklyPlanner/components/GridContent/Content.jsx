import { useEffect, useRef } from "react";

import styles from "./GridContent.module.scss";
import { useGetMaxRowCountSelector, usePlannerStore } from "../../store";
import GridRow from "../GridRow/GridRow";
import usePlannerKeyboardInteractions from "../../hooks/usePlannerKeyboardInteractions";
import useDragPointerHandlers from "../../hooks/useDragPointerHandlers";
import StatusMessage from "@/components/UI/StatusMessage";

const Content = ({ items }) => {
  const gridContentRef = useRef();
  const isDragging = usePlannerStore((state) => state.isDragging);

  const rowCount = useGetMaxRowCountSelector(items);
  const rows = [];

  for (let i = 0; i < rowCount + (isDragging ? 1 : 0); i++)
    rows.push(<GridRow key={i} row={i} ariaRowIndex={i + 2} />);

  const handlePointerMove = useDragPointerHandlers({
    gridContentRef,
    isDragging,
    rowCount,
  });

  const handleKeyboardInteractions = usePlannerKeyboardInteractions(items);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("pointermove", handlePointerMove);

      return () =>
        document.removeEventListener("pointermove", handlePointerMove);
    }
  }, [isDragging, handlePointerMove]);

  return (
    <div
      role="rowgroup"
      ref={gridContentRef}
      onKeyDown={isDragging ? null : handleKeyboardInteractions}
    >
      {rowCount === 0 && (
        <div
          role="row"
          aria-rowindex={2}
          aria-rowspan={7}
          aria-colindex={1}
          className={styles["status-row"]}
        >
          <StatusMessage
            type="info"
            message="Задач на эту неделю не найдено."
          />
        </div>
      )}
      {rows}
    </div>
  );
};

export default Content;
