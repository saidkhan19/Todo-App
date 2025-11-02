import { useRef } from "react";
import { animate, motion as Motion, useTransform } from "motion/react";
import clsx from "clsx/lite";
import { ChevronLeft, ChevronRight } from "lucide-react";

import styles from "./TimelineAlignButton.module.scss";
import { getColorPalette, getIcon } from "@/utils/projects";
import { getRelativeOffsetPosition } from "../../utils";
import { useTimelineTrackContext } from "../../context";
import { ALIGN_BUTTON_WIDTH, TIMELINE_ITEM_HEIGHT } from "../../consts";

const TimelineAlignButton = ({ project }) => {
  const isAnimatingRef = useRef(null);
  const { x, baseDate, containerWidth } = useTimelineTrackContext();

  const palette = getColorPalette(project.palette);
  const Icon = getIcon(project.icon).icon;

  const cardStartPosition = getRelativeOffsetPosition(
    baseDate,
    project.startDate
  );
  const isLeft = -x.get() > cardStartPosition;

  // Position the button at the container start or end
  const y = useTransform(x, (v) =>
    isLeft ? -v : -v + containerWidth - ALIGN_BUTTON_WIDTH
  );

  const handleAlignProject = () => {
    if (isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    const reset = () => {
      isAnimatingRef.current = false;
    };
    // Scroll timeline to the start of the project
    animate(x, -cardStartPosition, {
      duration: 0.5,
      ease: "easeOut",
      onComplete: reset,
      onStop: reset,
    });
  };

  return (
    <Motion.div
      style={{ x: y, width: ALIGN_BUTTON_WIDTH, height: TIMELINE_ITEM_HEIGHT }}
      className={styles["align-card"]}
    >
      {isLeft && (
        <ChevronLeft size={20} stroke={palette.primary} strokeWidth={2} />
      )}
      <button
        style={{
          backgroundColor: palette.soft,
          borderColor: palette.primary,
          color: palette.primary,
        }}
        className={clsx("btn", "flex-center", styles["align-button"])}
        onPointerDownCapture={(e) => {
          // Prevent dragging on the timeline
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={handleAlignProject}
      >
        <Icon size={16} stroke="currentColor" />
        <span className="sr-only">Выровнять проект {project.name}</span>
      </button>
      {!isLeft && (
        <ChevronRight size={20} stroke={palette.primary} strokeWidth={2} />
      )}
    </Motion.div>
  );
};

export default TimelineAlignButton;
