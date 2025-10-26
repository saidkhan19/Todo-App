import { useRef } from "react";
import { animate, motion as Motion, useTransform } from "motion/react";
import clsx from "clsx/lite";
import { ChevronLeft, ChevronRight } from "lucide-react";

import styles from "./TimelineAlignButton.module.scss";
import { getColorPalette, getIcon } from "@/utils/projects";
import { getTimelineCardStartPosition } from "../../utils";
import { useTimelineTrackContext } from "../../context";
import { alignCardWidth } from "../../consts";

const TimelineAlignButton = ({ project }) => {
  const isAnimatingRef = useRef(null);
  const { x, baseDate, containerWidth } = useTimelineTrackContext();

  const palette = getColorPalette(project.palette);
  const Icon = getIcon(project.icon).icon;

  const cardStartPosition = getTimelineCardStartPosition(
    baseDate,
    project.startDate
  );

  const isLeft = x.get() < cardStartPosition;
  const y = useTransform(x, (v) =>
    isLeft ? -v : -v + containerWidth - alignCardWidth
  );

  const alignHandler = () => {
    if (isAnimatingRef.current) return;

    const reset = () => {
      isAnimatingRef.current = false;
    };

    isAnimatingRef.current = true;
    animate(x, -cardStartPosition, {
      duration: 0.5,
      ease: "easeOut",
      onComplete: reset,
      onStop: reset,
    });
  };

  return (
    <Motion.div
      style={{ x: y, width: alignCardWidth }}
      className={styles["align-card"]}
    >
      {isLeft && (
        <ChevronLeft size={20} stroke={palette.primary} strokeWidth={2} />
      )}
      <button
        data-timeline-drag-disabled
        style={{
          backgroundColor: palette.soft,
          borderColor: palette.primary,
          color: palette.primary,
        }}
        className={clsx("btn", "flex-center", styles["align-button"])}
        onClick={alignHandler}
      >
        <Icon size={16} stroke="currentColor" />
      </button>
      {!isLeft && (
        <ChevronRight size={20} stroke={palette.primary} strokeWidth={2} />
      )}
    </Motion.div>
  );
};

export default TimelineAlignButton;
