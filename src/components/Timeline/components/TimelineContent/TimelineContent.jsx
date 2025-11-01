import { useEffect } from "react";
import { motion as Motion, useTransform } from "motion/react";

import styles from "./TimelineContent.module.scss";
import { useTimelineTrackContext } from "../../context";
import TimelineTrack from "../TimelineTrack/TimelineTrack";
import TimelineItems from "../TimelineItems/TimelineItems";
import TopPanel from "../TopPanel/TopPanel";
import useTimelineStore from "../../store";

const TimelineContent = () => {
  const { x, containerRef } = useTimelineTrackContext();

  // Drag area/visible window moves in the opposite direction
  const y = useTransform(x, (v) => -v);

  const stopInteraction = useTimelineStore((state) => state.stopInteraction);
  // Cleanup any ongoing interactions on unmount
  useEffect(() => stopInteraction, [stopInteraction]);

  return (
    <div ref={containerRef} className={styles["timeline"]}>
      <TopPanel />
      <Motion.div
        drag="x"
        dragElastic={0}
        style={{ x }}
        className={styles["drag-container"]}
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
