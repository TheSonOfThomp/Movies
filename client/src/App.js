import React, {useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import axios from 'axios';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails/MovieDetails';
import './styles/main.scss';
import { composeURL } from './utils/utils';
import Header from './components/Header/Header';


const App = () => {
  const [moviesList, setMoviesList] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMovie, setSelectedMovie] = useState()

  useEffect(() => {
    if (moviesList.length === 0) {
      getPopularMovies()
    }

    // cleanup
    return () => {};
  })

  const handleInput = ($event) => {
    const query = $event.target.value
    console.log(query)
    setSearchQuery(query)
    if(query.length === 0) {
      getPopularMovies()
    } else {
      searchForMovie(query)
    }
  }

  const getPopularMovies = () => {
    // TODO use localstorage to cache the popular movies so we don't have to hit the backend everytime
    const popularURL = composeURL('movie/popular')
    axios.get(popularURL).then(resp => {
      setMoviesList(resp.data)
    })
  }

  // TODO : debounce this
  const searchForMovie = (queryString) => {
    console.log(queryString)
    const searchQueryUrl = composeURL(`movie/search/${queryString}`)
    axios.get(searchQueryUrl).then(resp => {
      console.log(resp.data)
      setMoviesList(resp.data)
    })
  }

  return (
    <div className="app">
      <Router>
        <Switch>
          
          <Route path="/details/:id">
            <Header
              title="The Movie Database"
            />
            <main>
              <MovieDetails
                movie={selectedMovie}
              />
            </main>
          </Route>

          <Route path="/">
            <Header
              title="The Movie Database"
              isSearchBarVisible={true}
              searchQuery={searchQuery}
              handleInput={handleInput}
            />
            <main>
              <MovieList
                title={searchQuery ? `'${searchQuery}'` : 'Popular movies'}
                movies={moviesList}
              />
            </main>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
