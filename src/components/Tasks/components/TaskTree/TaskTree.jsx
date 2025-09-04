import TaskList from "./components/TaskList/TaskList";
import TaskExpansionProvider from "./TaskExpansionProvider";

const TaskTree = () => {
  return (
    <TaskExpansionProvider>
      <TaskList />
    </TaskExpansionProvider>
  );
};

export default TaskTree;
