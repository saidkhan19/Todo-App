import { DEFAULT_PROJECT_ID } from "@/consts/database";

export const mockItems = [
  // Root level projects
  {
    id: "project-1",
    title: "Website Redesign",
    type: "project",
    level: 0,
    parentId: null,
    userId: "user123",
    deleted: false,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "project-2",
    title: "Mobile App",
    type: "project",
    level: 0,
    parentId: null,
    userId: "user123",
    deleted: false,
    createdAt: new Date("2024-01-02"),
  },

  // Tasks under Website Redesign project
  {
    id: "task-1",
    title: "Design mockups",
    type: "task",
    level: 1,
    parentId: "project-1",
    userId: "user123",
    deleted: false,
    createdAt: new Date("2024-01-03"),
  },
  {
    id: "task-2",
    title: "Frontend development",
    type: "task",
    level: 1,
    parentId: "project-1",
    userId: "user123",
    deleted: false,
    createdAt: new Date("2024-01-04"),
  },

  // Subtasks under Frontend development
  {
    id: "subtask-1",
    title: "Setup React project",
    type: "task",
    level: 2,
    parentId: "task-2",
    userId: "user123",
    deleted: false,
    createdAt: new Date("2024-01-05"),
  },
  {
    id: "subtask-2",
    title: "Implement header component",
    type: "task",
    level: 2,
    parentId: "task-2",
    userId: "user123",
    deleted: false,
    createdAt: new Date("2024-01-06"),
  },
  {
    id: "subtask-3",
    title: "Add responsive styles",
    type: "task",
    level: 2,
    parentId: "task-2",
    userId: "user123",
    deleted: false,
    createdAt: new Date("2024-01-07"),
  },

  // Tasks under Mobile App project
  {
    id: "task-3",
    title: "User research",
    type: "task",
    level: 1,
    parentId: "project-2",
    userId: "user123",
    deleted: false,
    createdAt: new Date("2024-01-08"),
  },
  {
    id: "task-4",
    title: "Backend API",
    type: "task",
    level: 1,
    parentId: "project-2",
    userId: "user123",
    deleted: false,
    createdAt: new Date("2024-01-09"),
  },

  // Standalone root-level task
  {
    id: "task-5",
    title: "Update portfolio",
    type: "task",
    level: 0,
    parentId: DEFAULT_PROJECT_ID,
    userId: "user123",
    deleted: false,
    createdAt: new Date("2024-01-10"),
  },
];

// For testing edge cases
export const emptyMockItems = [];

export const singleItemMock = [
  {
    id: "single-task",
    title: "Lonely task",
    type: "task",
    level: 0,
    parentId: DEFAULT_PROJECT_ID,
    userId: "user123",
    deleted: false,
    createdAt: new Date("2024-01-01"),
  },
];

// For testing deeply nested structure
export const deeplyNestedMockItems = [
  {
    id: "root",
    title: "Root Project",
    type: "project",
    level: 0,
    parentId: null,
    userId: "user123",
    deleted: false,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "level-1",
    title: "Level 1 Task",
    type: "task",
    level: 1,
    parentId: "root",
    userId: "user123",
    deleted: false,
    createdAt: new Date("2024-01-02"),
  },
  {
    id: "level-2",
    title: "Level 2 Subtask",
    type: "task",
    level: 2,
    parentId: "level-1",
    userId: "user123",
    deleted: false,
    createdAt: new Date("2024-01-03"),
  },
  {
    id: "level-3",
    title: "Level 3 Sub-subtask",
    type: "task",
    level: 3,
    parentId: "level-2",
    userId: "user123",
    deleted: false,
    createdAt: new Date("2024-01-04"),
  },
];

export const mockItem = {
  id: "task",
  title: "Lonely task",
  type: "task",
  level: 0,
  parentId: DEFAULT_PROJECT_ID,
  userId: "user123",
  deleted: false,
  createdAt: new Date("2024-01-01"),
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-01-01"),
};
