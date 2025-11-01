export const setCursor = (cursor) => {
  document.body.style.cursor = cursor;
};

export const resetCursor = () => {
  setCursor("default");
};
