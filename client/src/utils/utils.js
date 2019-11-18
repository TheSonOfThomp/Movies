
// Takes the body of the api endpoint and returns a full url
export const composeURL = (body) => {
  const baseURL = 'http://localhost:5555'
  return `${baseURL}/${body}`
}

// Takest the image path as returned by tmdb, and returns the image url
export const getImgURL = (path, size='w500') => {
  const imgBase = `https://image.tmdb.org/t/p`
  return `${imgBase}/${size}/${path}`
}

