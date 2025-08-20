export const getCoordinates = (e) => {
  if (e.touches && e.touches.length > 0) {
    // Touch event
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  } else {
    // Pointer/mouse event
    return { x: e.clientX, y: e.clientY };
  }
};
