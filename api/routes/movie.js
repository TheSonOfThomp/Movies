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
  https.get(requestURL, response => {

    if (isError(response)) return res.status(res.statusCode)

    let data = ''
    response.on('data', chunk => {
      data += chunk
    })
    response.on('end', () => res.json(JSON.parse(data).results))
  })
  // res.send(`You're gonna be popular! I'll teach you the proper poise, When you talk to boys, Little ways to flirt and flounce,`)
})

module.exports = router;

// TODO - move to utils folder

// Params: body of request (string)
// Reurn: full request url
function composeTMDbURL(body) {
  const key = process.env.TMDB_API_KEY;
  const baseRoute = `https://api.themoviedb.org/3/`;
  return `${baseRoute}${body}?api_key=${key}`
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