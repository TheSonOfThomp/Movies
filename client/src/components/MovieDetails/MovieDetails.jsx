import React, {useEffect, useState} from 'react';
import {
  useParams
} from "react-router-dom";
import moment from 'moment';
import axios from 'axios';
import { composeURL, getImgURL } from '../../utils/utils';
import _ from 'lodash'
import './MovieDetails.scss';

// Vibrant lets us get a custom color for every movie
// We pass in the poster image, and get back the main colors in it
import Vibrant from 'node-vibrant'
import MovieListItem from '../MovieListItem/MovieListItem';

const MovieDetails = () => {

  const [movie, setMovie] = useState('')
  const [backgroundColor, setBackgroundColor] = useState('')
  const { id } = useParams() // get the movie id from the URL

  const getMovie = (id) => {
    axios.get(composeURL(`movie/${id}`)).then(resp => {
      setMovie(resp.data)
      Vibrant.from(getImgURL(resp.data.backdrop_path))
        .getPalette()
        .then((palette) => setBackgroundColor(palette.DarkVibrant.getHex()))
    })
  }
  
  useEffect(() => {
    // if the movie var doesn't exist, 
    // or is different from the url param, get new data.
    if (!movie || (movie.id !== parseInt(id) )) {
      // doesn't necessarily need to be debounced but I added this for testing so I'll keep it
      _.debounce(getMovie, 100)(id)
    }
    return () => {};
  })
  
  return (
    <div className="movie-details-wrapper"
      style={{ backgroundColor: backgroundColor}} // custom bg color
    >
      <img 
        className="backdrop_image" 
        src={getImgURL(movie.backdrop_path, 'original')} 
        alt=""
        role="presentation"
      />
      {/* 
        Ideally the image shouldn't go before the content (for a11y reasons)
        but since it's a presentational image, it should be fine. ()
      */}
      <div className="movie-details-header">
        <div className="movie-details">
          <div className="movie-title">
            <h2>{movie.title}</h2>
            <span className="release-year">({moment(movie.release_date).year()})</span>
          </div>

          <div className="movie-rating">
            <h3>User score</h3>
            <span className="rating-number">{Math.round(movie.vote_average * 10).toString()}</span>
          </div>

          <div className="movie-summary">
            <h3>Summary</h3>
            <p>{movie.overview}</p>
          </div>
        </div>

        <h3>Top Cast</h3>
        <div className="cast-wrapper">
          {movie.cast &&
            movie.cast.slice(0, 9).map(person => {
              return (
                // TODO: This should be its own component, similar to MovieListItem
                <div className="cast-member" key={person.cast_id}>
                  <span className="cast-member-image">
                    <img src={getImgURL(person.profile_path)} alt={person.name} />
                  </span>
                  <span>{person.name}</span>
                </div>
              )
            })
          }
        </div>

        {movie.related && movie.related.length > 0 && 
          <div className="related-movies-wrapper">
          <h3>Related</h3>
            <ul>
            {movie.related &&
              movie.related.slice(0, 3).map(related => {
                return (
                  <MovieListItem 
                    key={related.id}
                    movie={related}
                  />
                )
              })
            }
            </ul>
          </div>
        }
        <img className="poster_image" src={getImgURL(movie.poster_path)} alt={`${movie.title} poster`}/>
      </div>
    </div>
)};

export default MovieDetails;
