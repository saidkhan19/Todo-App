import TimelineTrackProvider from "./components/TimelineTrackProvider/TimelineTrackProvider";
import TimelineContent from "./components/TimelineContent/TimelineContent";

const Timeline = () => {
  return (
    <TimelineTrackProvider>
      <TimelineContent />
    </TimelineTrackProvider>
  );
};

export default Timeline;
