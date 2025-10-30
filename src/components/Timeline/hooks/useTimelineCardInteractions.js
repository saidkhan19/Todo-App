import { useCallback, useRef } from "react";

const useTimelineCardInteractions = () => {
  const isInteractingRef = useRef(false);

  const handlePointerDownResizeLeft = useCallback(() => {}, []);

  const handlePointerDownResizeRight = useCallback(() => {}, []);

  const handlePointerDownDrag = useCallback(() => {}, []);

  const handlePointerMove = useCallback(() => {}, []);

  const handlePointerUp = useCallback(() => {}, []);

  return {
    handlePointerDownResizeLeft,
    handlePointerDownResizeRight,
    handlePointerDownDrag,
    handlePointerMove,
    handlePointerUp,
  };
};

export default useTimelineCardInteractions;
