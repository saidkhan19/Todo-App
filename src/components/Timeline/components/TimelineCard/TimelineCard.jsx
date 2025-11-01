import { useEffect } from "react";
import { motion as Motion } from "motion/react";
import clsx from "clsx/lite";

import styles from "./TimelineCard.module.scss";
import { getColorPalette } from "@/utils/projects";
import { daysBetween } from "@/utils/date";
import { useTimelineTrackContext } from "../../context";
import { CELL_WIDTH } from "../../consts";
import { getTimelineCardStartPosition } from "../../utils";
import TimelineCardInfoShort from "./TimelineCardInfoShort";
import TimelineCardInfoLong from "./TimelineCardInfoLong";
import useTimelineCardInteractions from "../../hooks/useTimelineCardInteractions";
import useTimelineStore from "../../store";

const TimelineCard = ({ project }) => {
  const { baseDate } = useTimelineTrackContext();
  const isInteracting = useTimelineStore(
    (state) => state.activeItem?.id === project.id
  );
  const displayStartDate = useTimelineStore((state) =>
    state.activeItem?.id === project.id ? state.newStartDate : null
  );
  const displayEndDate = useTimelineStore((state) =>
    state.activeItem?.id === project.id ? state.newEndDate : null
  );

  const {
    handlePointerDownResizeLeft,
    handlePointerDownResizeRight,
    handlePointerDownDrag,
    handlePointerMove,
    handlePointerUp,
  } = useTimelineCardInteractions(project);

  useEffect(() => {
    if (!isInteracting) return;

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isInteracting, handlePointerMove, handlePointerUp]);

  const startDate = isInteracting ? displayStartDate : project.startDate;
  const endDate = isInteracting ? displayEndDate : project.endDate;

  const width = (daysBetween(startDate, endDate) + 1) * CELL_WIDTH;
  const startPosition = getTimelineCardStartPosition(baseDate, startDate);

  const palette = getColorPalette(project.palette);
  const isShort = width <= CELL_WIDTH;

  // console.log(project.name, isInteracting, displayStartDate, displayEndDate);

  return (
    <Motion.div
      animate={{ opacity: isInteracting ? 0.55 : 1 }}
      transition={{ duration: 0.3 }}
      style={{
        x: startPosition,
        width,
        backgroundColor: palette.soft,
        borderColor: palette.primary,
        color: palette.primary,
      }}
      className={styles["card"]}
    >
      {isShort ? (
        <TimelineCardInfoShort project={project} />
      ) : (
        <TimelineCardInfoLong
          project={project}
          cardStartPosition={startPosition}
          width={width}
        />
      )}

      <button
        className={clsx("btn", styles["drag-button"])}
        style={{ cursor: isInteracting ? "inherit" : "grab" }}
        disabled={isInteracting}
        onPointerDownCapture={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handlePointerDownDrag(e);
        }}
      >
        <span className="sr-only">Переместить проект</span>
      </button>

      <button
        title="Изменить дату начала"
        className={clsx(
          "btn",
          styles["resize-button"],
          styles["resize-button--left"]
        )}
        disabled={isInteracting}
        onPointerDownCapture={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handlePointerDownResizeLeft(e);
        }}
      >
        <span className="sr-only">Изменить дату начала</span>
      </button>
      <button
        title="Изменить дату окончания"
        className={clsx(
          "btn",
          styles["resize-button"],
          styles["resize-button--right"]
        )}
        disabled={isInteracting}
        onPointerDownCapture={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handlePointerDownResizeRight(e);
        }}
      >
        <span className="sr-only">Изменить дату окончания</span>
      </button>
    </Motion.div>
  );
};

export default TimelineCard;
