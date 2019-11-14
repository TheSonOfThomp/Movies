## Minimum Feature Set

1. When first loaded, the user should see a list of the most [popular movies](https://developers.themoviedb.org/3/movies/get-popular-movies) and a search bar.
    
    - Create a `MoviesList`
    - On load, query the backend for a list of 'popular movies'
    - Loop a `MovieItem` component over the returned array of movies


2. A user should be able to [search](https://developers.themoviedb.org/3/search/search-movies) for a movie by title in the search bar, and the matching results should show up in the list of movies.

    - Use native `input` element with `value={x}` and `onChange` handler
    - Parent should query the backend
    - Update the list with array of results
    - No results state

3. A user can click on a [movie](https://developers.themoviedb.org/3/movies) in the list and be taken to a page that displays more details for the movie (title, movie poster, release date, cast, synopsis, etc)

    - Replace `MoviesList` component with a `MovieDetails` component 

## Technical Requirements

1. Using Node.js, create a backend application that accepts requests to power the features above. This app should query the Movie DB API and return the results to the user.

    - Use `express-generator`

2. Compose your UI using **React** or Vue.

    - Use `create-react-app`

3. Please include a README.md with step-by-step instructions for running the app. Be careful to ensure there are not local dependencies that have been overlooked in the readme.


## Extra Points (optional)
1. Add more features that you think are cool! Some ideas:
    - Add filtering by genre
    - Show related movies
    - Add a page for individual actor details
2. Add a caching layer for your requests to the 3rd party API.
3. This not a design exercise, but UX polish that demonstrates your mastery of your frontend tool set is encouraged.
4. Add unit testing for your API.


# Planning

1. Setup boilerplate backend with `npx express-generator api`
    - Remove default routes, so we only have only `/movies`
2. Setup boilerplate frontend with `npx create-react-app client`

3. Build out basic `GET` requests on the back end
    - `/movie/popular` should return the most popular movies
        - Optional: add `:max` param to return the `max` most popular
    - `/movie/search/:query` should return the matching movies
    - `movie/:movieId` should return the details for this movie
    
4. Query backend for "Popular movies" and render those in a `MovieList` component

5. Add a textbox and query the backend for the entered text
    - Nice to have: a 'no results' view
    - Optional: add a live search on `keyup` (with debounce) 

6. Add ability to click on a movie and query backend for that movie. Remove `MoviesList` and render `MovieComponent`
    - Optional: set up React routing (`react-router`)


7. Optional: Add filtering by genre
8. Optional: Show related movies
9. Add a page for individual actor details