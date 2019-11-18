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

  useEffect(() => {
    if (moviesList.length === 0) {
      getPopularMovies()
    }
    
    // cleanup
    return () => {};
  })

  const handleInput = ($event) => {
    const query = $event.target.value
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

  const searchForMovie = (queryString) => {
    // TODO : debounce this function (see MovieDetails for a debounce example)
    const searchQueryUrl = composeURL(`movie/search/${queryString}`)
    axios.get(searchQueryUrl).then(resp => {
      setMoviesList(resp.data)
    })
  }


  return (
    <div className="app" >
      <Router>
        <Switch>
          <Route path="/details/:id">
            <Header
              title="The Movie Database"
            />
            <main>
              <MovieDetails/>
            </main>
          </Route>

          <Route path="/">
            {/* 
                The header components are separate from the page components
                in order to keep the header-related logic in the App.js file instead of in the header.
            */}
            <Header
              title="The Movie Database"
              isSearchBarVisible={true}
              searchQuery={searchQuery}
              handleInput={handleInput} // <- TODO: This should be a hook within the Header component
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
