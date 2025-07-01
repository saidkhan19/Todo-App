export const itemConverter = {
  toFirestore: (item) => item,

  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id, // Add ID from document
      isLoading: snapshot.metadata.hasPendingWrites,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      startDate: data.startDate?.toDate(),
      endDate: data.endDate?.toDate(),
    };
  },
};
