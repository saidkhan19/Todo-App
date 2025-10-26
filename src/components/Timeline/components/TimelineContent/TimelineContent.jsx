import { useEffect, useRef } from "react";
import { motion as Motion, useTransform } from "motion/react";

import styles from "./TimelineContent.module.scss";
import { useTimelineTrackContext } from "../../context";
import TimelineTrack from "../TimelineTrack/TimelineTrack";
import TimelineItems from "../TimelineItems/TimelineItems";

const onTimelinePointerDownCapture = (e) => {
  // Prevent dragging on specific children
  if (e.target.closest("[data-timeline-drag-disabled]")) {
    e.stopPropagation();
    e.preventDefault();
  }
};

const TimelineContent = () => {
  const containerRef = useRef();
  const { x, setContainerSize } = useTimelineTrackContext();

  const y = useTransform(x, (v) => -v);

  useEffect(() => {
    if (containerRef.current)
      setContainerSize(containerRef.current.clientWidth);
  }, [setContainerSize]);

  return (
    <div ref={containerRef} className={styles["timeline"]}>
      <div className={styles["timeline__top-panel"]}>Апрель 2025</div>
      <Motion.div
        drag="x"
        dragElastic={0}
        style={{ x }}
        className={styles["drag-container"]}
        onPointerDownCapture={onTimelinePointerDownCapture}
      >
        <Motion.div
          className={styles["drag-area"]}
          style={{ x: y, height: "170px" }}
        />
        <TimelineTrack />
        <TimelineItems />
      </Motion.div>
    </div>
  );
};

export default TimelineContent;
