import React from 'react';
import PropTypes from 'prop-types';
import {
  Link
} from "react-router-dom";
import './MovieListItem.scss'
import { getImgURL } from '../../utils/utils';


const MovieListItem = (props) => {
  const imgURL = getImgURL(props.movie.backdrop_path)
  return (
  <li className="movie-list-item-wrapper"
    // style={{ backgroundImage: `url(${imgURL})` }}
  >
    <Link to={`/details/${props.movie.id}`}
    >
      <h3>
        {props.movie.title}
      </h3>
      {props.movie.backdrop_path &&
        <img className="movie-list-bg_img" src={imgURL} alt={props.movie.title}/>
      }
    </Link>
  </li>
)};

MovieListItem.propTypes = {
  movie: PropTypes.object,
};

MovieListItem.defaultProps = {
  // bla: 'test',
};

export default MovieListItem;
