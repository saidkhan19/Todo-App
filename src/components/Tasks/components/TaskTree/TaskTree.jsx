import TaskList from "./components/TaskList/TaskList";
import TaskExpansionProvider from "./TaskExpansionProvider";
import TasksProvider from "./TasksProvider";

const TaskTree = () => {
  return (
    <TasksProvider>
      <TaskExpansionProvider>
        <TaskList />
      </TaskExpansionProvider>
    </TasksProvider>
  );
};

export default TaskTree;
