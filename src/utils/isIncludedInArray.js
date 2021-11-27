export const isIncludedInArray = (arr, id) => {
  return !!arr.find((item) => item._id === id);
};
