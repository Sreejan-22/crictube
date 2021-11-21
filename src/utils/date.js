export const getDate = (dateString) => {
  const now = new Date(dateString);
  let day = now.getDate();
  day = day < 10 ? "0" + day : day;
  let month = now.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  const year = now.getFullYear();
  const date = `${day}/${month}/${year}`;

  return date;
};
