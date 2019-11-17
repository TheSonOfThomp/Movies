const express = require('express');
const https = require('https');
const router = express.Router();
const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();

// All routes here are prefised with movie/

// Catch all route
router.get('/', (req, res) => {
  res.send(`Welcome to ATMDb`);
});

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

  // res.send(`You're gonna be popular! I'll teach you the proper poise, When you talk to boys, Little ways to flirt and flounce,`)
})

// Get the queried movie list
router.get('/search/:query', (req, res) => {
  const requestURL = composeTMDbURL(`search/movie`, ['language=en-US', `query=${req.params.query}`, 'page=1', 'include_adult=false'])

  axios.get(requestURL).then(tmdbResp => {
    res.json(tmdbResp.data.results)
  })
  .catch(err => {
    res.sendStatus(400)
  })
})

// Since the default movie response doesn't give the cast or related movies
// we need to send multiple requests to the API.

// Ideally I'd add more params to the url, or different targets but this is good enough for a POC.

router.get('/:movieId', (req, res) => {
  const requestURL = composeTMDbURL(`movie/${req.params.movieId}`, ['language=en-US', 'include_adult=false'])
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

// TODO - move to utils folder

// Params: body of request (string)
// Reurn: full request url
function composeTMDbURL(body, params = []) {
  const key = process.env.TMDB_API_KEY;
  const baseRoute = `https://api.themoviedb.org/3/`;
  const paramsString = !!params ? `&${ params.join('&') }` : ``
  return `${baseRoute}${body}?api_key=${key}${paramsString}`
}

// Params: respones : HTTPRequest
// Reurn: isError : Boolean
function isError(res) {
  const { statusCode } = res;
  let error;
  // Error handling
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
      `Status Code: ${statusCode}`);
  }
  if (error) {
    console.error(error.message);
    // Consume response data to free up memory
    res.resume();
    return true;
  } else {
    return false
  }
}