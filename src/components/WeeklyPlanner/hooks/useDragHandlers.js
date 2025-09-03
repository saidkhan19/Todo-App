import { useShallow } from "zustand/shallow";

import { useBatchUpdateItems } from "@/hooks/queries";
import { usePlannerStore } from "../store";
import { grid } from "../models/grid";

const useDraggingState = (itemId) =>
  usePlannerStore(
    useShallow((state) => ({
      isDragging: state.dragItem?.id === itemId,
      dragStartWeek: state.dragItem?.id === itemId ? state.dragStartWeek : null,
      dragItem: state.dragItem?.id === itemId ? state.dragItem : null,
      dragStartPosition:
        state.dragItem?.id === itemId ? state.dragStartPosition : null,
      dragEndPosition:
        state.dragItem?.id === itemId ? state.dragEndPosition : null,
    }))
  );

const useDragHandlers = (row, column, item, items) => {
  const startDragging = usePlannerStore((state) => state.startDragging);
  const stopDragging = usePlannerStore((state) => state.stopDragging);
  const currentWeek = usePlannerStore((state) => state.currentWeek);

  const {
    isDragging,
    dragItem,
    dragStartWeek,
    dragStartPosition,
    dragEndPosition,
  } = useDraggingState(item.id);

  const batchUpdateItems = useBatchUpdateItems();

  const handleDragStart = () => startDragging(row, column, item);

  const handleDragEnd = () => {
    if (!isDragging) return;

    if (
      dragStartPosition.row !== dragEndPosition.row ||
      dragStartPosition.column !== dragEndPosition.column ||
      currentWeek !== dragStartWeek
    ) {
      const updates = grid.getDragEndUpdates(
        items,
        currentWeek,
        dragStartPosition,
        dragEndPosition,
        dragItem
      );

      batchUpdateItems(updates);
    }
    stopDragging();
  };

  return { isDragging, handleDragStart, handleDragEnd };
};

export default useDragHandlers;
