import React, {useState, useEffect } from 'react';
import MovieList from './components/MovieList';
import axios from 'axios';
import './styles/main.scss';

const composeURL = (body) => {
  const baseURL = 'http://localhost:5555'
  return `${baseURL}/${body}`
}

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
    const searchQueryUrl = composeURL(`movie/search/${queryString}`)
    axios.get(searchQueryUrl).then(resp => {
      console.log(resp.data)
      setMoviesList(resp.data)
    })
  }

  return (
    <div className="app">
      <header>
        <h1>The Movie Database</h1>
        <input 
          type="text" 
          placeholder="Find a movie..."
          value={searchQuery}
          onChange={handleInput}
        ></input>
      </header>
      <main>
        <h2>{searchQuery ? `'${searchQuery}'` : 'Popular movies'}</h2>
        <MovieList
          movies={moviesList}
        />
      </main>
    </div>
  );
}

export default App;
