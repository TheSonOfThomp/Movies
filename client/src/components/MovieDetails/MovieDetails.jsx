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


// A user can click on a movie in the list and be taken to a page that displays more details for the movie 
// (title, movie poster, release date, cast, synopsis, etc)

const MovieDetails = () => {

  const [movie, setMovie] = useState('')
  const [backgroundColor, setBackgroundColor] = useState('')
  const { id } = useParams()

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
    // TODO add a loading spinner
    if (!movie || (movie.id !== parseInt(id) )) {
      _.debounce(getMovie, 100)(id)
    }
    return () => {};
  })
  
  return (
    <div className="movie-details-wrapper"
      style={{ backgroundColor: backgroundColor}}
    >
      <img 
        className="backdrop_image" 
        src={getImgURL(movie.backdrop_path, 'original')} 
        alt=""
        role="presentation"
      />
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
