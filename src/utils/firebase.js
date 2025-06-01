export const itemConverter = {
  toFirestore: (item) => {
    const { _id, ...data } = item; // Remove ID before saving
    return data;
  },

  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id, // Add ID from document
      isLoading: snapshot.metadata.hasPendingWrites,
      ...data,
    };
  },
};
