const analytics = {
  countCompletedItems: (items) => {
    return {
      completed: items.reduce(
        (prev, curr) => (curr?.completed ? prev + 1 : prev),
        0
      ),
      overall: items.length,
    };
  },

  calculateProductivity: (items) => {
    const days = new Map();

    // Sort out all days
    items.forEach((item) => {
      const key = item.endDate.toISOString();
      const day = days.get(key) || [];
      days.set(key, [...day, item]);
    });

    const dailyProductivity = [];

    // Calculate productivity for each day
    for (let day of days.values()) {
      const count = analytics.countCompletedItems(day);
      dailyProductivity.push(count.completed / count.overall);
    }

    // Return avarage of all days
    return (
      (dailyProductivity.reduce((sum, prod) => sum + prod, 0) /
        dailyProductivity.length) *
      100
    );
  },
};

export default analytics;
