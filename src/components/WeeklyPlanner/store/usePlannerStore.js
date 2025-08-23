import { create } from "zustand";
import { devtools } from "zustand/middleware";

import Week from "../models/week";
import { itemActions, plannerActions } from "./actions";

const usePlannerStore = create()(
  devtools((set, get) => ({
    currentWeek: new Week(),
    items: [],
    defaultProject: null,
    isDragging: false,
    dragItem: null,
    dragStartWeek: null,
    dragStartPosition: null,
    dragEndPosition: null,
    focusedItem: null,

    // Actions
    ...itemActions(set, get),
    ...plannerActions(set, get),
  }))
);

export default usePlannerStore;
