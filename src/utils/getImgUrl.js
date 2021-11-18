export const getImgUrl = (url) => {
  // url format => https://www.youtube.com/embed/sfJiR2sn3mg
  // to return => https://img.youtube.com/vi/sfJiR2sn3mg/maxresdefault.jpg by extracting video id
  let regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  let match = url.match(regExp);
  if (match && match[2].length === 11) {
    const imgUrl = `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`;
    return imgUrl;
  } else {
    return null;
  }
};
