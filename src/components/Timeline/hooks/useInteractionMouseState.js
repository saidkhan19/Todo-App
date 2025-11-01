import { useEffect } from "react";

import { resetCursor, setCursor } from "@/utils/document";

const useInteractionMouseState = (interactionType) => {
  useEffect(() => {
    if (!interactionType) return;

    switch (interactionType) {
      case "resize-right":
        setCursor("w-resize");
        break;
      case "resize-left":
        setCursor("e-resize");
        break;
      case "drag":
        setCursor("grabbing");
        break;
    }

    return resetCursor;
  }, [interactionType]);
};

export default useInteractionMouseState;
