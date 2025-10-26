import styles from "./TimelineCard.module.scss";
import { getColorPalette } from "@/utils/projects";
import { useTimelineTrackContext } from "../../context";
import { daysBetween } from "@/utils/date";
import { cellWidth } from "../../consts";
import TimelineCardInfoShort from "./TimelineCardInfoShort";
import TimelineCardInfoLong from "./TimelineCardInfoLong";
import { getTimelineCardStartPosition } from "../../utils";

const TimelineCard = ({ project }) => {
  const { baseDate } = useTimelineTrackContext();

  const width =
    (daysBetween(project.startDate, project.endDate) + 1) * cellWidth;
  const offset = getTimelineCardStartPosition(baseDate, project.startDate);

  const palette = getColorPalette(project.palette);
  const isShort = width <= cellWidth;

  return (
    <div
      data-timeline-drag-disabled
      style={{
        backgroundColor: palette.soft,
        borderColor: palette.primary,
        width: `${width}px`,
        color: palette.primary,
        transform: `translateX(${offset}px)`,
      }}
      className={styles["card"]}
    >
      {isShort ? (
        <TimelineCardInfoShort project={project} />
      ) : (
        <TimelineCardInfoLong
          project={project}
          cardStartPosition={offset}
          width={width}
        />
      )}
    </div>
  );
};

export default TimelineCard;
