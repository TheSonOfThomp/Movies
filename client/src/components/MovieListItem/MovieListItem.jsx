import React from 'react';
import PropTypes from 'prop-types';
import './MovieListItem.scss'
const imgBase = 'https://image.tmdb.org/t/p/w500'

const MovieListItem = (props) => {
  const imgURL = `${imgBase}${props.movie.backdrop_path}`
  return (
  <li className="movie-list-item-wrapper"
    style={{backgroundImage: `url(${imgURL})`}}
  >
    <h3>
      {props.movie.title}
    </h3>
  </li>
)};

MovieListItem.propTypes = {
  movie: PropTypes.object,
};

MovieListItem.defaultProps = {
  // bla: 'test',
};

export default MovieListItem;
