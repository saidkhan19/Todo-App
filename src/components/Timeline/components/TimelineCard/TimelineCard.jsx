import clsx from "clsx/lite";

import styles from "./TimelineCard.module.scss";
import { getColorPalette } from "@/utils/projects";
import { daysBetween } from "@/utils/date";
import { useTimelineTrackContext } from "../../context";
import { cellWidth } from "../../consts";
import { getTimelineCardStartPosition } from "../../utils";
import TimelineCardInfoShort from "./TimelineCardInfoShort";
import TimelineCardInfoLong from "./TimelineCardInfoLong";

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

      <button
        title="Изменить дату начала"
        className={clsx(
          "btn",
          styles["resize-button"],
          styles["resize-button--left"]
        )}
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
      >
        <span className="sr-only">Изменить дату окончания</span>
      </button>
    </div>
  );
};

export default TimelineCard;
