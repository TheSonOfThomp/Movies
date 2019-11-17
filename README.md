# Getting started 

## Backend
To run the backend, first you'll need an API key from [The Movie Database](https://developers.themoviedb.org/3/getting-started). Once you have your v3 key, add it to a `.env` file in the `/api/` folder as `TMDB_API_KEY={my_api_key}`.
Once you've done that run the commands
```
cd ./api
npm run watch
```
to run the backend in dev mode (or `npm run start` to just start it)

## Frontend
To run the frontend in dev mode, go to `cd ./client` and run `yarn start`

# TODO
1. Add filtering by genre

I'd like to add filtering by genre. To do this, I would need to add a genres nav bar in the header. This would be populated by a request to the TMDb api endpoint: `/genre/movie/list`. Then I'd add a param to the `/popular` endpoint that is the requested genre. On the backend I'd filter for movies of that genre and return that array. (Would likely need to get multiple "pages" of popular movies)

~~2. Show related movies~~

Currently done by appending related movies to the data returned from the api. This could also be done by hitting a separate endpoint, but this involves more `http` requests from the client (could have performance implications)

3. Add a page for individual actor details

Similar to how the movies page works, an actor details page would look at the url params to populate an actor's profile

4. Add a caching layer for your requests to the 3rd party API.

By caching data in the backend, we can save on calls to the TMDb api. We can also cache data on the frontend to save on `http` requests on from the client

5. Add unit testing for your API.

I should test that each api endpoint returns the expected data, or returns an appropriate status code