export const getProgressInformation = (childItems) => {
  return {
    completed: childItems.reduce(
      (prev, curr) => (curr?.completed ? prev + 1 : prev),
      0
    ),
    overall: childItems.length,
  };
};
