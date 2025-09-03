import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import SpinnerBox from "@/components/UI/SpinnerBox";
import Content from "./Content";

const GridContent = () => {
  const { items, loading, error } = useProjectsAndTasksContext();

  if (loading)
    return (
      <div role="row" aria-rowindex={1} aria-rowspan={7}>
        <SpinnerBox height="lg" />
      </div>
    );

  if (error)
    // TODO: Make reusable Error info component
    return (
      <div role="row" aria-rowindex={1} aria-rowspan={7}>
        Error!
      </div>
    );

  return <Content items={items} />;
};

export default GridContent;
