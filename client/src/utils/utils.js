export const composeURL = (body) => {
  const baseURL = 'http://localhost:5555'
  return `${baseURL}/${body}`
}

export const getImgURL = (path, size='w500') => {
  const imgBase = `https://image.tmdb.org/t/p`
  return `${imgBase}/${size}/${path}`
}

