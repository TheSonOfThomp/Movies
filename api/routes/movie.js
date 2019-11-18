const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();

// All routes here are prefised with movie/

// Catch all route
router.get('/', (req, res) => {
  res.send(`Welcome to ATMDb`);
});

// ENDPOINT
// Returns an array of popular movies
router.get('/popular', (req, res) => {
  const requestURL = composeTMDbURL('movie/popular')
  
  // Hit the TMDb api
  axios.get(requestURL)
    .then(tmbdResponse => {
      data = tmbdResponse.data
      if (data.results.length === 0) {
        res.status(400)
      } else {
        res.json(data.results)
      }
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(400);
    })
})

// ENDPOINT
// Returns an array of movies that match the searhc results
router.get('/search/:query', (req, res) => {
  const requestURL = composeTMDbURL(`search/movie`, ['language=en-US', `query=${req.params.query}`, 'page=1', 'include_adult=false'])

  axios.get(requestURL).then(tmdbResp => {
    res.json(tmdbResp.data.results)
  })
  .catch(err => {
    res.sendStatus(400)
  })
})

// ENDPOINT
// Returns an object for the given movie id
router.get('/:movieId', (req, res) => {
  const requestURL = composeTMDbURL(`movie/${req.params.movieId}`, ['language=en-US', 'include_adult=false'])
  
  // Since the default movie response doesn't give the cast or related movies
  // we need to send multiple requests to the API.
  // Ideally I'd add more params to the url, or different endpoints but this is good enough for a POC.
  const castURL = composeTMDbURL(`movie/${req.params.movieId}/credits`, ['language=en-US'])
  const relatedURL = composeTMDbURL(`movie/${req.params.movieId}/similar`, ['language=en-US'])

  const moviesRequest = axios.get(requestURL)
  const castRequest = axios.get(castURL);
  const relatedRequest = axios.get(relatedURL);

  Promise.all([moviesRequest, castRequest, relatedRequest]).then(tmdbResp => {
    const movie = tmdbResp[0].data
    const cast = tmdbResp[1].data
    movie.cast = cast.cast
    movie.related = tmdbResp[2].data.results
    res.json(movie)
  })
  .catch(err => {
    res.sendStatus(400)
  })
})

module.exports = router;

// TODO - move to a utils folder
// Takes the api endpoint stub and url params and returns the full api endpoint url
function composeTMDbURL(body, params = []) {
  const key = process.env.TMDB_API_KEY;
  const baseRoute = `https://api.themoviedb.org/3/`;
  const paramsString = !!params ? `&${ params.join('&') }` : ``
  return `${baseRoute}${body}?api_key=${key}${paramsString}`
}