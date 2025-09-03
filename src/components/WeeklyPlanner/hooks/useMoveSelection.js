import { useBatchUpdateItems } from "@/hooks/queries";
import { usePlannerStore } from "../store";
import { grid } from "../models/grid";
import { useCallback } from "react";

const useMoveSelection = (items) => {
  const currentWeek = usePlannerStore((state) => state.currentWeek);
  const setWeek = usePlannerStore((state) => state.setWeek);

  const batchUpdateItems = useBatchUpdateItems();

  const handleMove = useCallback(
    (row, column, direction) => {
      const changes = grid.getMoveItemUpdates(
        items,
        row,
        column,
        direction,
        currentWeek
      );

      if (changes?.updates) batchUpdateItems(changes.updates);

      if (changes?.targetWeek) setWeek(changes.targetWeek);
    },
    [items, currentWeek, setWeek, batchUpdateItems]
  );

  return handleMove;
};

export default useMoveSelection;
