const express = require('express');
const https = require('https');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

// All routes here are prefised with movie/

// Catch all route
router.get('/', (req, res) => {
  res.send(`Welcome to ATMDb`);
});

router.get('/popular', (req, res) => {
  const requestURL = composeTMDbURL('movie/popular')

  // Hit the TMDb api
  https.get(requestURL, tmbdResponse => {
    
    // If something goes wrong with the request, return a 400
    if (isError(tmbdResponse)) return tmbdResponse.status(tmbdResponse.statusCode)

    let data = ''
    tmbdResponse.on('data', chunk => {
      data += chunk
    })
    // Return the results as json
    tmbdResponse.on('end', () => {
      const json = JSON.parse(data)
      if (json.results.length === 0) {
        res.status(400)
      } else {
        res.json(json.results)
      }
    })
  })
  // res.send(`You're gonna be popular! I'll teach you the proper poise, When you talk to boys, Little ways to flirt and flounce,`)
})

// Get the queried movie
// test with: 'Harry Poter'
// test with: 'qwertyuiop'
router.get('/search/:query', (req, res) => {
  const requestURL = composeTMDbURL(`search/movie`, ['language=en-US', `query=${req.params.query}`, 'page=1', 'include_adult=false'])
  https.get(requestURL, tmbdResponse => {
    if (isError(tmbdResponse)) return res.status(tmbdResponse.statusCode)
    let data = ''
    tmbdResponse.on('data', chunk => {
      data += chunk
    })
    tmbdResponse.on('end', () => {
      const json = JSON.parse(data)
      if(json.results.length === 0) {
        res.status(400)
      } else {
        res.json(json.results)
      }
    })
  })
})

// test with: 671 // Harry Potter and the Philosopher's Stone
// test with 1 // 400 response
router.get('/:movieId', (req, res) => {
  const requestURL = composeTMDbURL(`movie/${req.params.movieId}`, ['language=en-US', 'include_adult=false'])
  https.get(requestURL, tmbdResponse => {
    if (isError(tmbdResponse)) return res.status(tmbdResponse.statusCode)
    let data = ''
    tmbdResponse.on('data', chunk => {
      data += chunk
    })
    tmbdResponse.on('end', () => {
      const json = JSON.parse(data)
      res.json(json)
    })
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