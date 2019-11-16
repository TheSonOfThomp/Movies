import React from 'react';
import PropTypes from 'prop-types';
import MovieListItem from '../MovieListItem/MovieListItem';
import './MovieList.scss';

const MovieList = (props) => (
  <div className="movie-list-wrapper">
    <ul>
      {props.movies.map(movie => {
        return (
          <MovieListItem
            key={movie.id}
            movie={movie}
          />
        )
      })}
    </ul>
  </div>
);

MovieList.propTypes = {
  movies: PropTypes.array
};

MovieList.defaultProps = {
  // bla: 'test',
};

export default MovieList;
